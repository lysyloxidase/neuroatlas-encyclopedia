import siletti from "@/data/cellular_taxonomy/siletti2023_clusters.json";

export default function InhibitoryPage() {
  const clusters = siletti.filter((cluster) => cluster.class === "inhibitory");

  return (
    <section className="container section">
      <p className="eyebrow">Cellular</p>
      <h1>Inhibitory Classes</h1>
      <div className="grid">
        {["PV", "SST", "VIP", "LAMP5", "SNCG"].map((family) => (
          <article className="card" key={family}>
            <h3>{family}</h3>
            <p className="muted">{clusters.filter((cluster) => cluster.family.includes(family)).length} scaffold clusters</p>
          </article>
        ))}
      </div>
    </section>
  );
}
