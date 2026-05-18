"use client";

import { useMemo, useState } from "react";
import networks from "@/data/networks.json";
import { Tier } from "@/lib/tier";

interface NetworkNode {
  name: string;
  hcp_mmp1: string[];
  role: string;
  xyz: [number, number, number];
}

interface NetworkEntry {
  slug: string;
  name: string;
  system: string;
  color: string;
  tier: Tier;
  core_nodes: NetworkNode[];
}

const networkRows = networks as unknown as NetworkEntry[];
const robustYeo = networkRows.filter((network) => network.system.includes("Yeo") && network.tier === Tier.ROBUST);
const limbic = networkRows.find((network) => network.slug === "limbic");

export function YeoNetworkOverlays() {
  const [selectedSlug, setSelectedSlug] = useState(robustYeo[0]?.slug);
  const selected = useMemo(() => robustYeo.find((network) => network.slug === selectedSlug) ?? robustYeo[0], [selectedSlug]);

  return (
    <section className="card" data-testid="yeo-network-overlays">
      <h3>Yeo 7 Cortex Overlays</h3>
      <p className="muted">
        Seven robust Yeo networks render as toggleable cortical overlays. Limbic is shown separately as plausible because
        susceptibility signal loss lowers mapping reliability.
      </p>
      <div className="filter-bar" aria-label="Yeo network overlay toggles">
        {robustYeo.map((network) => (
          <button
            aria-pressed={selected.slug === network.slug}
            className="filter-button"
            data-testid="yeo-overlay-toggle"
            key={network.slug}
            onClick={() => setSelectedSlug(network.slug)}
            style={{ borderColor: network.color }}
            type="button"
          >
            {network.name}
          </button>
        ))}
      </div>
      <svg aria-label={`${selected.name} cortex overlay`} role="img" viewBox="0 0 720 260" width="100%" style={{ minHeight: "15rem" }}>
        <ellipse cx="240" cy="130" fill="#020617" rx="178" ry="92" stroke="rgba(148, 163, 184, 0.36)" />
        <ellipse cx="480" cy="130" fill="#020617" rx="178" ry="92" stroke="rgba(148, 163, 184, 0.36)" />
        {selected.core_nodes.map((node, index) => {
          const [x, y] = node.xyz;
          const left = 240 + x * 180;
          const right = 480 - x * 180;
          const cy = 130 - y * 110;
          return (
            <g data-testid="cortex-overlay-node" key={`${node.name}-${index}`}>
              <circle cx={left} cy={cy} fill={selected.color} r="10" opacity="0.88" />
              <circle cx={right} cy={cy} fill={selected.color} r="10" opacity="0.5" />
            </g>
          );
        })}
      </svg>
      <p className="mono">{selected.core_nodes.map((node) => node.hcp_mmp1.join("/")).join(" · ")}</p>
      {limbic ? <p className="muted">Limbic network tier: plausible, not robust.</p> : null}
    </section>
  );
}
