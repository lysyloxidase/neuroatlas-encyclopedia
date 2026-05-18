import { getAtlas } from "@/lib/atlas-loader";
import { structures } from "@/lib/structures";

export default function DesikanKillianyPage() {
  const atlas = getAtlas("desikan_killiany");
  const linked = structures.filter((structure) => structure.atlas_links.dk);

  return (
    <section className="container section">
      <p className="eyebrow">Atlas</p>
      <h1>{atlas.label}</h1>
      <p className="lead">{atlas.n_areas} gyral parcels for robust MRI-readable macroanatomy.</p>
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
    </section>
  );
}
