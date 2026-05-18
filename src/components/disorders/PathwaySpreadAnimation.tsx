"use client";

import { useState } from "react";
import spreadData from "@/data/disorders/pathway_spread.json";

type SpreadStage = [string, string, string[]];
type SpreadKey = keyof typeof spreadData;

interface PathwaySpreadAnimationProps {
  type: SpreadKey;
}

export function PathwaySpreadAnimation({ type }: PathwaySpreadAnimationProps) {
  const stages = spreadData[type] as SpreadStage[];
  const [index, setIndex] = useState(0);
  const [label, description, regions] = stages[index];

  return (
    <section className="card" data-testid={`pathway-spread-${type}`}>
      <h3>{type === "pd_lewy" ? "Lewy Body Braak PD Stages" : type === "ad_tau" ? "Tau Braak Staging" : "Pathway Spread"}</h3>
      <input
        aria-label={`${type} stage`}
        max={stages.length - 1}
        min={0}
        onChange={(event) => setIndex(Number(event.target.value))}
        type="range"
        value={index}
      />
      <p className="mono">Stage {label}: {description}</p>
      <div className="grid">
        {regions.map((region) => (
          <article className="micro-tile" data-testid="spread-region" key={region}>
            {region}
          </article>
        ))}
      </div>
    </section>
  );
}
