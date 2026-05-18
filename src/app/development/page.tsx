import { DevSlider } from "@/components/interactive/DevSlider";
import { structures } from "@/lib/structures";

export default function DevelopmentPage() {
  return (
    <section className="container section">
      <p className="eyebrow">BrainSpan timeline</p>
      <h1>Development</h1>
      <DevSlider />
      <div className="grid" style={{ marginTop: "1rem" }}>
        {structures.map((structure) => (
          <article className="card" key={structure.structure_id}>
            <h3>{structure.names.english}</h3>
            <p className="muted">{structure.development.myelination}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
