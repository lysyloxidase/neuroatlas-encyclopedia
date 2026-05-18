"use client";

import gradient from "@/data/gradient/margulies2016_g1.json";

export function PrincipalGradientExplorer() {
  return (
    <section className="card">
      <h3>Principal Gradient</h3>
      <ul className="list">
        {gradient.map((item) => (
          <li key={item.structure_id}>
            <span className="mono">{item.structure_id}</span>: {item.g1}
          </li>
        ))}
      </ul>
    </section>
  );
}
