"use client";

import { useState } from "react";

export function TripleNetworkSwitch() {
  const [mode, setMode] = useState<"dmn" | "cen">("dmn");

  return (
    <section className="card" data-testid="triple-network-switch">
      <h3>Triple-Network Switch</h3>
      <p className="muted">Salience network toggles between internally oriented DMN and externally oriented CEN states.</p>
      <div className="network-switch-stage">
        <div className={mode === "dmn" ? "switch-node active" : "switch-node"}>DMN</div>
        <button
          aria-label="Toggle salience switch"
          className="switch-lever"
          data-state={mode}
          onClick={() => setMode((value) => (value === "dmn" ? "cen" : "dmn"))}
          type="button"
        >
          SN
        </button>
        <div className={mode === "cen" ? "switch-node active" : "switch-node"}>CEN</div>
      </div>
      <p className="mono">Current control target: {mode === "dmn" ? "default mode network" : "central executive network"}</p>
    </section>
  );
}
