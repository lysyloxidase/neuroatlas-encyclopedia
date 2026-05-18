import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { parse } from "yaml";
import { AmygdalaExplorer } from "@/components/microanatomy/AmygdalaExplorer";
import { BiccnInhibitoryBrowser } from "@/components/microanatomy/BiccnInhibitoryBrowser";
import { BrodmannMappingExplorer } from "@/components/microanatomy/BrodmannMappingExplorer";
import { CorticalLaminationViewer } from "@/components/microanatomy/CorticalLaminationViewer";
import { HippocampalSubfieldViewer } from "@/components/microanatomy/HippocampalSubfieldViewer";
import { LocusCoeruleusCard } from "@/components/microanatomy/LocusCoeruleusCard";
import { PagColumns } from "@/components/microanatomy/PagColumns";
import { StriosomePathwayCard } from "@/components/microanatomy/StriosomePathwayCard";
import { ThalamicNucleiOverlay } from "@/components/microanatomy/ThalamicNucleiOverlay";
import { AtlasCrosswalk } from "@/components/content/AtlasCrosswalk";
import { structureSchema } from "@/lib/structure-schema";
import { structures } from "@/lib/structures";
import { Tier } from "@/lib/tier";

const LEVEL2_ROOT = join(process.cwd(), "src/content/structures/level2");

function walkYaml(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walkYaml(path);
    return entry.name.endsWith(".yaml") ? [path] : [];
  });
}

const files = walkYaml(LEVEL2_ROOT);
const parsedStructures = files.map((file) => structureSchema.parse(parse(readFileSync(file, "utf8"))));

function byCategory(category: string) {
  return parsedStructures.filter((structure) => structure.microanatomy?.category === category);
}

describe("Phase 3 Level 2 microanatomy corpus", () => {
  it("validates the generated Level 2 YAML corpus and syncs it to route data", () => {
    expect(parsedStructures.length).toBeGreaterThanOrEqual(250);
    expect(parsedStructures.every((structure) => structure.level === 2)).toBe(true);
    expect(structures.filter((structure) => structure.level === 2)).toHaveLength(parsedStructures.length);
  });

  it("covers the requested Level 2 domains", () => {
    expect(byCategory("cortical layer")).toHaveLength(6);
    expect(byCategory("inhibitory interneuron")).toHaveLength(7);
    expect(byCategory("brodmann area")).toHaveLength(52);
    expect(byCategory("von economo area").filter((item) => item.structure_id !== "L2_VEK_OVERVIEW")).toHaveLength(104);
    expect(byCategory("hippocampal subfield")).toHaveLength(12);
    expect(byCategory("amygdaloid nucleus")).toHaveLength(13);
    expect(byCategory("thalamic nucleus")).toHaveLength(60);
    expect(byCategory("hypothalamic nucleus").length).toBeGreaterThanOrEqual(9);
    expect(byCategory("brainstem nucleus").length).toBeGreaterThanOrEqual(20);
  });

  it("gives every Level 2 entry DOI-backed citations and tiered claims", () => {
    for (const structure of parsedStructures) {
      expect(structure.primary_citations.length).toBeGreaterThanOrEqual(3);
      expect(structure.primary_citations.every((citation) => /^10\.\S+\/\S+$/.test(citation.doi))).toBe(true);
      expect(structure.functions.length).toBeGreaterThan(0);
      expect(structure.functions.every((functionalClaim) => [Tier.ROBUST, Tier.PLAUSIBLE, Tier.SPECULATIVE].includes(functionalClaim.tier))).toBe(true);
    }
  });

  it("maps Brodmann area 4 to HCP-MMP1 area 4 and Julich area 4a/4p", () => {
    const ba4 = structures.find((structure) => structure.structure_id === "L2_BA_4");
    expect(ba4).toBeDefined();

    render(<AtlasCrosswalk structure={ba4!} />);

    expect(screen.getAllByText(/HCP-MMP1 4/)[0]).toBeInTheDocument();
    expect(screen.getAllByText("Area 4a/4p")[0]).toBeInTheDocument();
  });

  it("flags adult hippocampal neurogenesis as plausible with Sorrells and Boldrini citations", () => {
    const dg = parsedStructures.find((structure) => structure.structure_id === "L2_HIP_DG_GCL");
    expect(dg?.development.adult_neurogenesis?.tier).toBe(Tier.PLAUSIBLE);
    const dois = dg?.functions[0]?.citations.map((citation) => citation.doi);
    expect(dois).toContain("10.1038/nature25975");
    expect(dois).toContain("10.1016/j.stem.2018.03.015");
    expect(dois).toContain("10.1016/j.neuron.2023.03.010");
  });

  it("uses the verified Lazaridis 2024 striosomal pathway DOI and marks mouse robust human plausible", () => {
    const pathway = parsedStructures.find((structure) => structure.structure_id === "L2_BG_STRIOSOMAL_GPE_PATHWAY");
    expect(pathway?.primary_citations[0]?.doi).toBe("10.1016/j.cub.2024.09.070");
    expect(pathway?.primary_citations.map((citation) => citation.doi)).not.toContain("10.1016/j.cub.2024.10.014");
    expect(pathway?.functions.map((claim) => claim.tier)).toEqual([Tier.ROBUST, Tier.PLAUSIBLE]);
    expect(pathway?.microanatomy?.phase3_tags).toContain("NEW");
  });

  it("cites the locus coeruleus stereological count correctly", () => {
    const lc = parsedStructures.find((structure) => structure.names.english === "Locus coeruleus");
    expect(lc?.functions.map((claim) => claim.claim).join(" ")).toContain("22,000-51,000");
    expect(lc?.primary_citations[0]?.doi).toBe("10.1111/ejn.70111");
  });
});

describe("Phase 3 microanatomy browser components", () => {
  it("shows six cortical layers with cell-class breakdown", () => {
    render(<CorticalLaminationViewer />);
    expect(screen.getAllByRole("button")).toHaveLength(6);
    fireEvent.click(screen.getByRole("button", { name: "LIV" }));
    expect(screen.getByText("spiny stellate")).toBeInTheDocument();
  });

  it("shows BICCN inhibitory classes with morphology", () => {
    render(<BiccnInhibitoryBrowser />);
    expect(screen.getByRole("button", { name: "PV" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "LAMP5" }));
    expect(screen.getByText("neurogliaform")).toBeInTheDocument();
  });

  it("supports Brodmann click-to-crosswalk exploration", () => {
    render(<BrodmannMappingExplorer />);
    fireEvent.click(screen.getByRole("button", { name: "BA4" }));
    expect(screen.getByText(/BA4 -> HCP-MMP1 4 -> Julich-Brain Area 4a\/4p/)).toBeInTheDocument();
  });

  it("renders hippocampal, amygdaloid, thalamic, PAG, LC, and striosome affordances", () => {
    render(
      <div>
        <HippocampalSubfieldViewer />
        <AmygdalaExplorer />
        <ThalamicNucleiOverlay />
        <PagColumns />
        <LocusCoeruleusCard />
        <StriosomePathwayCard />
      </div>,
    );

    expect(screen.getAllByTestId("hippocampal-subfield")).toHaveLength(12);
    expect(screen.getByTestId("amygdala-explorer")).toHaveTextContent("BNST");
    expect(screen.getByTestId("thalamic-nuclei-overlay")).toHaveTextContent("60 thalamic nuclei labels loaded");
    expect(screen.getByTestId("pag-columns")).toHaveTextContent("dmPAG");
    expect(screen.getByTestId("pag-columns")).toHaveTextContent("escape");
    expect(screen.getByTestId("locus-coeruleus-card")).toHaveTextContent("22,000-51,000");
    expect(screen.getByTestId("striosome-pathway-card")).toHaveTextContent("10.1016/j.cub.2024.09.070");
  });
});
