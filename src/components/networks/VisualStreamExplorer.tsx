"use client";

import { useState } from "react";
import networks from "@/data/networks.json";

interface Stream {
  name: string;
  route: string[];
  function: string;
}

interface VisualNetwork {
  slug: string;
  color: string;
  streams: Stream[];
}

const visualStreams = (networks as unknown as VisualNetwork[]).filter(
  (network) => network.slug.startsWith("vision-"),
);

export function VisualStreamExplorer() {
  const [selectedSlug, setSelectedSlug] = useState("vision-dorsal-stream");
  const selected =
    visualStreams.find((stream) => stream.slug === selectedSlug) ??
    visualStreams[0];
  const stream = selected.streams[0];

  return (
    <section className="card" data-testid="visual-stream-explorer">
      <h3>Dorsal / Ventral Visual Streams</h3>
      <div className="filter-bar">
        {visualStreams.map((item) => (
          <button
            aria-pressed={selected.slug === item.slug}
            className="filter-button"
            key={item.slug}
            onClick={() => setSelectedSlug(item.slug)}
            type="button"
          >
            {item.slug.includes("dorsal") ? "Dorsal where/how" : "Ventral what"}
          </button>
        ))}
      </div>
      <svg
        aria-label={`${stream.name} 3D stream highlight`}
        role="img"
        viewBox="0 0 720 180"
        width="100%"
        style={{ minHeight: "11rem" }}
      >
        {stream.route.map((node, index) => {
          const x = 60 + index * (600 / Math.max(stream.route.length - 1, 1));
          const y = selected.slug.includes("dorsal")
            ? 120 - index * 10
            : 70 + index * 9;
          return (
            <g key={node}>
              {index > 0 ? (
                <line
                  data-testid="visual-stream-edge"
                  stroke={selected.color}
                  strokeWidth="5"
                  x1={
                    60 +
                    (index - 1) * (600 / Math.max(stream.route.length - 1, 1))
                  }
                  x2={x}
                  y1={
                    selected.slug.includes("dorsal")
                      ? 120 - (index - 1) * 10
                      : 70 + (index - 1) * 9
                  }
                  y2={y}
                />
              ) : null}
              <circle cx={x} cy={y} fill={selected.color} r="10" />
              <text
                fill="#e5e7eb"
                fontSize="12"
                textAnchor="middle"
                x={x}
                y={y + 28}
              >
                {node}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mono">{stream.route.join(" -> ")}</p>
      {selected.slug.includes("ventral") ? (
        <p className="muted">Specialized ventral nodes: FFA, VWFA, and PPA.</p>
      ) : null}
    </section>
  );
}
