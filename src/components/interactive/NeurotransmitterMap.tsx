"use client";

import { useMemo, useState } from "react";
import neuromodulators from "@/data/neuromodulators.json";
import { TierBadge } from "@/components/content/TierBadge";
import { Tier } from "@/lib/tier";

interface NeuromodulatorSystem {
  slug: string;
  name: string;
  abbreviation: string;
  color: string;
  tier: Tier;
  nuclei: string[];
  projections: string[];
  cell_body_locations: Array<{
    name: string;
    xyz: [number, number, number];
  }>;
  projection_fields: string[];
  receptors: string[];
}

const systems = neuromodulators as unknown as NeuromodulatorSystem[];

export function NeurotransmitterMap() {
  const [activeSlug, setActiveSlug] = useState(systems[0]?.slug);
  const active = useMemo(
    () => systems.find((system) => system.slug === activeSlug) ?? systems[0],
    [activeSlug],
  );

  return (
    <section className="card" data-testid="neurotransmitter-map">
      <h3>Neuromodulator Map</h3>
      <p className="muted">
        Toggle cell-body nuclei, projection fibers, and receptor distribution
        scaffolds for Level 5 neurotransmitter systems.
      </p>
      <div className="filter-bar" aria-label="Neurotransmitter toggles">
        {systems.map((system) => (
          <button
            aria-pressed={system.slug === active.slug}
            className="filter-button"
            data-testid="neurotransmitter-system"
            key={system.slug}
            onClick={() => setActiveSlug(system.slug)}
            style={{ borderColor: system.color }}
            type="button"
          >
            {system.abbreviation}
          </button>
        ))}
      </div>
      <svg
        aria-label={`${active.name} projection map`}
        role="img"
        viewBox="0 0 720 260"
        width="100%"
        style={{ minHeight: "16rem" }}
      >
        <ellipse
          cx="360"
          cy="128"
          fill="#020617"
          rx="242"
          ry="94"
          stroke="rgba(148, 163, 184, 0.32)"
        />
        {active.cell_body_locations.map((node, index) => {
          const [x, y, z] = node.xyz;
          const cx = 360 + x * 420;
          const cy = 132 - y * 150 + z * 52;
          return (
            <g data-testid="transmitter-cell-body" key={node.name}>
              <circle
                cx={cx}
                cy={cy}
                fill={active.color}
                r={13 + index}
                opacity="0.9"
              />
              <text
                fill="#e5e7eb"
                fontSize="12"
                textAnchor="middle"
                x={cx}
                y={cy + 30}
              >
                {node.name}
              </text>
              {active.projection_fields
                .slice(0, 5)
                .map((projection, fieldIndex) => (
                  <path
                    d={`M ${cx} ${cy} C ${230 + fieldIndex * 65} ${40 + fieldIndex * 8}, ${260 + fieldIndex * 72} ${210 - fieldIndex * 14}, ${112 + fieldIndex * 120} ${80 + (fieldIndex % 2) * 112}`}
                    data-testid="transmitter-projection"
                    fill="none"
                    key={`${node.name}-${projection}`}
                    stroke={active.color}
                    strokeOpacity="0.58"
                    strokeWidth="4"
                  />
                ))}
            </g>
          );
        })}
      </svg>
      <article className="micro-tile">
        <strong>{active.name}</strong> <TierBadge tier={active.tier} />
        <p className="muted">{active.projections.join(", ")}</p>
        <p className="mono">Receptors: {active.receptors.join(" / ")}</p>
      </article>
    </section>
  );
}
