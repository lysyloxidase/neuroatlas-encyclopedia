import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { render, screen, fireEvent } from "@testing-library/react";
import { GyrusHoverControls } from "@/components/viewer3d/GyrusHoverLayer";
import { ViewerControls } from "@/components/viewer3d/ViewerControls";
import { structureSchema } from "@/lib/structure-schema";
import { structures } from "@/lib/structures";
import { Tier } from "@/lib/tier";

const LEVEL1_ROOT = join(process.cwd(), "src/content/structures/level1");

function walkYaml(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walkYaml(path);
    return entry.name.endsWith(".yaml") ? [path] : [];
  });
}

const files = walkYaml(LEVEL1_ROOT);
const parsedStructures = files.map((file) =>
  structureSchema.parse(parse(readFileSync(file, "utf8"))),
);

describe("Phase 2 Level 1 macroanatomy corpus", () => {
  it("validates at least 80 Level 1 YAML entries", () => {
    expect(parsedStructures.length).toBeGreaterThanOrEqual(80);
    expect(parsedStructures.every((structure) => structure.level === 1)).toBe(
      true,
    );
    expect(
      structures.filter((structure) => structure.level === 1),
    ).toHaveLength(parsedStructures.length);
  });

  it("gives each entry at least three DOI-backed primary citations and tier-classified functions", () => {
    for (const structure of parsedStructures) {
      expect(structure.primary_citations).toHaveLength(3);
      for (const citation of structure.primary_citations) {
        expect(citation.doi).toMatch(/^10\.\S+\/\S+$/);
      }
      expect(structure.functions.length).toBeGreaterThan(0);
      for (const functionalClaim of structure.functions) {
        expect([Tier.ROBUST, Tier.PLAUSIBLE, Tier.SPECULATIVE]).toContain(
          functionalClaim.tier,
        );
      }
    }
  });

  it("includes the six lobes with colored toggle metadata and a plausible limbic system view", () => {
    const lobes = parsedStructures.filter(
      (structure) => structure.macroanatomy?.category === "lobe",
    );
    expect(lobes).toHaveLength(6);
    expect(lobes.every((lobe) => lobe.macroanatomy?.color)).toBe(true);

    const limbic = lobes.find((lobe) => lobe.structure_id === "L1_LOBE_LIMBIC");
    expect(limbic?.macroanatomy?.system_view_tier).toBe(Tier.PLAUSIBLE);
    expect(limbic?.functions[0]?.contradicting?.[0]?.doi).toBe(
      "10.1016/j.neuron.2012.02.004",
    );
  });

  it("shows Lazaridis 2024 GPe czGPe/pzGPe subdivision with a NEW claim", () => {
    const gpe = parsedStructures.find(
      (structure) => structure.structure_id === "L1_BG_GPE",
    );
    expect(gpe?.macroanatomy?.subdivisions).toEqual([
      "central zone czGPe",
      "peripheral zone pzGPe",
    ]);
    expect(gpe?.macroanatomy?.phase2_tags).toContain("NEW");
    expect(
      gpe?.functions.some((functionalClaim) =>
        functionalClaim.claim.startsWith("NEW:"),
      ),
    ).toBe(true);
  });

  it("prominently includes Schmahmann CCAS in cerebellar data", () => {
    const posteriorLobe = parsedStructures.find(
      (structure) => structure.structure_id === "L1_CEREBELLUM_POSTERIOR_LOBE",
    );
    expect(
      posteriorLobe?.functions
        .map((functionalClaim) => functionalClaim.claim)
        .join(" "),
    ).toMatch(/Schmahmann Syndrome/);
    expect(posteriorLobe?.disorders[0]?.disorder).toBe(
      "Cerebellar Cognitive Affective/Schmahmann Syndrome",
    );
  });

  it("includes 14 ventricular entries and white matter macrostructures", () => {
    expect(
      parsedStructures.filter(
        (structure) => structure.macroanatomy?.category === "ventricle",
      ),
    ).toHaveLength(14);
    expect(
      parsedStructures.some(
        (structure) => structure.names.english === "Corpus callosum splenium",
      ),
    ).toBe(true);
    expect(
      parsedStructures.some(
        (structure) =>
          structure.names.english === "Internal capsule posterior limb",
      ),
    ).toBe(true);
  });
});

describe("Phase 2 viewer affordances", () => {
  it("exposes gyrus hover selection controls", () => {
    const onSelect = vi.fn();
    render(<GyrusHoverControls selectedGyrus={null} onSelect={onSelect} />);

    fireEvent.mouseEnter(
      screen.getByRole("button", { name: "Precentral gyrus" }),
    );
    expect(onSelect).toHaveBeenCalledWith("Precentral gyrus");
  });

  it("exposes lobe toggle, basal ganglia peel, and cyan ventricular volume controls", () => {
    const handlers = {
      onToggleCortex: vi.fn(),
      onToggleLobes: vi.fn(),
      onToggleVentricles: vi.fn(),
      onToggleCrossSection: vi.fn(),
      onToggleDisorder: vi.fn(),
      onToggleCyto: vi.fn(),
    };

    render(
      <ViewerControls
        showCortex
        showLobes={false}
        showVentricles
        {...handlers}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Peel BG" }));
    fireEvent.click(screen.getByRole("button", { name: "Lobes" }));
    fireEvent.click(screen.getByRole("button", { name: "Ventricles" }));

    expect(handlers.onToggleCortex).toHaveBeenCalledTimes(1);
    expect(handlers.onToggleLobes).toHaveBeenCalledTimes(1);
    expect(handlers.onToggleVentricles).toHaveBeenCalledTimes(1);
  });
});
