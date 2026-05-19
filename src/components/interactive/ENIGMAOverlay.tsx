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

function effectColor(value: number): string {
  const alpha = Math.min(0.92, 0.25 + Math.abs(value) * 0.9);
  return value < 0
    ? `rgba(59, 130, 246, ${alpha})`
    : `rgba(239, 68, 68, ${alpha})`;
}

// Anatomical positions on a stylised lateral hemisphere (viewBox 600x340).
// x: anterior(left) ↔ posterior(right). y: superior(top) ↔ inferior(bottom).
const regionPositions: Record<
  string,
  { x: number; y: number; cluster: string }
> = {
  hippocampus: { x: 360, y: 230, cluster: "temporal" },
  amygdala: { x: 320, y: 245, cluster: "temporal" },
  thalamus: { x: 290, y: 170, cluster: "subcortical" },
  caudate: { x: 240, y: 165, cluster: "subcortical" },
  putamen: { x: 270, y: 185, cluster: "subcortical" },
  pallidum: { x: 265, y: 190, cluster: "subcortical" },
  accumbens: { x: 220, y: 205, cluster: "subcortical" },
  insula: { x: 270, y: 200, cluster: "lateral" },
  cingulate: { x: 260, y: 110, cluster: "limbic" },
  prefrontal: { x: 130, y: 130, cluster: "frontal" },
  orbitofrontal: { x: 130, y: 215, cluster: "frontal" },
  motor: { x: 220, y: 90, cluster: "frontal" },
  parietal: { x: 360, y: 90, cluster: "parietal" },
  temporal: { x: 380, y: 200, cluster: "temporal" },
  occipital: { x: 480, y: 130, cluster: "occipital" },
  cerebellum: { x: 510, y: 240, cluster: "cerebellum" },
  brainstem: { x: 420, y: 280, cluster: "brainstem" },
};

function positionFor(regionId: string, index: number) {
  const direct = regionPositions[regionId.toLowerCase()];
  if (direct) return direct;
  // Try matching by substring of common region names
  const key = Object.keys(regionPositions).find((k) =>
    regionId.toLowerCase().includes(k),
  );
  if (key) return regionPositions[key];
  // Fallback: scatter around the cortex with a deterministic angle
  const angle = (index * 137.5 * Math.PI) / 180;
  return {
    x: 300 + Math.cos(angle) * 150,
    y: 170 + Math.sin(angle) * 80,
    cluster: "other",
  };
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
  const [hovered, setHovered] = useState<string | null>(null);
  const selectedRows = rows.filter((row) => row.disorder === selected);

  return (
    <section className="card" data-testid="enigma-overlay">
      <div className="section-heading-row">
        <h3>ENIGMA Cohen&apos;s-d Overlay</h3>
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
      <p className="muted">
        Blue encodes thinning/atrophy · red encodes hypertrophy or relative
        enlargement. Saturation scales with |Cohen&apos;s d|, radius scales with
        effect size.
      </p>

      <div className="enigma-stage">
        <svg
          aria-label={`${selected} ENIGMA anatomical map`}
          role="img"
          viewBox="0 0 600 340"
          width="100%"
        >
          <defs>
            <radialGradient id="enigma-cortex" cx="0.5" cy="0.4" r="0.7">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.92" />
            </radialGradient>
            <linearGradient id="enigma-stem" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <filter
              id="enigma-glow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="6" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Hemisphere silhouette - bean-shape, lateral view */}
          <path
            d="M 80 175
               C 80 90,  170 50,  290 50
               C 410 50, 490 80,  525 130
               C 555 175, 540 235, 480 270
               C 410 305, 320 305, 240 290
               C 160 275, 95 245, 80 175 Z"
            fill="url(#enigma-cortex)"
            stroke="rgba(148, 163, 184, 0.38)"
            strokeWidth={1.3}
          />

          {/* Lateral fissure */}
          <path
            d="M 175 200 Q 250 215, 340 210 T 470 195"
            fill="none"
            stroke="rgba(148, 163, 184, 0.32)"
            strokeDasharray="3 3"
            strokeWidth={1.1}
          />
          {/* Central sulcus */}
          <path
            d="M 248 65 Q 232 130, 244 195"
            fill="none"
            stroke="rgba(148, 163, 184, 0.28)"
            strokeWidth={1.1}
          />

          {/* Cerebellum */}
          <ellipse
            cx="510"
            cy="240"
            fill="url(#enigma-stem)"
            rx="50"
            ry="35"
            stroke="rgba(148, 163, 184, 0.32)"
          />
          {/* folia */}
          {Array.from({ length: 7 }).map((_, idx) => (
            <line
              key={idx}
              x1={465}
              x2={555}
              y1={216 + idx * 7}
              y2={216 + idx * 7}
              stroke="rgba(148, 163, 184, 0.22)"
              strokeWidth={0.6}
            />
          ))}

          {/* Brainstem */}
          <path
            d="M 410 270 Q 420 295, 425 320 L 440 320 Q 442 295, 432 268 Z"
            fill="url(#enigma-stem)"
            stroke="rgba(148, 163, 184, 0.3)"
          />

          {/* Region labels for major lobes (faint) */}
          <text
            x="140"
            y="115"
            fill="rgba(148, 163, 184, 0.45)"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
          >
            FRONTAL
          </text>
          <text
            x="340"
            y="80"
            fill="rgba(148, 163, 184, 0.45)"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
          >
            PARIETAL
          </text>
          <text
            x="350"
            y="250"
            fill="rgba(148, 163, 184, 0.45)"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
          >
            TEMPORAL
          </text>
          <text
            x="450"
            y="105"
            fill="rgba(148, 163, 184, 0.45)"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
          >
            OCCIPITAL
          </text>

          {/* Effect dots */}
          {selectedRows.map((row, index) => {
            const pos = positionFor(row.region_id, index);
            const r = 6 + Math.abs(row.cohens_d) * 24;
            const isHover = hovered === row.region_id;
            return (
              <g
                data-testid="enigma-region"
                key={`${row.disorder}-${row.region_id}-${row.measure}-${index}`}
                onMouseEnter={() => setHovered(row.region_id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  fill={effectColor(row.cohens_d)}
                  r={r}
                  stroke={isHover ? "white" : "rgba(226, 232, 240, 0.5)"}
                  strokeWidth={isHover ? 2 : 0.8}
                  filter={isHover ? "url(#enigma-glow)" : undefined}
                />
                <text
                  fill="#e5e7eb"
                  fontSize={isHover ? 12 : 10}
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                  x={pos.x}
                  y={pos.y + 3}
                  pointerEvents="none"
                >
                  {row.region_id.slice(0, 6)}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="enigma-legend">
          <div>
            <span
              className="enigma-swatch"
              style={{ background: "rgba(59,130,246,0.85)" }}
            />
            <span>Atrophy / thinning (d &lt; 0)</span>
          </div>
          <div>
            <span
              className="enigma-swatch"
              style={{ background: "rgba(239,68,68,0.85)" }}
            />
            <span>Enlargement (d &gt; 0)</span>
          </div>
          <div className="muted mono">N = {selectedRows.length} regions</div>
        </div>
      </div>

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
              onMouseEnter={() => setHovered(row.region_id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background:
                  hovered === row.region_id
                    ? "rgba(6, 182, 212, 0.08)"
                    : undefined,
              }}
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
