"use client";

import { useMemo, useState } from "react";
import yaoClusters from "@/data/cellular_taxonomy/yao2023_clusters.json";

interface YaoCluster {
  class_id: string;
  subclass_id: string;
  supertype_id: string;
  cluster_id: string;
  ccfv3_coordinates: [number, number, number];
  region: string;
  superclass: "excitatory" | "inhibitory" | "non-neuronal";
  neurotransmitter: string;
  marker_genes: string[];
  merfish_cells: number;
}

const clusters = yaoClusters as YaoCluster[];

export function YaoBrowser() {
  const [query, setQuery] = useState("");
  const [superclass, setSuperclass] = useState("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return clusters.filter((cluster) => {
      const superclassMatch = superclass === "all" || cluster.superclass === superclass;
      const text = `${cluster.cluster_id} ${cluster.region} ${cluster.marker_genes.join(" ")} ${cluster.class_id}`.toLowerCase();
      return superclassMatch && (!needle || text.includes(needle));
    });
  }, [query, superclass]);

  return (
    <section className="card" data-testid="yao-browser">
      <h3>Yao 2023 Mouse Whole-Brain Taxonomy</h3>
      <p className="muted">
        {clusters.length.toLocaleString()} clusters registered to Allen CCFv3, spanning 34 classes, 338 subclasses,
        and 1,201 supertypes.
      </p>
      <div className="filter-bar" aria-label="Yao filters">
        <input aria-label="Yao cluster search" placeholder="Search cluster, region, or marker" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select aria-label="Yao superclass" value={superclass} onChange={(event) => setSuperclass(event.target.value)}>
          <option value="all">All superclasses</option>
          <option value="excitatory">Excitatory</option>
          <option value="inhibitory">Inhibitory</option>
          <option value="non-neuronal">Non-neuronal</option>
        </select>
      </div>
      <p className="mono">{filtered.length.toLocaleString()} matching mouse clusters</p>
      <table className="meta-table">
        <thead>
          <tr>
            <th>Cluster</th>
            <th>Region</th>
            <th>CCFv3 coordinates</th>
            <th>Markers</th>
          </tr>
        </thead>
        <tbody>
          {filtered.slice(0, 48).map((cluster) => (
            <tr data-testid="yao-cluster" key={cluster.cluster_id}>
              <td className="mono">{cluster.cluster_id}</td>
              <td>{cluster.region}</td>
              <td className="mono">{cluster.ccfv3_coordinates.join(", ")}</td>
              <td>{cluster.marker_genes.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
