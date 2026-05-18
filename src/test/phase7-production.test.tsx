import { fireEvent, render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import AcknowledgmentsPage from "@/app/acknowledgments/page";
import CaveatsPage from "@/app/caveats/page";
import ExplainerPage, {
  generateStaticParams as explainerParams,
} from "@/app/explainers/[slug]/page";
import QuizPage, {
  generateStaticParams as quizParams,
} from "@/app/quiz/[topic]/page";
import { AudienceTabs } from "@/components/content/AudienceTabs";
import { DevSlider } from "@/components/interactive/DevSlider";
import { ConnectomeGraph } from "@/components/interactive/ConnectomeGraph";
import { SearchBar } from "@/components/layout/SearchBar";
import { ViewerControls } from "@/components/viewer3d/ViewerControls";
import timeline from "@/data/development_timeline.json";
import explainers from "@/data/explainers.json";
import { quizTopics } from "@/data/quizzes";
import tierAuditReport from "../../tier_audit_report.json";

describe("Phase 7 production polish", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("ships BrainSpan/PsychENCODE development timeline from 8 PCW to 40 years", () => {
    expect(timeline).toHaveLength(10);
    expect(timeline[0].age).toBe("8 PCW");
    expect(timeline.at(-1)?.age).toBe("40 years");

    render(<DevSlider />);

    expect(screen.getByTestId("dev-slider")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Development age"), {
      target: { value: "9" },
    });
    expect(screen.getByText("40 years")).toBeInTheDocument();
    expect(
      screen.getByText(/DG adult neurogenesis contested/),
    ).toBeInTheDocument();
  });

  it("renders a 360-node HCP connectome with community and rich-club controls", () => {
    render(<ConnectomeGraph />);

    expect(screen.getByTestId("connectome-graph")).toBeInTheDocument();
    expect(screen.getAllByTestId("connectome-node")).toHaveLength(360);
    expect(screen.getByText(/rich-club hubs/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Yeo communities" }));
    expect(
      screen.getByRole("button", { name: "Yeo communities" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("publishes twelve Distill-style explainers with widgets, BLUF, equations, and DOI trails", async () => {
    expect(explainerParams()).toHaveLength(12);
    expect(
      explainers.every((explainer) => explainer.citations.length >= 1),
    ).toBe(true);

    const page = await ExplainerPage({
      params: Promise.resolve({ slug: "principal-gradient" }),
    });
    render(page);

    expect(screen.getByText(/BLUF:/)).toBeInTheDocument();
    expect(
      screen.getByText(/What changes if you do not read further:/),
    ).toBeInTheDocument();
    expect(screen.getByTestId("explainer-widget")).toBeInTheDocument();
    expect(screen.getByText("Concept Equation")).toBeInTheDocument();
    expect(screen.getByText(/10.1073\/pnas.1608282113/)).toBeInTheDocument();
  });

  it("provides audience tabs with persisted Student/Researcher/Clinician preference", () => {
    render(<AudienceTabs context="structure" />);

    fireEvent.click(screen.getByRole("tab", { name: "Researcher" }));
    expect(window.localStorage.getItem("neuroatlas-audience-view")).toBe(
      "researcher",
    );
    expect(screen.getByText("Researcher View")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Clinician" }));
    expect(window.localStorage.getItem("neuroatlas-audience-view")).toBe(
      "clinician",
    );
  });

  it("searches structures, disorders, neurotransmitters, DOIs, and atlas terms locally", () => {
    render(<SearchBar />);

    fireEvent.change(screen.getByLabelText("Search NeuroAtlas"), {
      target: { value: "dopamine" },
    });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Dopamine")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search NeuroAtlas"), {
      target: { value: "10.1038/nature18933" },
    });
    expect(screen.getAllByText(/structure|network/i).length).toBeGreaterThan(0);
  });

  it("ships tier-aware quizzes for all seven requested topics with local progress", async () => {
    expect(quizParams()).toHaveLength(7);
    expect(quizTopics.map((topic) => topic.totalQuestions)).toEqual([
      50, 50, 30, 30, 40, 50, 30,
    ]);
    expect(
      quizTopics
        .flatMap((topic) => topic.questions)
        .every((question) => question.tier <= 2),
    ).toBe(true);

    const page = await QuizPage({
      params: Promise.resolve({ topic: "disorders" }),
    });
    render(page);

    fireEvent.click(screen.getByRole("button", { name: "sgACC / SCC BA25" }));
    expect(screen.getByText("Correct")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(window.localStorage.getItem("neuroatlas-quiz-disorders")).toBe("1");
  });

  it("exposes final viewer controls for parcellations, networks, ENIGMA, tracts, gradient, slices, and BigBrain", () => {
    const onNetworkChange = vi.fn();
    const onDisorderChange = vi.fn();
    render(
      <ViewerControls
        activeDisorder="alzheimers-disease"
        activeNetwork="yeo-default-mode"
        onDisorderChange={onDisorderChange}
        onNetworkChange={onNetworkChange}
        onToggleCortex={vi.fn()}
        onToggleCrossSection={vi.fn()}
        onToggleCyto={vi.fn()}
        onToggleDisorder={vi.fn()}
        onToggleGradient={vi.fn()}
        onToggleLobes={vi.fn()}
        onToggleTracts={vi.fn()}
        onToggleVentricles={vi.fn()}
        showCortex
        showGradient
        showLobes={false}
        showTracts
        showVentricles
      />,
    );

    expect(screen.getByRole("button", { name: "Tracts" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "G1" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("button", { name: "BigBrain" }),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Network overlay"), {
      target: { value: "salience" },
    });
    fireEvent.change(screen.getByLabelText("ENIGMA disorder heatmap"), {
      target: { value: "schizophrenia" },
    });
    expect(onNetworkChange).toHaveBeenCalledWith("salience");
    expect(onDisorderChange).toHaveBeenCalledWith("schizophrenia");
  });

  it("lists all 12 caveats and required acknowledgments", () => {
    render(
      <div>
        <CaveatsPage />
        <AcknowledgmentsPage />
      </div>,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(12);
    expect(
      screen.getByText(/Disorder mappings are statistical, NOT deterministic/),
    ).toBeInTheDocument();
    expect(screen.getByText("ENIGMA Consortium")).toBeInTheDocument();
    expect(screen.getByText(/Apache-2.0/)).toBeInTheDocument();
  });

  it("has deterministic release metadata, citation file, and passing tier audit report", () => {
    const citation = readFileSync("CITATION.cff", "utf8");
    const license = readFileSync("LICENSE", "utf8");
    const workflow = readFileSync(".github/workflows/ci.yml", "utf8");

    expect(citation).toContain("version: 1.0.0");
    expect(citation).toContain("Stańczak");
    expect(license).toContain("Apache License");
    expect(workflow).toContain("npm run tier:audit");
    expect(tierAuditReport.pass).toBe(true);
    expect(tierAuditReport.failures).toBe(0);
    expect(tierAuditReport.claims).toBeGreaterThan(500);
  });

  it("keeps search results and controls accessible", () => {
    render(<SearchBar />);
    const input = screen.getByLabelText("Search NeuroAtlas");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    fireEvent.change(input, { target: { value: "thalamus" } });
    const results = screen.getByRole("listbox");
    expect(within(results).getAllByRole("option").length).toBeGreaterThan(0);
  });
});
