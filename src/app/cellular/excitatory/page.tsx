import siletti from "@/data/cellular_taxonomy/siletti2023_clusters.json";

export default function ExcitatoryPage() {
  const clusters = siletti.filter((cluster) => cluster.class === "excitatory");

  return (
    <section className="container section">
      <p className="eyebrow">Cellular</p>
      <h1>Excitatory Classes</h1>
      <div className="grid">
        {["IT", "ET", "NP", "CT", "L6b"].map((family) => (
          <article className="card" key={family}>
            <h3>{family}</h3>
            <p className="muted">{clusters.filter((cluster) => cluster.family.includes(family)).length} scaffold clusters</p>
          </article>
        ))}
      </div>
    </section>
  );
}
