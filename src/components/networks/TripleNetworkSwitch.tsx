"use client";

import { useState } from "react";

type Mode = "dmn" | "cen";

interface NetworkInfo {
  label: string;
  full: string;
  nodes: string[];
  state: string;
}

const NETWORKS: Record<Mode, NetworkInfo> = {
  dmn: {
    label: "DMN",
    full: "Default Mode Network",
    nodes: ["mPFC", "PCC / precuneus", "angular gyrus", "lateral temporal"],
    state:
      "Internally oriented — autobiographical memory, theory of mind, mind-wandering.",
  },
  cen: {
    label: "CEN",
    full: "Central Executive Network",
    nodes: ["dlPFC", "post. parietal cortex", "anterior cingulate", "FEF"],
    state:
      "Externally oriented — cognitive control, working memory, goal-directed decisions.",
  },
};

export function TripleNetworkSwitch() {
  const [mode, setMode] = useState<Mode>("dmn");
  const other: Mode = mode === "dmn" ? "cen" : "dmn";

  return (
    <section className="card triple-switch" data-testid="triple-network-switch">
      <div className="section-heading-row">
        <h3>Triple-Network Switch</h3>
        <button
          aria-pressed={mode === "cen"}
          className="filter-button"
          onClick={() => setMode(other)}
          type="button"
        >
          Switch → {NETWORKS[other].label}
        </button>
      </div>
      <p className="muted">
        The salience network (SN: AI + dACC) toggles between DMN and CEN in
        response to internal vs. external demands.
      </p>

      <svg
        aria-label="Salience network switching between DMN and CEN"
        className="triple-switch-svg"
        role="img"
        viewBox="0 0 520 220"
      >
        <defs>
          <radialGradient id="tns-dmn" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </radialGradient>
          <radialGradient id="tns-cen" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
          </radialGradient>
          <radialGradient id="tns-sn" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#fb923c" stopOpacity="0.0" />
          </radialGradient>
          <marker
            id="tns-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#fb923c" />
          </marker>
        </defs>

        {/* Background glows */}
        <circle cx="100" cy="110" r="85" fill="url(#tns-dmn)" />
        <circle cx="420" cy="110" r="85" fill="url(#tns-cen)" />
        <circle cx="260" cy="110" r="60" fill="url(#tns-sn)" />

        {/* DMN node */}
        <g>
          <circle
            cx="100"
            cy="110"
            r="55"
            fill={mode === "dmn" ? "rgba(6, 182, 212, 0.28)" : "rgba(15, 23, 42, 0.85)"}
            stroke={mode === "dmn" ? "#06b6d4" : "rgba(148, 163, 184, 0.35)"}
            strokeWidth={mode === "dmn" ? 2.5 : 1.2}
          />
          <text x="100" y="105" textAnchor="middle" fill="#e5e7eb" fontSize="20" fontWeight="700">
            DMN
          </text>
          <text x="100" y="128" textAnchor="middle" fill="#cbd5e1" fontSize="10">
            internal
          </text>
        </g>

        {/* CEN node */}
        <g>
          <circle
            cx="420"
            cy="110"
            r="55"
            fill={mode === "cen" ? "rgba(168, 85, 247, 0.28)" : "rgba(15, 23, 42, 0.85)"}
            stroke={mode === "cen" ? "#a855f7" : "rgba(148, 163, 184, 0.35)"}
            strokeWidth={mode === "cen" ? 2.5 : 1.2}
          />
          <text x="420" y="105" textAnchor="middle" fill="#e5e7eb" fontSize="20" fontWeight="700">
            CEN
          </text>
          <text x="420" y="128" textAnchor="middle" fill="#cbd5e1" fontSize="10">
            external
          </text>
        </g>

        {/* SN switch */}
        <g>
          <circle
            cx="260"
            cy="110"
            r="42"
            fill="rgba(251, 146, 60, 0.18)"
            stroke="#fb923c"
            strokeWidth="2"
          />
          <text x="260" y="106" textAnchor="middle" fill="#fed7aa" fontSize="16" fontWeight="700">
            SN
          </text>
          <text x="260" y="124" textAnchor="middle" fill="#fdba74" fontSize="9">
            salience
          </text>
        </g>

        {/* Arrows from SN to active target */}
        {mode === "dmn" ? (
          <path
            d="M 222 110 Q 180 110, 158 110"
            fill="none"
            stroke="#fb923c"
            strokeWidth="2.5"
            markerEnd="url(#tns-arrow)"
          />
        ) : (
          <path
            d="M 298 110 Q 340 110, 362 110"
            fill="none"
            stroke="#fb923c"
            strokeWidth="2.5"
            markerEnd="url(#tns-arrow)"
          />
        )}

        {/* Inhibition (dashed) to inactive target */}
        {mode === "dmn" ? (
          <line
            x1="298"
            y1="110"
            x2="362"
            y2="110"
            stroke="rgba(148, 163, 184, 0.45)"
            strokeWidth="1.4"
            strokeDasharray="4 4"
          />
        ) : (
          <line
            x1="222"
            y1="110"
            x2="158"
            y2="110"
            stroke="rgba(148, 163, 184, 0.45)"
            strokeWidth="1.4"
            strokeDasharray="4 4"
          />
        )}

        {/* Labels */}
        <text x="260" y="190" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="JetBrains Mono, monospace">
          SN → directs attention
        </text>
      </svg>

      <div className="triple-switch-meta">
        <div className="triple-switch-active">
          <p className="eyebrow">{NETWORKS[mode].full}</p>
          <h4>{NETWORKS[mode].label} active</h4>
          <p>{NETWORKS[mode].state}</p>
          <ul className="pill-list">
            {NETWORKS[mode].nodes.map((node) => (
              <li key={node}>{node}</li>
            ))}
          </ul>
        </div>
        <div className="triple-switch-other">
          <p className="eyebrow muted">{NETWORKS[other].full}</p>
          <h4 className="muted">{NETWORKS[other].label} suppressed</h4>
          <p className="muted">{NETWORKS[other].state}</p>
        </div>
      </div>
    </section>
  );
}
