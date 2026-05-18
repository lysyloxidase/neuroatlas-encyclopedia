"use client";

import { useState } from "react";

const points = ["8 PCW", "20 PCW", "Birth", "2 years", "12 years", "40 years"];

export function DevSlider() {
  const [index, setIndex] = useState(2);

  return (
    <section className="card">
      <h3>Development Timeline</h3>
      <input
        aria-label="Development age"
        max={points.length - 1}
        min={0}
        onChange={(event) => setIndex(Number(event.target.value))}
        type="range"
        value={index}
      />
      <p className="mono">{points[index]}</p>
    </section>
  );
}
