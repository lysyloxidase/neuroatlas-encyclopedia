"use client";

import { useMemo, useState } from "react";
import level3 from "@/data/structures/level3_advanced.json";
import type { Structure } from "@/lib/types";

const julichMaps = (level3 as Structure[]).filter(
  (structure) =>
    structure.microanatomy?.category === "julich-brain v3.1 probabilistic map",
);

function regionOf(structure: Structure) {
  return (
    structure.microanatomy?.compartments?.find(
      (item) => !item.includes("probabilistic") && !item.includes("receptor"),
    ) ?? "multiregional"
  );
}

export function JulichTable() {
  const [sortByRegion, setSortByRegion] = useState(true);

  const rows = useMemo(() => {
    const copy = [...julichMaps];
    if (sortByRegion) {
      copy.sort(
        (a, b) =>
          regionOf(a).localeCompare(regionOf(b)) ||
          a.names.english.localeCompare(b.names.english),
      );
    }
    return copy;
  }, [sortByRegion]);

  return (
    <section className="card" data-testid="julich-table">
      <h3>Julich-Brain v3.1 Probabilistic Maps</h3>
      <p className="muted">
        {julichMaps.length} cytoarchitectonic labels with MNI152 and Colin27
        probability-map support plus receptor-architecture linkage.
      </p>
      <div className="filter-bar">
        <button
          aria-pressed={sortByRegion}
          className="filter-button"
          onClick={() => setSortByRegion((value) => !value)}
          type="button"
        >
          Sort by region
        </button>
      </div>
      <table className="meta-table">
        <thead>
          <tr>
            <th>Map</th>
            <th>Region</th>
            <th>Spaces</th>
            <th>Cross-reference</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((structure) => (
            <tr data-testid="julich-row" key={structure.structure_id}>
              <td>{structure.names.english}</td>
              <td>{regionOf(structure)}</td>
              <td>MNI152 · Colin27 · receptor autoradiography</td>
              <td className="mono">
                {structure.microanatomy?.hcp_correspondence?.join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
