import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import YAML from "yaml";

const ROOT = process.cwd();
const SCAN_ROOTS = [
  join(ROOT, "src/content/structures"),
  join(ROOT, "src/data"),
];

// CrossRef "polite pool": include mailto in User-Agent to get higher,
// stabler rate limits. https://api.crossref.org/swagger-ui/index.html#etiquette
const USER_AGENT =
  "neuroatlas-encyclopedia/1.0 (https://github.com/lysyloxidase/neuroatlas-encyclopedia; mailto:lysyloxidase@users.noreply.github.com)";

const MAX_RETRIES = 4;
const BASE_BACKOFF_MS = 1500;
const REQUEST_GAP_MS = 120;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
    } else if (entry.name.endsWith(".yaml") || entry.name.endsWith(".json")) {
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

async function verifyDoi(doi) {
  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  let lastStatus = 0;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": USER_AGENT,
      },
    });
    if (response.ok) return { ok: true };
    lastStatus = response.status;
    // Retry on rate-limit and transient server errors
    if (response.status === 429 || response.status >= 500) {
      const retryAfterHeader = response.headers.get("retry-after");
      const retryAfterMs = retryAfterHeader
        ? Number.parseInt(retryAfterHeader, 10) * 1000
        : 0;
      const backoff = Math.max(
        retryAfterMs,
        BASE_BACKOFF_MS * Math.pow(2, attempt),
      );
      await sleep(backoff);
      continue;
    }
    return { ok: false, status: response.status };
  }
  return { ok: false, status: lastStatus };
}

const files = (await Promise.all(SCAN_ROOTS.map((root) => walk(root)))).flat();
const dois = new Set();
for (const file of files) {
  const content = await readFile(file, "utf8");
  const parsed = file.endsWith(".json")
    ? JSON.parse(content)
    : YAML.parse(content);
  for (const doi of collectDoiValues(parsed)) {
    dois.add(doi);
  }
}

const failures = [];
const sorted = [...dois].sort();
for (let i = 0; i < sorted.length; i++) {
  const doi = sorted[i];
  const result = await verifyDoi(doi);
  if (!result.ok) {
    failures.push(`${doi} -> ${result.status}`);
  }
  // Gentle throttling between successful calls to stay in the polite pool
  if (i < sorted.length - 1) {
    await sleep(REQUEST_GAP_MS);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Verified ${dois.size} unique DOI values with CrossRef.`);
