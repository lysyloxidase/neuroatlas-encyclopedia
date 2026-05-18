"use client";

import { useState } from "react";

export const LAMINAR_LAYERS = [
  {
    layer: "I",
    name: "Molecular",
    cells: ["Cajal-Retzius fetal", "LAMP5 neurogliaform", "apical tufts"],
    function: "top-down feedback and neuromodulatory entry",
  },
  {
    layer: "II",
    name: "Small pyramidal",
    cells: ["IT-L2/3", "PV basket", "SST Martinotti"],
    function: "local cortico-cortical processing",
  },
  {
    layer: "III",
    name: "Medium pyramidal",
    cells: ["IT-L2/3", "long-range pyramidal"],
    function: "long-range cortico-cortical output",
  },
  {
    layer: "IV",
    name: "Granular",
    cells: ["spiny stellate", "small pyramidal", "thalamic input"],
    function: "feedforward thalamocortical input",
  },
  {
    layer: "V",
    name: "Large pyramidal",
    cells: ["L5a IT", "L5b ET/PT", "NP", "Betz cells"],
    function: "subcortical and corticospinal output",
  },
  {
    layer: "VI",
    name: "Multiform",
    cells: ["CT", "IT-L6", "L6b"],
    function: "corticothalamic feedback",
  },
] as const;

export function CorticalLaminationViewer() {
  const [selected, setSelected] = useState<(typeof LAMINAR_LAYERS)[number]>(
    LAMINAR_LAYERS[0],
  );

  return (
    <section className="card" data-testid="lamination-viewer">
      <h3>Cortical Lamination</h3>
      <div className="filter-bar" aria-label="Cortical layers">
        {LAMINAR_LAYERS.map((layer) => (
          <button
            aria-pressed={selected.layer === layer.layer}
            className="filter-button"
            key={layer.layer}
            onClick={() => setSelected(layer)}
            type="button"
          >
            L{layer.layer}
          </button>
        ))}
      </div>
      <p className="mono">
        Layer {selected.layer}: {selected.name}
      </p>
      <ul className="pill-list">
        {selected.cells.map((cell) => (
          <li key={cell}>{cell}</li>
        ))}
      </ul>
      <p className="muted">{selected.function}</p>
    </section>
  );
}
