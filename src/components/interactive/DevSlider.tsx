"use client";

import { useState } from "react";
import timeline from "@/data/development_timeline.json";
import { Citation } from "@/components/content/Citation";
import { TierBadge } from "@/components/content/TierBadge";
import { Tier } from "@/lib/tier";

interface DevelopmentPoint {
  age: string;
  brain_volume_cm3: number;
  surface_area_cm2: number;
  gene_expression: string;
  myelination: string;
  synaptic_density: string;
  cortical_thickness: string;
  white_matter: string;
  processes: string[];
  citations: { doi: string; year: number; journal: string; title?: string }[];
}

const points = timeline as DevelopmentPoint[];

export function DevSlider() {
  const [index, setIndex] = useState(4);
  const point = points[index];

  return (
    <section className="card dev-slider" data-testid="dev-slider">
      <div className="section-heading-row">
        <h3>BrainSpan + PsychENCODE Timeline</h3>
        <TierBadge
          tier={Tier.PLAUSIBLE}
          justification="Adult human dentate gyrus neurogenesis remains contested; developmental transcriptomic windows are robust."
        />
      </div>
      <input
        aria-label="Development age"
        max={points.length - 1}
        min={0}
        onChange={(event) => setIndex(Number(event.target.value))}
        type="range"
        value={index}
      />
      <p className="mono">{point.age}</p>
      <div className="metric-strip" aria-label="Development metrics">
        <span>{point.brain_volume_cm3} cm3 volume</span>
        <span>{point.surface_area_cm2} cm2 surface</span>
      </div>
      <div className="grid">
        <article className="micro-tile">
          <h4>Gene Expression</h4>
          <p>{point.gene_expression}</p>
        </article>
        <article className="micro-tile">
          <h4>Myelination</h4>
          <p>{point.myelination}</p>
        </article>
        <article className="micro-tile">
          <h4>Synaptic Density</h4>
          <p>{point.synaptic_density}</p>
        </article>
        <article className="micro-tile">
          <h4>Cortical Thickness</h4>
          <p>{point.cortical_thickness}</p>
        </article>
        <article className="micro-tile">
          <h4>White Matter</h4>
          <p>{point.white_matter}</p>
        </article>
      </div>
      <ul className="pill-list" aria-label="Key processes">
        {point.processes.map((process) => (
          <li key={process}>{process}</li>
        ))}
      </ul>
      <ul className="list">
        {point.citations.map((citation) => (
          <li key={citation.doi}>
            <Citation citation={citation} />
          </li>
        ))}
      </ul>
    </section>
  );
}
