"use client";

import { useMemo, useState } from "react";
import gradient from "@/data/gradient/margulies2016_g1.json";

interface GradientPoint {
  structure_id: string;
  hcp_mmp1: string;
  g1: number;
  pole: "unimodal" | "intermediate" | "transmodal";
  color: string;
}

const points = gradient as GradientPoint[];

export function PrincipalGradientExplorer() {
  const [pole, setPole] = useState<GradientPoint["pole"] | "all">("all");
  const [selected, setSelected] = useState<GradientPoint>(points[0]);

  const filtered = useMemo(
    () =>
      pole === "all" ? points : points.filter((item) => item.pole === pole),
    [pole],
  );
  const extremes = {
    unimodal: points.reduce(
      (lowest, item) => (item.g1 < lowest.g1 ? item : lowest),
      points[0],
    ),
    transmodal: points.reduce(
      (highest, item) => (item.g1 > highest.g1 ? item : highest),
      points[0],
    ),
  };

  return (
    <section className="card" data-testid="principal-gradient-explorer">
      <h3>Margulies Principal Gradient</h3>
      <p className="muted">
        Continuous cortical coloring from unimodal sensorimotor and visual
        cortex toward transmodal DMN apexes, with geodesic-distance framing
        between the extremes.
      </p>
      <div className="filter-bar" aria-label="Gradient pole filter">
        {(["all", "unimodal", "intermediate", "transmodal"] as const).map(
          (item) => (
            <button
              aria-pressed={pole === item}
              className="filter-button"
              key={item}
              onClick={() => setPole(item)}
              type="button"
            >
              {item}
            </button>
          ),
        )}
      </div>
      <div
        aria-label="continuous Margulies G1 color ramp"
        style={{
          background:
            "linear-gradient(90deg, #06b6d4, #22c55e, #f59e0b, #8b5cf6)",
          border: "1px solid rgba(148, 163, 184, 0.18)",
          borderRadius: 8,
          height: "1.25rem",
          margin: "1rem 0",
        }}
      />
      <p className="mono">
        {`${extremes.unimodal.hcp_mmp1} unimodal pole -> geodesic midpoint -> ${extremes.transmodal.hcp_mmp1} transmodal pole`}
      </p>
      <div
        style={{
          display: "grid",
          gap: "0.25rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(2.4rem, 1fr))",
        }}
      >
        {filtered.map((item) => (
          <button
            aria-label={`${item.hcp_mmp1} G1 ${item.g1}`}
            className="filter-button"
            data-testid="gradient-swatch"
            key={item.structure_id}
            onClick={() => setSelected(item)}
            style={{
              background: item.color,
              color: "#020617",
              minHeight: "2.2rem",
              padding: 0,
            }}
            type="button"
          >
            {item.hcp_mmp1}
          </button>
        ))}
      </div>
      <article className="micro-tile" style={{ marginTop: "1rem" }}>
        <strong>{selected.hcp_mmp1}</strong>
        <p className="mono">
          G1 {selected.g1.toFixed(4)} · {selected.pole}
        </p>
        <p className="muted">
          Reproducible gradient scaffold includes macaque, marmoset, and
          developing-human comparisons.
        </p>
      </article>
    </section>
  );
}
