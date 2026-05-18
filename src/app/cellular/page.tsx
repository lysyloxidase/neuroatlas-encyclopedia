import Link from "next/link";
import siletti from "@/data/cellular_taxonomy/siletti2023_clusters.json";
import yao from "@/data/cellular_taxonomy/yao2023_clusters.json";

export default function CellularPage() {
  return (
    <section className="container section">
      <p className="eyebrow">BICCN taxonomy</p>
      <h1>Cellular Taxonomy</h1>
      <p className="lead">Human and mouse cluster scaffolds for excitatory, inhibitory, and glial views.</p>
      <div className="grid">
        <Link className="card" href="/cellular/excitatory">
          <h3>Excitatory</h3>
          <p className="muted">IT, ET, NP, CT, and L6b classes.</p>
        </Link>
        <Link className="card" href="/cellular/inhibitory">
          <h3>Inhibitory</h3>
          <p className="muted">PV, SST, VIP, LAMP5, and SNCG classes.</p>
        </Link>
        <Link className="card" href="/cellular/glia">
          <h3>Glia</h3>
          <p className="muted">Astrocyte, oligodendrocyte, and microglia scaffold.</p>
        </Link>
      </div>
      <p className="muted">{siletti.length} human seed clusters and {yao.length} mouse seed clusters loaded.</p>
    </section>
  );
}
