"use client";

import { useState } from "react";

export const INHIBITORY_CLASSES = [
  {
    family: "PV",
    morphology: ["basket", "chandelier"],
    role: "perisomatic and axo-axonic fast inhibition",
  },
  {
    family: "SST",
    morphology: ["Martinotti", "non-Martinotti long-range"],
    role: "dendritic inhibition and long-range inhibitory output",
  },
  {
    family: "VIP",
    morphology: ["bipolar", "multipolar"],
    role: "disinhibitory targeting of SST interneurons",
  },
  {
    family: "LAMP5",
    morphology: ["neurogliaform", "canopy", "alpha7"],
    role: "slow volume GABA in superficial layers",
  },
  {
    family: "SNCG",
    morphology: ["CCK basket", "CB1-positive basket"],
    role: "state-sensitive basket inhibition",
  },
] as const;

export function BiccnInhibitoryBrowser() {
  const [selected, setSelected] = useState<(typeof INHIBITORY_CLASSES)[number]>(
    INHIBITORY_CLASSES[0],
  );

  return (
    <section className="card" data-testid="biccn-inhibitory-browser">
      <h3>BICCN Inhibitory Classes</h3>
      <div className="filter-bar" aria-label="Inhibitory families">
        {INHIBITORY_CLASSES.map((item) => (
          <button
            aria-pressed={selected.family === item.family}
            className="filter-button"
            key={item.family}
            onClick={() => setSelected(item)}
            type="button"
          >
            {item.family}
          </button>
        ))}
      </div>
      <ul className="pill-list">
        {selected.morphology.map((morphology) => (
          <li key={morphology}>{morphology}</li>
        ))}
      </ul>
      <p className="muted">{selected.role}</p>
    </section>
  );
}
