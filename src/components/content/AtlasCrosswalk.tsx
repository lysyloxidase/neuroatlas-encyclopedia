import { getHcpCrosswalk } from "@/lib/crosswalk";
import type { Structure } from "@/lib/types";

interface AtlasCrosswalkProps {
  structure: Structure;
}

export function AtlasCrosswalk({ structure }: AtlasCrosswalkProps) {
  const hcpArea = structure.atlas_links.hcp_mmp1;
  const merged = hcpArea ? getHcpCrosswalk(hcpArea) : undefined;

  return (
    <section className="card" id="atlas-crosswalk">
      <h3>Atlas Crosswalk</h3>
      <table className="meta-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Target</th>
            <th>Label</th>
          </tr>
        </thead>
        <tbody>
          {structure.atlas_links.crosswalks.map((crosswalk) => (
            <tr key={`${crosswalk.source_atlas}-${crosswalk.target_atlas}-${crosswalk.target_label}`}>
              <td>{crosswalk.source_atlas} {crosswalk.source_label}</td>
              <td>{crosswalk.target_atlas}</td>
              <td>{crosswalk.target_label}</td>
            </tr>
          ))}
          {merged?.brodmann ? (
            <tr>
              <td>HCP-MMP1 {merged.hcp_area}</td>
              <td>Brodmann</td>
              <td>BA{merged.brodmann}</td>
            </tr>
          ) : null}
          {merged?.julich_brain ? (
            <tr>
              <td>HCP-MMP1 {merged.hcp_area}</td>
              <td>Julich-Brain</td>
              <td>{merged.julich_brain}</td>
            </tr>
          ) : null}
          {merged?.dk ? (
            <tr>
              <td>HCP-MMP1 {merged.hcp_area}</td>
              <td>Desikan-Killiany</td>
              <td>{merged.dk}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}
