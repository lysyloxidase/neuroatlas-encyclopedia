import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Citation } from "@/components/content/Citation";

describe("Citation", () => {
  it("verifies DOI metadata through the CrossRef API on hover", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        message: {
          title: ["A multi-modal parcellation of human cerebral cortex"],
          publisher: "Nature Portfolio",
        },
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    render(
      <Citation
        citation={{
          doi: "10.1038/nature18933",
          year: 2016,
          journal: "Nature",
        }}
      />,
    );

    fireEvent.mouseEnter(screen.getByRole("link"));

    await waitFor(() =>
      expect(screen.getByText("verified")).toBeInTheDocument(),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.crossref.org/works/10.1038%2Fnature18933",
      {
        headers: { Accept: "application/json" },
      },
    );

    vi.unstubAllGlobals();
  });
});
