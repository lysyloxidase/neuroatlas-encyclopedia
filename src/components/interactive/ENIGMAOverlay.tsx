"use client";

import { useMemo, useState } from "react";
import effects from "@/data/disorders/enigma_effects.json";

export interface ENIGMAEffectSize {
  disorder: string;
  region_id: string;
  measure: "thickness" | "volume" | "surface_area";
  cohens_d: number;
  n_cases: number;
  n_controls: number;
  citation: string;
}

const rows = effects as ENIGMAEffectSize[];

function effectColor(value: number) {
  const alpha = Math.min(0.92, 0.22 + Math.abs(value) * 0.9);
  return value < 0
    ? `rgba(59, 130, 246, ${alpha})`
    : `rgba(239, 68, 68, ${alpha})`;
}

export function ENIGMAOverlay({
  disorder = rows[0]?.disorder,
}: {
  disorder?: string;
}) {
  const disorderNames = useMemo(
    () => Array.from(new Set(rows.map((row) => row.disorder))).sort(),
    [],
  );
  const [selected, setSelected] = useState(disorder);
  const selectedRows = rows.filter((row) => row.disorder === selected);

  return (
    <section className="card" data-testid="enigma-overlay">
      <h3>ENIGMA Cohen&apos;s-d Overlay</h3>
      <p className="muted">
        Blue encodes thinning/atrophy; red encodes hypertrophy or relative
        enlargement. Saturation scales with |Cohen&apos;s d|.
      </p>
      <div className="filter-bar">
        <select
          aria-label="ENIGMA disorder"
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
        >
          {disorderNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <svg
        aria-label={`${selected} ENIGMA map`}
        role="img"
        viewBox="0 0 720 260"
        width="100%"
        style={{ minHeight: "15rem" }}
      >
        <ellipse
          cx="250"
          cy="132"
          fill="#020617"
          rx="180"
          ry="92"
          stroke="rgba(148, 163, 184, 0.32)"
        />
        <ellipse
          cx="470"
          cy="132"
          fill="#020617"
          rx="180"
          ry="92"
          stroke="rgba(148, 163, 184, 0.32)"
        />
        {selectedRows.map((row, index) => {
          const angle =
            (index / Math.max(selectedRows.length, 1)) * Math.PI * 2;
          const x = 360 + Math.cos(angle) * (120 + (index % 2) * 70);
          const y = 132 + Math.sin(angle) * 62;
          return (
            <g
              data-testid="enigma-region"
              key={`${row.disorder}-${row.region_id}-${row.measure}`}
            >
              <circle
                cx={x}
                cy={y}
                fill={effectColor(row.cohens_d)}
                r={18 + Math.abs(row.cohens_d) * 18}
                stroke="rgba(226,232,240,0.35)"
              />
              <text
                fill="#e5e7eb"
                fontSize="12"
                textAnchor="middle"
                x={x}
                y={y + 4}
              >
                {row.region_id}
              </text>
            </g>
          );
        })}
      </svg>
      <table className="meta-table">
        <thead>
          <tr>
            <th>Region</th>
            <th>Measure</th>
            <th>Cohen&apos;s d</th>
            <th>N</th>
            <th>DOI</th>
          </tr>
        </thead>
        <tbody>
          {selectedRows.map((row) => (
            <tr
              data-testid="enigma-effect-row"
              key={`${row.disorder}-${row.region_id}-${row.measure}`}
            >
              <td>{row.region_id}</td>
              <td>{row.measure}</td>
              <td className="mono">{row.cohens_d.toFixed(2)}</td>
              <td>
                {row.n_cases} cases / {row.n_controls} controls
              </td>
              <td className="mono">{row.citation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
