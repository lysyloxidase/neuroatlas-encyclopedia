"use client";

import { useState } from "react";

export function BraakStagingAnim() {
  const [stage, setStage] = useState(1);

  return (
    <section className="card">
      <h3>Braak Staging</h3>
      <input
        aria-label="Braak stage"
        max={6}
        min={1}
        onChange={(event) => setStage(Number(event.target.value))}
        type="range"
        value={stage}
      />
      <p className="mono">Stage {stage}</p>
    </section>
  );
}
