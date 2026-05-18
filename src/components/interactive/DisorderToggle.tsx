"use client";

import { useState } from "react";
import disorders from "@/data/disorders.json";
import effects from "@/data/disorders/enigma_effects.json";

export function DisorderToggle() {
  const [selected, setSelected] = useState(disorders[0]?.slug ?? "");
  const disorder = disorders.find((item) => item.slug === selected);
  const nEffects = effects.filter((effect) => effect.disorder === selected).length;

  return (
    <section className="card">
      <h3>Disorder Overlay</h3>
      <select aria-label="Disorder overlay" onChange={(event) => setSelected(event.target.value)} value={selected}>
        {disorders.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
      {disorder ? <p className="muted">{disorder.enigma_overlay} · {nEffects} ENIGMA effect rows</p> : null}
    </section>
  );
}
