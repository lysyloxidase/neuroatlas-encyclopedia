"use client";

import { useMemo, useState } from "react";
import silettiClusters from "@/data/cellular_taxonomy/siletti2023_clusters.json";

export interface SilettiCluster {
  supercluster_id: number;
  cluster_id: string;
  subcluster_id: string;
  region: string;
  superclass: "excitatory" | "inhibitory" | "non-neuronal";
  neurotransmitter: string;
  marker_genes: string[];
  n_cells: number;
  brain_regions: string[];
}

const clusters = silettiClusters as SilettiCluster[];

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function SilettiBrowser() {
  const [region, setRegion] = useState("all");
  const [superclass, setSuperclass] = useState("all");
  const [neurotransmitter, setNeurotransmitter] = useState("all");

  const regions = useMemo(
    () => unique(clusters.map((cluster) => cluster.region)),
    [],
  );
  const transmitters = useMemo(
    () => unique(clusters.map((cluster) => cluster.neurotransmitter)),
    [],
  );

  const filtered = clusters.filter((cluster) => {
    const regionMatch =
      region === "all" ||
      cluster.brain_regions.includes(region) ||
      cluster.region === region;
    const superclassMatch =
      superclass === "all" || cluster.superclass === superclass;
    const transmitterMatch =
      neurotransmitter === "all" ||
      cluster.neurotransmitter === neurotransmitter;
    return regionMatch && superclassMatch && transmitterMatch;
  });

  const displayed = filtered.slice(0, 80);

  return (
    <section className="card" data-testid="siletti-browser">
      <h3>Siletti 2023 Human Taxonomy</h3>
      <p className="muted">
        {clusters.length.toLocaleString()} subclusters across 31 superclusters
        and 461 clusters. About 80% are neuronal, with the largest neuronal
        diversity scaffolded in brainstem regions.
      </p>
      <div className="filter-bar" aria-label="Siletti filters">
        <label>
          <span className="sr-only">Region</span>
          <select
            aria-label="Siletti region"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
          >
            <option value="all">All regions</option>
            {regions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Superclass</span>
          <select
            aria-label="Siletti superclass"
            value={superclass}
            onChange={(event) => setSuperclass(event.target.value)}
          >
            <option value="all">All superclasses</option>
            <option value="excitatory">Excitatory</option>
            <option value="inhibitory">Inhibitory</option>
            <option value="non-neuronal">Non-neuronal</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Neurotransmitter</span>
          <select
            aria-label="Siletti neurotransmitter"
            value={neurotransmitter}
            onChange={(event) => setNeurotransmitter(event.target.value)}
          >
            <option value="all">All transmitters</option>
            {transmitters.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mono">
        {filtered.length.toLocaleString()} matching human subclusters
      </p>
      <div className="grid">
        {displayed.map((cluster) => (
          <article
            className="micro-tile"
            data-region={cluster.region}
            data-testid="siletti-cluster"
            key={cluster.subcluster_id}
          >
            <strong>{cluster.subcluster_id}</strong>
            <p className="muted">
              {cluster.region} · {cluster.superclass} ·{" "}
              {cluster.neurotransmitter}
            </p>
            <p className="mono">{cluster.marker_genes.join(" / ")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
