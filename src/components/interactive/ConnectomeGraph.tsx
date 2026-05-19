"use client";

import { useMemo, useState } from "react";
import networks from "@/data/networks.json";
import { Citation } from "@/components/content/Citation";

interface NetworkColor {
  slug: string;
  color: string;
  name: string;
}

const networkPalette = (networks as NetworkColor[]).filter(
  (network) =>
    network.slug.startsWith("yeo") ||
    network.slug === "salience" ||
    network.slug === "default-mode" ||
    network.slug === "central-executive",
);

const palette =
  networkPalette.length > 0
    ? networkPalette
    : [
        { slug: "association", color: "#06b6d4", name: "Association" },
        { slug: "limbic", color: "#a855f7", name: "Limbic" },
        { slug: "visual", color: "#f97316", name: "Visual" },
        { slug: "motor", color: "#10b981", name: "Somatomotor" },
        { slug: "salience", color: "#f59e0b", name: "Salience" },
      ];

interface Node {
  id: string;
  x: number;
  y: number;
  hub: boolean;
  hemisphere: "L" | "R";
  network: NetworkColor;
  lobe: "frontal" | "parietal" | "temporal" | "occipital" | "subcortical";
}

const lobeBands: Array<{
  lobe: Node["lobe"];
  startDeg: number;
  endDeg: number;
}> = [
  { lobe: "frontal", startDeg: -50, endDeg: 50 },
  { lobe: "parietal", startDeg: 50, endDeg: 110 },
  { lobe: "occipital", startDeg: 110, endDeg: 160 },
  { lobe: "temporal", startDeg: -160, endDeg: -50 },
  { lobe: "subcortical", startDeg: 160, endDeg: 200 },
];

function lobeAt(angleDeg: number): Node["lobe"] {
  const wrapped = ((angleDeg + 180) % 360) - 180;
  for (const band of lobeBands) {
    if (wrapped >= band.startDeg && wrapped < band.endDeg) return band.lobe;
  }
  return "frontal";
}

function makeNodes(): Node[] {
  // 180 nodes per hemisphere = 360 total HCP-MMP1 areas
  const nodes: Node[] = [];
  const cx = 175;
  const cy = 165;
  const innerR = 95;
  const ringStep = 8;

  for (let h = 0; h < 2; h++) {
    const hemisphere = h === 0 ? "L" : "R";
    const xCenter = h === 0 ? cx - 70 : cx + 70 + 60;
    for (let i = 0; i < 180; i++) {
      const ringIndex = i % 4;
      const angle = (i / 180) * Math.PI * 2;
      const r = innerR - ringIndex * ringStep;
      const network =
        palette[Math.floor(i / 18) % palette.length] ?? palette[0];
      const angleDeg = (angle * 180) / Math.PI;
      const lobe = lobeAt(angleDeg);
      const hubProbability = i % 23 === 0;
      nodes.push({
        id: `${hemisphere}-${i + 1}`,
        x: xCenter + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        hub: hubProbability,
        hemisphere,
        network,
        lobe,
      });
    }
  }
  return nodes;
}

function makeEdges(nodes: Node[]): Array<[Node, Node, number]> {
  // Deterministic pseudo-connectivity favouring same network and rich-club hubs
  const edges: Array<[Node, Node, number]> = [];
  for (let i = 0; i < nodes.length; i += 3) {
    const source = nodes[i];
    // Prefer connections to ipsi-lobe (within hemisphere) plus a few callosal
    const offsets = [11, 17, 31, 53];
    for (const off of offsets) {
      const target = nodes[(i + off) % nodes.length];
      const sameNetwork = source.network.slug === target.network.slug;
      const isCallosal = source.hemisphere !== target.hemisphere;
      const strength = sameNetwork
        ? 0.9
        : isCallosal && (source.hub || target.hub)
          ? 0.55
          : 0.18;
      edges.push([source, target, strength]);
    }
  }
  return edges;
}

type ColorMode = "communities" | "lobes" | "hemispheres";

const lobeColors: Record<Node["lobe"], string> = {
  frontal: "#38bdf8",
  parietal: "#22c55e",
  temporal: "#f97316",
  occipital: "#a855f7",
  subcortical: "#e879f9",
};

export function ConnectomeGraph() {
  const [mode, setMode] = useState<ColorMode>("communities");
  const [highlightNetwork, setHighlightNetwork] = useState<string | null>(null);
  const nodes = useMemo(makeNodes, []);
  const edges = useMemo(() => makeEdges(nodes), [nodes]);
  const hubs = nodes.filter((node) => node.hub);

  const colorOf = (node: Node): string => {
    if (mode === "hemispheres") {
      return node.hemisphere === "L" ? "#38bdf8" : "#fb923c";
    }
    if (mode === "lobes") {
      return lobeColors[node.lobe];
    }
    return node.network.color;
  };

  const isDim = (node: Node): boolean => {
    if (!highlightNetwork) return false;
    return node.network.slug !== highlightNetwork;
  };

  return (
    <section className="card connectome-panel" data-testid="connectome-graph">
      <div className="section-heading-row">
        <h3>HCP 360-Node Structural Connectome</h3>
        <div className="filter-bar">
          {(["communities", "lobes", "hemispheres"] as ColorMode[]).map((m) => (
            <button
              aria-pressed={mode === m}
              className="filter-button"
              key={m}
              onClick={() => setMode(m)}
              type="button"
            >
              {m === "communities"
                ? "Yeo communities"
                : m === "lobes"
                  ? "Lobes"
                  : "Hemispheres"}
            </button>
          ))}
        </div>
      </div>

      <svg
        aria-label="HCP-MMP1 360-node connectome with rich-club hubs"
        className="connectome-svg"
        role="img"
        viewBox="0 0 350 330"
      >
        <defs>
          <radialGradient id="cg-bg" cx="0.5" cy="0.5" r="0.55">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.16)" />
            <stop offset="100%" stopColor="rgba(2, 6, 23, 0)" />
          </radialGradient>
          <filter id="cg-hub-glow">
            <feGaussianBlur stdDeviation="2.5" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="350" height="330" fill="url(#cg-bg)" />

        {/* Hemisphere labels */}
        <text
          x="58"
          y="22"
          fill="rgba(148, 163, 184, 0.55)"
          fontSize="10"
          fontFamily="JetBrains Mono, monospace"
        >
          L hemisphere
        </text>
        <text
          x="232"
          y="22"
          fill="rgba(148, 163, 184, 0.55)"
          fontSize="10"
          fontFamily="JetBrains Mono, monospace"
        >
          R hemisphere
        </text>

        {/* Edges drawn first */}
        {edges.map(([source, target, strength], idx) => {
          const dim =
            highlightNetwork &&
            source.network.slug !== highlightNetwork &&
            target.network.slug !== highlightNetwork;
          const isHubEdge = source.hub || target.hub;
          // Curve edges using a quadratic control point between hemispheres
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.hypot(dx, dy);
          const isCallosal = source.hemisphere !== target.hemisphere;
          const curvature = isCallosal ? 25 : Math.min(20, dist * 0.18);
          const nx = -dy / Math.max(dist, 1);
          const ny = dx / Math.max(dist, 1);
          const cx = midX + nx * curvature;
          const cy = midY + ny * curvature;
          return (
            <path
              key={idx}
              d={`M ${source.x} ${source.y} Q ${cx} ${cy} ${target.x} ${target.y}`}
              fill="none"
              stroke={
                dim ? "rgba(148, 163, 184, 0.05)" : "rgba(148, 163, 184, 0.22)"
              }
              strokeWidth={isHubEdge ? 0.9 : 0.4}
              opacity={dim ? 0.3 : strength}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const dim = isDim(node);
          return (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              data-testid="connectome-node"
              fill={dim ? "rgba(100, 116, 139, 0.35)" : colorOf(node)}
              r={node.hub ? 3.4 : 1.6}
              filter={node.hub && !dim ? "url(#cg-hub-glow)" : undefined}
              opacity={dim ? 0.4 : 1}
            >
              <title>{`${node.id} · ${node.network.name} · ${node.lobe}`}</title>
            </circle>
          );
        })}
      </svg>

      {mode === "communities" ? (
        <div className="connectome-legend">
          {palette.map((net) => (
            <button
              aria-pressed={highlightNetwork === net.slug}
              className="connectome-chip"
              key={net.slug}
              onClick={() =>
                setHighlightNetwork((current) =>
                  current === net.slug ? null : net.slug,
                )
              }
              type="button"
            >
              <span
                className="connectome-swatch"
                style={{ background: net.color }}
              />
              {net.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="metric-strip">
        <span>360 HCP-MMP1 nodes</span>
        <span>{hubs.length} rich-club hubs</span>
        <span>{edges.length} streamline edges</span>
      </div>
      <p className="muted">
        Deterministic HCP-MMP1 scaffold: nodes split across the two hemispheres
        with curved edges; hubs are highlighted with a glow. Click a network to
        highlight its nodes.
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
