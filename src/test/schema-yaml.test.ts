import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { structureSchema, structuresSchema } from "@/lib/structure-schema";
import level1 from "@/data/structures/level1_macro.json";
import level2 from "@/data/structures/level2_micro.json";
import level3 from "@/data/structures/level3_advanced.json";

describe("structure schema", () => {
  it("validates JSON seed data against the TypeScript-backed schema", () => {
    expect(() => structuresSchema.parse([...level1, ...level2, ...level3])).not.toThrow();
  });

  it("validates a per-structure YAML fixture against the same schema", () => {
    const yaml = readFileSync(resolve(process.cwd(), "src/content/structures/hcp_44.yaml"), "utf8");
    expect(() => structureSchema.parse(parse(yaml))).not.toThrow();
  });
});
