import mappings from "@/data/cellular_taxonomy/bakken2021_crossspecies.json";

interface CrossSpeciesMapping {
  mouse_cluster_id: string;
  marmoset_cluster_id: string;
  human_subcluster_id: string;
  conserved_identity: string;
  confidence: string;
}

const rows = mappings as CrossSpeciesMapping[];

export function CrossSpeciesMap() {
  return (
    <section className="card" data-testid="cross-species-map">
      <h3>Bakken 2021 Cross-Species Map</h3>
      <p className="muted">
        Mouse to marmoset to human links emphasize conserved core identities
        alongside species-specialized branches.
      </p>
      <table className="meta-table">
        <thead>
          <tr>
            <th>Mouse</th>
            <th>Marmoset</th>
            <th>Human</th>
            <th>Identity</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 24).map((row) => (
            <tr
              data-testid="cross-species-row"
              key={`${row.mouse_cluster_id}-${row.human_subcluster_id}`}
            >
              <td className="mono">{row.mouse_cluster_id}</td>
              <td className="mono">{row.marmoset_cluster_id}</td>
              <td className="mono">{row.human_subcluster_id}</td>
              <td>
                {row.conserved_identity} · {row.confidence}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
