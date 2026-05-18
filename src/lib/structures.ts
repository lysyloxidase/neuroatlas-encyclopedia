import level1 from "@/data/structures/level1_macro.json";
import level2 from "@/data/structures/level2_micro.json";
import level3 from "@/data/structures/level3_advanced.json";
import type { Structure } from "./types";
import { levelPath, slugify } from "./slug";
import { structuresSchema } from "./structure-schema";

const parsed = structuresSchema.parse([...level1, ...level2, ...level3]);

export const structures = parsed as Structure[];

export interface StructureRoute {
  level: string;
  slug: string;
  structure: Structure;
}

export function getStructureSlug(structure: Structure): string {
  return slugify(structure.names.english);
}

export function getStructureRoutes(): StructureRoute[] {
  return structures.map((structure) => ({
    level: levelPath(structure.level),
    slug: getStructureSlug(structure),
    structure,
  }));
}

export function findStructure(level: string, slug: string): Structure | undefined {
  return getStructureRoutes().find((route) => route.level === level && route.slug === slug)?.structure;
}

export function structuresByLevel(level: 1 | 2 | 3): Structure[] {
  return structures.filter((structure) => structure.level === level);
}
