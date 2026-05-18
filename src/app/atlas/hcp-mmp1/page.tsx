import { HcpMmpGrid } from "@/components/atlas/HcpMmpGrid";
import { getAtlas } from "@/lib/atlas-loader";
import { structures } from "@/lib/structures";

export default function HcpMmp1Page() {
  const atlas = getAtlas("hcp_mmp1");
  const linked = structures.filter((structure) => structure.atlas_links.hcp_mmp1);

  return (
    <section className="container section">
      <p className="eyebrow">Atlas</p>
      <h1>{atlas.label}</h1>
      <p className="lead">{atlas.n_areas} cortical areas anchored to the Glasser multi-modal parcellation.</p>
      <div className="grid">
        <article className="card">
          <h3>Source</h3>
          <p className="mono">{atlas.file}</p>
          <p className="muted">{atlas.citation}</p>
        </article>
        <article className="card">
          <h3>Linked structures</h3>
          <ul className="list">
            {linked.map((structure) => (
              <li key={structure.structure_id}>{structure.names.english}</li>
            ))}
          </ul>
        </article>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <HcpMmpGrid />
      </div>
    </section>
  );
}
