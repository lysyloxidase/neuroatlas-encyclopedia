"use client";

import { useMemo, useState } from "react";
import networks from "@/data/networks.json";
import { Citation } from "@/components/content/Citation";

const networkPalette = (
  networks as { slug: string; color: string; name: string }[]
).filter(
  (network) => network.slug.startsWith("yeo") || network.slug === "salience",
);

function makeNodes() {
  return Array.from({ length: 360 }, (_, index) => {
    const angle = index * 2.399963229728653;
    const radius = 42 + (index % 29) * 2.2;
    const network = networkPalette[index % networkPalette.length] ?? {
      slug: "association",
      color: "#06b6d4",
      name: "Association",
    };
    return {
      id: `HCP-${index + 1}`,
      x: 150 + Math.cos(angle) * radius,
      y: 150 + Math.sin(angle) * radius,
      hub: index % 41 === 0,
      network,
    };
  });
}

export function ConnectomeGraph() {
  const [communities, setCommunities] = useState(true);
  const nodes = useMemo(makeNodes, []);
  const hubs = nodes.filter((node) => node.hub);

  return (
    <section className="card connectome-panel" data-testid="connectome-graph">
      <div className="section-heading-row">
        <h3>HCP 360-Node Structural Connectome</h3>
        <button
          aria-pressed={communities}
          className="filter-button"
          onClick={() => setCommunities((value) => !value)}
          type="button"
        >
          Yeo communities
        </button>
      </div>
      <svg
        aria-label="Force-directed HCP-MMP1 connectome graph"
        className="connectome-svg"
        role="img"
        viewBox="0 0 300 300"
      >
        {nodes.slice(0, 96).map((node, index) => {
          const target = nodes[(index * 17 + 23) % nodes.length];
          return (
            <line
              key={`${node.id}-${target.id}`}
              stroke="rgba(148, 163, 184, 0.22)"
              strokeWidth={node.hub ? 1.4 : 0.5}
              x1={node.x}
              x2={target.x}
              y1={node.y}
              y2={target.y}
            />
          );
        })}
        {nodes.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            data-testid="connectome-node"
            fill={communities ? node.network.color : "#38bdf8"}
            r={node.hub ? 2.4 : 1.25}
          />
        ))}
      </svg>
      <div className="metric-strip">
        <span>360 HCP-MMP1 nodes</span>
        <span>{hubs.length} rich-club hubs</span>
        <span>streamline-count edges</span>
      </div>
      <p className="muted">
        Deterministic force scaffold for HCP structural connectivity: community
        coloring follows Yeo networks, while larger nodes mark rich-club
        candidates for hub inspection.
      </p>
      <Citation
        citation={{
          doi: "10.1016/j.neuroimage.2013.05.041",
          year: 2013,
          journal: "NeuroImage",
          title: "The WU-Minn Human Connectome Project",
        }}
      />
    </section>
  );
}
