import { fireEvent, render, screen, within } from "@testing-library/react";
import { AtlasFilter } from "@/components/filters/AtlasFilter";
import { LevelFilter } from "@/components/filters/LevelFilter";
import { TierFilter } from "@/components/filters/TierFilter";
import { Tier } from "@/lib/tier";

describe("filters", () => {
  it("hides yellow and red content when only the robust tier remains selected", () => {
    render(
      <TierFilter
        items={[
          { id: "green", title: "replicated motor claim", tier: Tier.ROBUST },
          { id: "yellow", title: "debated sequencing claim", tier: Tier.PLAUSIBLE },
          { id: "red", title: "computational-only claim", tier: Tier.SPECULATIVE },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /plausible/i }));
    fireEvent.click(screen.getByRole("button", { name: /speculative/i }));

    const results = screen.getByTestId("tier-filter-results");
    expect(within(results).getByText("replicated motor claim")).toBeInTheDocument();
    expect(within(results).queryByText("debated sequencing claim")).not.toBeInTheDocument();
    expect(within(results).queryByText("computational-only claim")).not.toBeInTheDocument();
  });

  it("shows only Level 1 structures when Level 1 is selected", () => {
    render(
      <LevelFilter
        items={[
          { id: "macro", title: "Precentral gyrus", level: 1 },
          { id: "micro", title: "Area 44", level: 2 },
          { id: "advanced", title: "Dentate gyrus", level: 3 },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Level 1" }));

    const results = screen.getByTestId("level-filter-results");
    expect(within(results).getByText("Precentral gyrus")).toBeInTheDocument();
    expect(within(results).queryByText("Area 44")).not.toBeInTheDocument();
    expect(within(results).queryByText("Dentate gyrus")).not.toBeInTheDocument();
  });

  it("switches atlas render layers when a different atlas is selected", () => {
    const onAtlasChange = vi.fn();
    render(<AtlasFilter onAtlasChange={onAtlasChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Julich" }));

    expect(onAtlasChange).toHaveBeenCalledWith("julich_brain_v31");
    expect(screen.getByTestId("atlas-render-layer")).toHaveTextContent("u_julich_brain_v31_labels");
  });
});
