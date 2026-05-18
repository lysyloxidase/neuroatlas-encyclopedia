import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import YAML from "yaml";

const ROOT = process.cwd();
const CONTENT_ROOT = join(ROOT, "src/content/structures/level1");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
    } else if (entry.name.endsWith(".yaml")) {
      files.push(path);
    }
  }
  return files;
}

function collectDoiValues(value, output = new Set()) {
  if (!value || typeof value !== "object") return output;
  if (Array.isArray(value)) {
    for (const item of value) collectDoiValues(item, output);
    return output;
  }

  for (const [key, child] of Object.entries(value)) {
    if (key === "doi" && typeof child === "string") {
      output.add(child);
    } else {
      collectDoiValues(child, output);
    }
  }
  return output;
}

const files = await walk(CONTENT_ROOT);
const dois = new Set();
for (const file of files) {
  const parsed = YAML.parse(await readFile(file, "utf8"));
  for (const doi of collectDoiValues(parsed)) {
    dois.add(doi);
  }
}

const failures = [];
for (const doi of [...dois].sort()) {
  const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    failures.push(`${doi} -> ${response.status}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Verified ${dois.size} unique DOI values with CrossRef.`);
