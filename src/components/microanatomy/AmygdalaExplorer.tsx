"use client";

import { useState } from "react";

export const AMYGDALA_SUBNUCLEI = [
  "Lateral nucleus",
  "Basal nucleus",
  "Accessory basal nucleus",
  "Anterior cortical nucleus",
  "Posterior cortical nucleus",
  "CeL",
  "CeM",
  "Medial nucleus",
  "Dorsal ITC",
  "Ventral ITC",
  "BNST",
  "Amygdalohippocampal area",
  "Paralaminar nucleus",
] as const;

export function AmygdalaExplorer() {
  const [selected, setSelected] = useState<(typeof AMYGDALA_SUBNUCLEI)[number]>(
    AMYGDALA_SUBNUCLEI[0],
  );

  return (
    <section className="card" data-testid="amygdala-explorer">
      <h3>Amygdaloid Complex</h3>
      <div className="filter-bar" aria-label="Amygdala subnuclei">
        {AMYGDALA_SUBNUCLEI.map((name) => (
          <button
            className="filter-button"
            key={name}
            onClick={() => setSelected(name)}
            type="button"
          >
            {name}
          </button>
        ))}
      </div>
      <p className="mono">Selected: {selected}</p>
    </section>
  );
}
