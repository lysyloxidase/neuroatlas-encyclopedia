import siletti from "@/data/cellular_taxonomy/siletti2023_clusters.json";

const families = [
  {
    name: "PV",
    markers: ["PVALB"],
    detail: "basket and chandelier perisomatic inhibition",
  },
  {
    name: "SST",
    markers: ["SST"],
    detail: "Martinotti and non-Martinotti dendritic inhibition",
  },
  {
    name: "VIP",
    markers: ["VIP"],
    detail: "disinhibitory interneurons targeting SST-rich circuits",
  },
  {
    name: "LAMP5",
    markers: ["LAMP5"],
    detail: "neurogliaform and canopy-like volume inhibition",
  },
  {
    name: "SNCG",
    markers: ["SNCG"],
    detail: "CCK-associated basket cell family",
  },
];

export default function InhibitoryPage() {
  const clusters = siletti.filter(
    (cluster) => cluster.superclass === "inhibitory",
  );

  return (
    <section className="container section">
      <p className="eyebrow">Cellular</p>
      <h1>Inhibitory Classes</h1>
      <div className="grid">
        {families.map((family) => (
          <article className="card" key={family.name}>
            <h3>{family.name}</h3>
            <p className="muted">{family.detail}</p>
            <p className="mono">
              {
                clusters.filter((cluster) =>
                  family.markers.some((marker) =>
                    cluster.marker_genes.includes(marker),
                  ),
                ).length
              }{" "}
              Siletti scaffold subclusters
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
