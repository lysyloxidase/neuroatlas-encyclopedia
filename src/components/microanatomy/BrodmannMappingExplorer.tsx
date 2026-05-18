"use client";

import { useState } from "react";

export const BRODMANN_MAPPINGS = [
  { ba: "BA4", hcp: "4", julich: "Area 4a/4p", label: "primary motor cortex" },
  { ba: "BA17", hcp: "V1", julich: "hOc1", label: "primary visual cortex" },
  { ba: "BA44", hcp: "44", julich: "Area 44", label: "Broca pars opercularis" },
] as const;

export function BrodmannMappingExplorer() {
  const [selected, setSelected] = useState<(typeof BRODMANN_MAPPINGS)[number]>(
    BRODMANN_MAPPINGS[0],
  );

  return (
    <section className="card" data-testid="brodmann-mapping-explorer">
      <h3>Brodmann Crosswalk</h3>
      <div className="filter-bar" aria-label="Brodmann areas">
        {BRODMANN_MAPPINGS.map((item) => (
          <button
            className="filter-button"
            key={item.ba}
            onClick={() => setSelected(item)}
            type="button"
          >
            {item.ba}
          </button>
        ))}
      </div>
      <p className="mono">
        {selected.ba}
        {" -> HCP-MMP1 "}
        {selected.hcp}
        {" -> Julich-Brain "}
        {selected.julich}
      </p>
      <p className="muted">{selected.label}</p>
    </section>
  );
}
