import { fireEvent, render, screen, within } from "@testing-library/react";
import DisorderPage, { generateStaticParams } from "@/app/disorders/[slug]/page";
import { DBSTargetTable } from "@/components/disorders/DBSTargetTable";
import { DisorderStructuralMap } from "@/components/disorders/DisorderStructuralMap";
import { PathwaySpreadAnimation } from "@/components/disorders/PathwaySpreadAnimation";
import { ENIGMAOverlay } from "@/components/interactive/ENIGMAOverlay";
import dbsTargets from "@/data/disorders/dbs_targets.json";
import enigmaEffects from "@/data/disorders/enigma_effects.json";
import disorders from "@/data/disorders.json";
import { Tier } from "@/lib/tier";

describe("Phase 6 Level 6 disorders", () => {
  it("defines all 19 disorder pages with structural maps", async () => {
    expect(disorders).toHaveLength(19);
    expect(generateStaticParams()).toHaveLength(19);
    expect(disorders.every((disorder) => disorder.structural_map_regions.length > 0)).toBe(true);

    for (const disorder of disorders) {
      const page = await DisorderPage({ params: Promise.resolve({ slug: disorder.slug }) });
      const { unmount } = render(page);
      expect(screen.getByTestId(disorder.map_type === "vascular" ? "stroke-territory-map" : disorder.map_type === "hippocampal_sclerosis" ? "hippocampal-sclerosis-map" : "disorder-structural-map")).toBeInTheDocument();
      expect(screen.getByText(/Educational resource. NOT medical advice or diagnosis/)).toBeInTheDocument();
      unmount();
    }
  });

  it("renders ENIGMA Cohen's-d overlays for 10+ disorders", () => {
    const uniqueDisorders = new Set(enigmaEffects.map((effect) => effect.disorder));
    expect(uniqueDisorders.size).toBeGreaterThanOrEqual(10);

    render(<ENIGMAOverlay disorder="major-depressive-disorder" />);

    expect(screen.getByTestId("enigma-overlay")).toBeInTheDocument();
    expect(screen.getAllByTestId("enigma-region").length).toBeGreaterThanOrEqual(5);
    fireEvent.change(screen.getByLabelText("ENIGMA disorder"), { target: { value: "schizophrenia" } });
    expect(screen.getAllByText(/2833 cases \/ 3929 controls/)).toHaveLength(4);
  });

  it("progresses AD tau Braak stages 0-I-VI and PD Lewy stages I-VI", () => {
    render(
      <div>
        <PathwaySpreadAnimation type="ad_tau" />
        <PathwaySpreadAnimation type="pd_lewy" />
      </div>,
    );

    fireEvent.change(screen.getByLabelText("ad_tau stage"), { target: { value: "1" } });
    expect(screen.getByText(/Stage I: Transentorhinal cortex/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("ad_tau stage"), { target: { value: "6" } });
    expect(screen.getByText(/Stage VI: Primary sensory cortex involvement/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("pd_lewy stage"), { target: { value: "3" } });
    expect(screen.getByText(/Stage III: Substantia nigra pars compacta/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("pd_lewy stage"), { target: { value: "6" } });
    expect(screen.getByText(/Stage VI: Primary neocortex/)).toBeInTheDocument();
  });

  it("renders stroke territories and hippocampal sclerosis maps", () => {
    render(
      <div>
        <DisorderStructuralMap name="Stroke territories" mapType="vascular" regions={[]} />
        <DisorderStructuralMap name="Mesial temporal lobe epilepsy" mapType="hippocampal_sclerosis" regions={[]} />
      </div>,
    );

    expect(screen.getAllByTestId("vascular-territory")).toHaveLength(6);
    expect(screen.getAllByText(/MCA: lateral face\/arm > leg/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/CA1 \+ CA4\/hilus \+ dentate gyrus loss/)).toBeInTheDocument();
    expect(screen.getByText("CA2 preserved")).toBeInTheDocument();
  });

  it("keeps Schmaal MDD effect sizes and Gutman schizophrenia sample sizes exact", () => {
    const mdd = enigmaEffects.filter((effect) => effect.disorder === "major-depressive-disorder");
    const schizophrenia = enigmaEffects.filter((effect) => effect.disorder === "schizophrenia");

    expect(mdd.map((effect) => effect.cohens_d).sort((a, b) => a - b)).toEqual([-0.14, -0.13, -0.12, -0.11, -0.1]);
    expect(mdd.every((effect) => effect.n_cases === 2148 && effect.n_controls === 7957)).toBe(true);
    expect(schizophrenia.every((effect) => effect.n_cases === 2833 && effect.n_controls === 3929)).toBe(true);
    expect(schizophrenia.every((effect) => effect.citation === "10.1002/hbm.25625")).toBe(true);
  });

  it("shows Mayberg sgACC DBS citations and DBS target rows", () => {
    const mdd = disorders.find((disorder) => disorder.slug === "major-depressive-disorder");
    expect(mdd?.dbs_targets).toContain("sgACC/SCC BA25");
    expect(mdd?.citations.map((citation) => citation.doi)).toContain("10.1016/j.neuron.2005.02.014");
    expect(mdd?.citations.map((citation) => citation.doi)).toContain("10.1038/s41586-023-06541-3");
    expect(dbsTargets).toHaveLength(8);

    render(<DBSTargetTable />);

    expect(screen.getAllByTestId("dbs-target-row")).toHaveLength(8);
    expect(screen.getByText("PD motor")).toBeInTheDocument();
    expect(screen.getByText(/Not FDA approved/)).toBeInTheDocument();
  });

  it("flags FTD C9orf72 pulvinar atrophy and cerebellar ataxia CCAS-S", () => {
    const ftd = disorders.find((disorder) => disorder.slug === "frontotemporal-dementia");
    const ataxia = disorders.find((disorder) => disorder.slug === "cerebellar-ataxia");

    expect(ftd?.biomarkers.join(" ")).toContain("C9orf72-specific pulvinar atrophy");
    expect(ftd?.citations.map((citation) => citation.doi)).toContain("10.1002/hbm.24856");
    expect(ataxia?.biomarkers).toContain("CCAS-S scale");
    expect(ataxia?.citations.map((citation) => citation.doi)).toContain("10.1093/brain/awx317");
    expect(ataxia?.citations.map((citation) => citation.doi)).toContain("10.1007/s12311-023-01651-0");
  });

  it("correctly distinguishes locked-in syndrome from coma", () => {
    const lockedIn = disorders.find((disorder) => disorder.slug === "locked-in-syndrome");
    const coma = disorders.find((disorder) => disorder.slug === "coma-disorders-consciousness");

    expect(lockedIn?.summary).toContain("preserved consciousness");
    expect(lockedIn?.biomarkers.join(" ")).toContain("preserved vertical eye movements and blinking");
    expect(coma?.summary).toContain("coma");
    expect(coma?.biomarkers.join(" ")).toContain("brainstem ARAS lesion");
  });

  it("keeps requested disorder tier distinctions", () => {
    expect(disorders.find((disorder) => disorder.slug === "autism-spectrum")?.tier).toBe(Tier.PLAUSIBLE);
    expect(disorders.find((disorder) => disorder.slug === "tourettes-syndrome")?.tier).toBe(Tier.PLAUSIBLE);
    expect(disorders.find((disorder) => disorder.slug === "schizophrenia")?.mechanism_tier).toBe(Tier.PLAUSIBLE);
    expect(disorders.find((disorder) => disorder.slug === "adhd")?.mechanism_tier).toBe(Tier.PLAUSIBLE);
  });

  it("renders an ENIGMA row color legend with blue atrophy and red hypertrophy language", () => {
    render(<ENIGMAOverlay disorder="alzheimers-disease" />);

    const overlay = screen.getByTestId("enigma-overlay");
    expect(within(overlay).getByText(/Blue encodes thinning\/atrophy/)).toBeInTheDocument();
    expect(within(overlay).getByText(/red encodes hypertrophy/)).toBeInTheDocument();
  });
});
