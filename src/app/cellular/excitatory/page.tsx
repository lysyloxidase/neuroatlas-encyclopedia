import siletti from "@/data/cellular_taxonomy/siletti2023_clusters.json";

const families = [
  {
    name: "IT",
    markers: ["SATB2", "RORB"],
    detail: "intratelencephalic cortico-cortical and corticostriatal classes",
  },
  {
    name: "ET/PT",
    markers: ["BCL11B", "FEZF2"],
    detail: "extratelencephalic L5b projection neurons",
  },
  {
    name: "NP",
    markers: ["TBR1"],
    detail: "near-projecting L5 excitatory classes",
  },
  {
    name: "CT",
    markers: ["TBR1", "SLC17A7"],
    detail: "corticothalamic feedback classes",
  },
  {
    name: "L6b",
    markers: ["TBR1"],
    detail: "subplate-derived layer 6b lineage",
  },
];

export default function ExcitatoryPage() {
  const clusters = siletti.filter(
    (cluster) => cluster.superclass === "excitatory",
  );

  return (
    <section className="container section">
      <p className="eyebrow">Cellular</p>
      <h1>Excitatory Classes</h1>
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
