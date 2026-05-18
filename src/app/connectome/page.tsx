import { ConnectomeGraph } from "@/components/interactive/ConnectomeGraph";
import tracts from "@/data/tracts.json";

export default function ConnectomePage() {
  return (
    <section className="container section">
      <p className="eyebrow">HCP structural connectome</p>
      <h1>Connectome</h1>
      <ConnectomeGraph />
      <div className="grid" style={{ marginTop: "1rem" }}>
        {tracts.map((tract) => (
          <article className="card" key={tract.slug}>
            <h3>{tract.name}</h3>
            <p className="muted">{tract.endpoints.join(" -> ")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
