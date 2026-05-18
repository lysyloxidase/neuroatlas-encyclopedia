import disorders from "@/data/disorders.json";
import glossary from "@/data/glossary.json";
import networks from "@/data/networks.json";
import neuromodulators from "@/data/neuromodulators.json";
import level1 from "@/data/structures/level1_macro.json";
import level2 from "@/data/structures/level2_micro.json";
import level3 from "@/data/structures/level3_advanced.json";
import tracts from "@/data/tracts.json";

export interface SearchEntry {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category:
    | "structure"
    | "disorder"
    | "neuromodulator"
    | "network"
    | "tract"
    | "glossary";
  tokens: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function levelPath(level: number) {
  if (level === 1) return "level1";
  if (level === 2) return "level2";
  return "level3";
}

export function buildSearchIndex(): SearchEntry[] {
  const structures = [...level1, ...level2, ...level3].map((structure) => {
    const title = structure.names.english;
    const latin = structure.names.latin;
    const abbreviations = structure.names.abbreviations.join(" ");
    const doiTokens = structure.primary_citations
      .map((citation) => citation.doi)
      .join(" ");
    const atlasLinks = structure.atlas_links as {
      hcp_mmp1?: string;
      julich_brain?: string;
      dk?: string;
      brodmann?: number;
    };
    const atlasTokens = [
      atlasLinks.hcp_mmp1,
      atlasLinks.julich_brain,
      atlasLinks.dk,
      atlasLinks.brodmann ? `BA${atlasLinks.brodmann}` : "",
    ].join(" ");
    return {
      id: structure.structure_id,
      title,
      subtitle: `${latin} ${abbreviations}`.trim(),
      href: `/structures/${levelPath(structure.level)}/${slugify(title)}`,
      category: "structure" as const,
      tokens: `${title} ${latin} ${abbreviations} ${doiTokens} ${atlasTokens}`,
    };
  });

  const disorderEntries = disorders.map((disorder) => ({
    id: disorder.slug,
    title: disorder.name,
    subtitle: disorder.affected_structures.join(", "),
    href: `/disorders/${disorder.slug}`,
    category: "disorder" as const,
    tokens: `${disorder.name} ${disorder.summary} ${disorder.citations.map((citation) => citation.doi).join(" ")}`,
  }));

  const neuromodulatorEntries = neuromodulators.map((system) => ({
    id: system.slug,
    title: system.name,
    subtitle: `${system.abbreviation}: ${system.nuclei.join(", ")}`,
    href: `/neuromodulators/${system.slug}`,
    category: "neuromodulator" as const,
    tokens: `${system.name} ${system.abbreviation} ${system.nuclei.join(" ")} ${system.citations.map((citation) => citation.doi).join(" ")}`,
  }));

  const networkEntries = networks.map((network) => ({
    id: network.slug,
    title: network.name,
    subtitle: network.key_regions.join(", "),
    href: `/networks/${network.slug}`,
    category: "network" as const,
    tokens: `${network.name} ${network.description} ${network.key_regions.join(" ")} ${network.citations.map((citation) => citation.doi).join(" ")}`,
  }));

  const tractEntries = tracts.map((tract) => ({
    id: tract.slug,
    title: tract.name,
    subtitle: tract.endpoints.join(" -> "),
    href: `/tracts/${tract.slug}`,
    category: "tract" as const,
    tokens: `${tract.name} ${tract.tractseg_label} ${tract.endpoints.join(" ")} ${tract.functions.join(" ")} ${tract.citations.map((citation) => citation.doi).join(" ")}`,
  }));

  const glossaryEntries = glossary.map((entry) => ({
    id: slugify(entry.term),
    title: entry.term,
    subtitle: entry.definition,
    href: "/glossary",
    category: "glossary" as const,
    tokens: `${entry.term} ${entry.definition}`,
  }));

  return [
    ...structures,
    ...disorderEntries,
    ...neuromodulatorEntries,
    ...networkEntries,
    ...tractEntries,
    ...glossaryEntries,
  ];
}
