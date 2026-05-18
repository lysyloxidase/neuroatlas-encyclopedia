import { render, screen } from "@testing-library/react";
import { AtlasCrosswalk } from "@/components/content/AtlasCrosswalk";
import { getHcpCrosswalk } from "@/lib/crosswalk";
import { structures } from "@/lib/structures";

describe("AtlasCrosswalk", () => {
  it("maps HCP-MMP1 area 44 to Brodmann 44 and Julich-Brain Area 44", () => {
    expect(getHcpCrosswalk("44")).toMatchObject({
      brodmann: 44,
      julich_brain: "Area 44",
    });

    const structure = structures.find((item) => item.structure_id === "HCP_44");
    expect(structure).toBeDefined();

    render(<AtlasCrosswalk structure={structure!} />);
    expect(screen.getAllByText(/BA44/)[0]).toBeInTheDocument();
    expect(screen.getAllByText("Area 44")[0]).toBeInTheDocument();
  });
});
