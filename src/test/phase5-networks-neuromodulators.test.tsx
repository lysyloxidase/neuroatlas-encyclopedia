import { fireEvent, render, screen, within } from "@testing-library/react";
import { NeurotransmitterMap } from "@/components/interactive/NeurotransmitterMap";
import { LanguageDualStream } from "@/components/networks/LanguageDualStream";
import { MotorSomatosensoryHomunculus } from "@/components/networks/MotorSomatosensoryHomunculus";
import { TheoryMirrorSystems } from "@/components/networks/TheoryMirrorSystems";
import { TripleNetworkSwitch } from "@/components/networks/TripleNetworkSwitch";
import { VisualStreamExplorer } from "@/components/networks/VisualStreamExplorer";
import { YeoNetworkOverlays } from "@/components/networks/YeoNetworkOverlays";
import networks from "@/data/networks.json";
import neuromodulators from "@/data/neuromodulators.json";
import { Tier } from "@/lib/tier";

describe("Phase 5 Level 4 functional networks", () => {
  it("defines seven robust Yeo cortex overlays plus plausible limbic reliability note", () => {
    const robustYeo = networks.filter(
      (network) =>
        network.system.includes("Yeo") && network.tier === Tier.ROBUST,
    );
    const limbic = networks.find((network) => network.slug === "limbic");

    expect(robustYeo).toHaveLength(7);
    expect(limbic?.tier).toBe(Tier.PLAUSIBLE);

    render(<YeoNetworkOverlays />);

    expect(screen.getAllByTestId("yeo-overlay-toggle")).toHaveLength(7);
    fireEvent.click(screen.getByRole("button", { name: "Visual network" }));
    expect(screen.getAllByTestId("cortex-overlay-node").length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getByText(/Limbic network tier: plausible/),
    ).toBeInTheDocument();
  });

  it("animates the triple-network salience switch between DMN and CEN", () => {
    render(<TripleNetworkSwitch />);

    expect(
      screen.getByText(/Current control target: default mode network/),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle salience switch" }),
    );
    expect(
      screen.getByText(/Current control target: central executive network/),
    ).toBeInTheDocument();
  });

  it("shows dual-stream language routes with arcuate fasciculus and lateralization statistics", () => {
    render(<LanguageDualStream />);

    expect(screen.getByText(/SLF\/arcuate/)).toBeInTheDocument();
    expect(screen.getByText(/conduction aphasia/)).toBeInTheDocument();
    expect(
      screen.getByText(/96% right-handers left hemisphere/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/76% left-handers left hemisphere/),
    ).toBeInTheDocument();
  });

  it("highlights dorsal and ventral visual streams", () => {
    render(<VisualStreamExplorer />);

    expect(
      screen.getByText(/V1 -> V2 -> V3 -> V3A -> MT\+ -> IPS -> PMd/),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Ventral what" }));
    expect(
      screen.getByText(/V1 -> V2 -> V4 -> fusiform -> anterior temporal/),
    ).toBeInTheDocument();
    expect(screen.getByText(/FFA, VWFA, and PPA/)).toBeInTheDocument();
  });

  it("renders motor and somatosensory homunculi", () => {
    render(<MotorSomatosensoryHomunculus />);

    expect(screen.getAllByTestId("homunculus-map")).toHaveLength(2);
    expect(screen.getAllByText("face lateral").length).toBeGreaterThanOrEqual(
      2,
    );
  });

  it("shows ToM nodes and keeps mirror neurons plausible, not robust", () => {
    const mirror = networks.find(
      (network) => network.slug === "mirror-neuron-system",
    );
    expect(mirror?.tier).toBe(Tier.PLAUSIBLE);

    render(<TheoryMirrorSystems />);

    const panel = screen.getByTestId("theory-mirror-systems");
    expect(within(panel).getByText("TPJ")).toBeInTheDocument();
    expect(within(panel).getByText("mPFC")).toBeInTheDocument();
    expect(within(panel).getByText("precuneus")).toBeInTheDocument();
    expect(within(panel).getByLabelText(/Plausible/)).toBeInTheDocument();
  });

  it("keeps every network citation DOI-backed", () => {
    for (const network of networks) {
      expect(network.citations.length).toBeGreaterThan(0);
      expect(
        network.citations.every((citation) =>
          /^10\.\S+\/\S+$/.test(citation.doi),
        ),
      ).toBe(true);
    }
  });
});

describe("Phase 5 Level 5 neuromodulators", () => {
  it("renders all neurotransmitter systems with projection fields", () => {
    render(<NeurotransmitterMap />);

    expect(screen.getAllByTestId("neurotransmitter-system")).toHaveLength(9);
    expect(
      screen.getAllByTestId("transmitter-cell-body").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByTestId("transmitter-projection").length,
    ).toBeGreaterThan(0);
  });

  it("shows dopamine single-cell taxonomy with corrected Poulin 2020 and Garritsen 2023 citations", () => {
    const dopamine = neuromodulators.find(
      (system) => system.slug === "dopamine",
    );

    expect(dopamine?.taxonomy.join(" ")).toContain("Poulin 2020");
    expect(dopamine?.taxonomy.join(" ")).toContain("Garritsen 2023");
    expect(dopamine?.citations.map((citation) => citation.doi)).toContain(
      "10.1016/j.tins.2020.01.004",
    );
    expect(dopamine?.citations.map((citation) => citation.doi)).toContain(
      "10.1038/s41583-022-00669-3",
    );
  });

  it("displays serotonin 11 clusters from Ren 2019", () => {
    const serotonin = neuromodulators.find(
      (system) => system.slug === "serotonin",
    );

    expect(serotonin?.pathways.join(" ")).toContain(
      "11 transcriptomic 5-HT clusters",
    );
    expect(serotonin?.citations.map((citation) => citation.doi)).toContain(
      "10.7554/eLife.49424",
    );
  });

  it("cites LC stereological count and NBM/Ch4 Alzheimer vulnerability", () => {
    const norepinephrine = neuromodulators.find(
      (system) => system.slug === "norepinephrine",
    );
    const acetylcholine = neuromodulators.find(
      (system) => system.slug === "acetylcholine",
    );

    expect(norepinephrine?.pathways.join(" ")).toContain("22,000-51,000");
    expect(norepinephrine?.citations.map((citation) => citation.doi)).toContain(
      "10.1111/ejn.70111",
    );
    expect(acetylcholine?.pathways.join(" ")).toContain(
      "NBM/Ch4 degenerates early in Alzheimer disease",
    );
  });

  it("covers orexin and endocannabinoid tiering", () => {
    const orexin = neuromodulators.find(
      (system) => system.slug === "orexin-hypocretin",
    );
    const endocannabinoids = neuromodulators.find(
      (system) => system.slug === "endocannabinoids",
    );

    expect(orexin?.pathways.join(" ")).toContain("51,000-83,000");
    expect(orexin?.pathways.join(" ")).toContain("90%");
    expect(endocannabinoids?.tier).toBe(Tier.PLAUSIBLE);
  });
});
