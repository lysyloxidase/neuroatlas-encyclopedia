import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { parse } from "yaml";
import { HcpMmpGrid } from "@/components/atlas/HcpMmpGrid";
import { JulichTable } from "@/components/atlas/JulichTable";
import { CrossSpeciesMap } from "@/components/cellular/CrossSpeciesMap";
import { SilettiBrowser } from "@/components/cellular/SilettiBrowser";
import { YaoBrowser } from "@/components/cellular/YaoBrowser";
import { LimbicCircuitGraph } from "@/components/interactive/LimbicCircuitGraph";
import { PrincipalGradientExplorer } from "@/components/interactive/PrincipalGradientExplorer";
import { TractSegViewer } from "@/components/tracts/TractSegViewer";
import crosswalks from "@/data/crosswalks/phase4_bidirectional.json";
import gradient from "@/data/gradient/margulies2016_g1.json";
import level3 from "@/data/structures/level3_advanced.json";
import tracts from "@/data/tracts.json";
import mappings from "@/data/cellular_taxonomy/bakken2021_crossspecies.json";
import siletti from "@/data/cellular_taxonomy/siletti2023_clusters.json";
import yao from "@/data/cellular_taxonomy/yao2023_clusters.json";
import { structureSchema } from "@/lib/structure-schema";
import { structures } from "@/lib/structures";

const LEVEL3_ROOT = join(process.cwd(), "src/content/structures/level3");

function walkYaml(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walkYaml(path);
    return entry.name.endsWith(".yaml") ? [path] : [];
  });
}

const level3Yaml = walkYaml(LEVEL3_ROOT);
const parsedLevel3 = level3Yaml.map((file) => structureSchema.parse(parse(readFileSync(file, "utf8"))));

describe("Phase 4 Level 3 atlas and cellular corpus", () => {
  it("validates Level 3 YAML entries and keeps HCP/Julich counts synced to route data", () => {
    expect(parsedLevel3).toHaveLength(672);
    expect(parsedLevel3.filter((structure) => structure.microanatomy?.category === "hcp-mmp1 area")).toHaveLength(360);
    expect(parsedLevel3.filter((structure) => structure.microanatomy?.category === "julich-brain v3.1 probabilistic map")).toHaveLength(312);
    expect(level3).toHaveLength(parsedLevel3.length);
    expect(structures.filter((structure) => structure.level === 3)).toHaveLength(parsedLevel3.length);
  });

  it("loads the requested BICCN cellular taxonomy scales", () => {
    expect(siletti).toHaveLength(3313);
    expect(new Set(siletti.map((cluster) => cluster.supercluster_id))).toHaveLength(31);
    expect(new Set(siletti.map((cluster) => cluster.cluster_id))).toHaveLength(461);
    expect(yao).toHaveLength(5322);
    expect(yao[0].ccfv3_coordinates).toHaveLength(3);
    expect(mappings[0]).toMatchObject({
      mouse_cluster_id: expect.stringContaining("YAO_CL_"),
      marmoset_cluster_id: expect.stringContaining("MAR_CL_"),
      human_subcluster_id: expect.stringContaining("SIL_SC"),
    });
  });

  it("keeps all HCP-MMP1 areas clickable with full YAML-backed crosswalks", () => {
    const area55b = parsedLevel3.find((structure) => structure.atlas_links.hcp_mmp1 === "L_55b");
    expect(area55b?.primary_citations.map((citation) => citation.doi)).toContain("10.1038/nature18933");
    expect(area55b?.atlas_links.crosswalks.every((crosswalk) => crosswalk.citation?.doi)).toBe(true);

    render(<HcpMmpGrid />);

    expect(screen.getAllByTestId("hcp-area-link")).toHaveLength(360);
    expect(screen.getByText("L_55b")).toBeInTheDocument();
  });

  it("keeps Julich-Brain v3.1 maps sortable with MNI152, Colin27, and receptor scaffolds", () => {
    render(<JulichTable />);

    expect(screen.getAllByTestId("julich-row")).toHaveLength(312);
    expect(screen.getAllByText(/MNI152 .* Colin27 .* receptor autoradiography/)[0]).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sort by region" }));
    expect(screen.getAllByTestId("julich-row")).toHaveLength(312);
  });

  it("renders Siletti, Yao, and Bakken browsers with working filters", () => {
    render(
      <div>
        <SilettiBrowser />
        <YaoBrowser />
        <CrossSpeciesMap />
      </div>,
    );

    fireEvent.change(screen.getByLabelText("Siletti region"), { target: { value: "frontal cortex" } });
    expect(within(screen.getByTestId("siletti-browser")).getByText(/matching human subclusters/)).toBeInTheDocument();
    expect(screen.getAllByTestId("siletti-cluster").length).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText("Yao cluster search"), { target: { value: "YAO_CL_0001" } });
    expect(screen.getAllByTestId("yao-cluster")).toHaveLength(1);
    expect(screen.getByText(/CCFv3 coordinates/i)).toBeInTheDocument();

    expect(screen.getAllByTestId("cross-species-row").length).toBeGreaterThan(0);
  });

  it("renders TractSeg top-20 tube geometry and arcuate leftward asymmetry", () => {
    expect(tracts.filter((tract) => tract.render_top20)).toHaveLength(20);

    render(<TractSegViewer />);

    expect(screen.getAllByTestId("tract-tube")).toHaveLength(20);
    expect(screen.getByText(/Leftward asymmetry in ~80%/)).toBeInTheDocument();
  });

  it("renders Margulies G1 cortical coloring across all 360 HCP parcels", () => {
    expect(gradient).toHaveLength(360);
    expect(new Set(gradient.map((item) => item.pole))).toEqual(new Set(["unimodal", "intermediate", "transmodal"]));

    render(<PrincipalGradientExplorer />);

    expect(screen.getAllByTestId("gradient-swatch")).toHaveLength(360);
    expect(screen.getByText(/geodesic midpoint/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "transmodal" }));
    expect(screen.getAllByTestId("gradient-swatch").length).toBeGreaterThan(0);
  });

  it("renders Papez, Yakovlev, and reward circuits as directed graph overlays", () => {
    render(<LimbicCircuitGraph />);

    expect(screen.getByText("Papez circuit")).toBeInTheDocument();
    expect(screen.getByText("Yakovlev circuit")).toBeInTheDocument();
    expect(screen.getByText("Reward circuit")).toBeInTheDocument();
    expect(screen.getAllByTestId("circuit-edge").length).toBeGreaterThanOrEqual(17);
  });

  it("keeps atlas crosswalks bidirectional and citation-backed", () => {
    for (const edge of crosswalks) {
      expect(edge.citation?.doi).toMatch(/^10\.\S+\/\S+$/);
      const reverse = crosswalks.find(
        (candidate) =>
          candidate.source_atlas === edge.target_atlas &&
          candidate.source_label === edge.target_label &&
          candidate.target_atlas === edge.source_atlas &&
          candidate.target_label === edge.source_label,
      );
      expect(reverse).toBeDefined();
    }
  });

  it("keeps at least 95% of encyclopedia entries at three or more primary citations", () => {
    const cited = structures.filter((structure) => structure.primary_citations.length >= 3);
    expect(cited.length / structures.length).toBeGreaterThanOrEqual(0.95);
  });
});
