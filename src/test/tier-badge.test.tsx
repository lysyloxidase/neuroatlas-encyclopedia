import { render, screen } from "@testing-library/react";
import { TierBadge } from "@/components/content/TierBadge";
import { Tier } from "@/lib/tier";

describe("TierBadge", () => {
  it("renders the robust, plausible, and speculative tier glyphs with tooltip justification", () => {
    render(
      <div>
        <TierBadge tier={Tier.ROBUST} justification="consensus" />
        <TierBadge tier={Tier.PLAUSIBLE} justification="mechanism debated" />
        <TierBadge tier={Tier.SPECULATIVE} justification="single study" />
      </div>,
    );

    expect(screen.getByLabelText("Robust: consensus")).toHaveTextContent("🟢");
    expect(
      screen.getByLabelText("Plausible: mechanism debated"),
    ).toHaveTextContent("🟡");
    expect(
      screen.getByLabelText("Speculative: single study"),
    ).toHaveTextContent("🔴");
  });
});
