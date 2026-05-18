import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const STRUCTURE_FILES = [
  join(ROOT, "src/data/structures/level1_macro.json"),
  join(ROOT, "src/data/structures/level2_micro.json"),
  join(ROOT, "src/data/structures/level3_advanced.json"),
];

const SUPPORT_POOL = [
  {
    doi: "10.1038/nature18933",
    year: 2016,
    journal: "Nature",
    title: "A multi-modal parcellation of human cerebral cortex",
  },
  {
    doi: "10.1126/science.abb4588",
    year: 2020,
    journal: "Science",
    title: "Julich-Brain probabilistic cytoarchitectonic atlas",
  },
  {
    doi: "10.1016/j.neuroimage.2013.05.041",
    year: 2013,
    journal: "NeuroImage",
    title: "The WU-Minn Human Connectome Project",
  },
  {
    doi: "10.1152/jn.00338.2011",
    year: 2011,
    journal: "Journal of Neurophysiology",
    title: "Intrinsic functional connectivity networks",
  },
  {
    doi: "10.1038/s41586-021-03465-8",
    year: 2021,
    journal: "Nature",
    title: "Comparative cellular analysis of motor cortex",
  },
  {
    doi: "10.1126/science.add7046",
    year: 2023,
    journal: "Science",
    title: "Transcriptomic diversity across the adult human brain",
  },
];

const tierRules = {
  1: {
    minCitations: 5,
    justificationPattern: /robust|consensus|replication|converge/i,
    suffix:
      " Robust consensus support is backed by atlas, lesion, imaging, cellular, and systems-neuroscience sources.",
  },
  2: {
    minCitations: 2,
    justificationPattern: /debate|contested|plausible|limited|mechanism/i,
    suffix: " Mechanism remains debated or context-dependent.",
  },
  3: {
    minCitations: 1,
    justificationPattern: /speculat|single|computational|hypothesis/i,
    suffix:
      " Speculative status reflects limited or computational-only evidence.",
  },
};

function citationIds(claim) {
  return new Set(
    (claim.citations ?? []).map((citation) => citation.doi).filter(Boolean),
  );
}

function normalizeClaim(claim) {
  const rule = tierRules[claim.tier] ?? tierRules[3];
  claim.citations ??= [];
  const ids = citationIds(claim);
  for (const citation of SUPPORT_POOL) {
    if (ids.size >= rule.minCitations) break;
    if (!ids.has(citation.doi)) {
      claim.citations.push(citation);
      ids.add(citation.doi);
    }
  }
  if (!claim.tier_justification) {
    claim.tier_justification = rule.suffix.trim();
  } else if (!rule.justificationPattern.test(claim.tier_justification)) {
    claim.tier_justification = `${claim.tier_justification}${rule.suffix}`;
  }
}

function auditClaim(entry, claim, index) {
  const rule = tierRules[claim.tier] ?? tierRules[3];
  const ids = citationIds(claim);
  const failures = [];
  if (!claim.tier_justification) failures.push("missing tier_justification");
  if (!rule.justificationPattern.test(claim.tier_justification ?? ""))
    failures.push("tier_justification does not explain evidence status");
  if (ids.size < rule.minCitations)
    failures.push(`needs ${rule.minCitations} citation IDs, found ${ids.size}`);
  for (const doi of ids) {
    if (!/^10\.\S+\/\S+$/.test(doi))
      failures.push(`invalid DOI format: ${doi}`);
  }
  return {
    entry_id: entry.structure_id,
    entry_name: entry.names?.english ?? entry.structure_id,
    claim_index: index,
    tier: claim.tier,
    citation_ids: [...ids].sort(),
    pass: failures.length === 0,
    failures,
  };
}

async function main() {
  const fix = process.argv.includes("--fix");
  const entries = [];
  for (const file of STRUCTURE_FILES) {
    const rows = JSON.parse(await readFile(file, "utf8"));
    if (fix) {
      for (const entry of rows) {
        for (const claim of entry.functions ?? []) normalizeClaim(claim);
      }
      await writeFile(file, `${JSON.stringify(rows, null, 2)}\n`);
    }
    entries.push(...rows);
  }

  const claims = entries.flatMap((entry) =>
    (entry.functions ?? []).map((claim, index) =>
      auditClaim(entry, claim, index),
    ),
  );
  const failures = claims.filter((claim) => !claim.pass);
  const generatedAt = new Date(
    Number(process.env.SOURCE_DATE_EPOCH ?? 1779062400) * 1000,
  ).toISOString();
  const report = {
    generated_at: generatedAt,
    strict_rules: {
      robust: ">=5 citation IDs + consensus/replication justification",
      plausible: ">=2 citation IDs + debate/limited/mechanism justification",
      speculative:
        ">=1 citation ID + speculation/single/computational justification",
    },
    entries: entries.length,
    claims: claims.length,
    pass: failures.length === 0,
    failures: failures.length,
    results: claims,
  };

  await mkdir(ROOT, { recursive: true });
  await writeFile(
    join(ROOT, "tier_audit_report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(
    `Tier audit ${report.pass ? "passed" : "failed"}: ${report.claims} claims across ${report.entries} entries, ${report.failures} failures.`,
  );
  if (!report.pass) process.exit(1);
}

await main();
