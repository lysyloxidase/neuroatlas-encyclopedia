"use client";

import neuromodulators from "@/data/neuromodulators.json";

export function NeurotransmitterMap() {
  return (
    <section className="card">
      <h3>Neuromodulator Map</h3>
      <ul className="list">
        {neuromodulators.map((system) => (
          <li key={system.slug}>
            {system.abbreviation}: {system.projections.join(", ")}
          </li>
        ))}
      </ul>
    </section>
  );
}
