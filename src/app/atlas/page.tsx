import Link from "next/link";
import { listAtlases } from "@/lib/atlas-loader";

const atlasLinks = {
  hcp_mmp1: "/atlas/hcp-mmp1",
  julich_brain_v31: "/atlas/julich-brain",
  allen_ccf_v3: "/atlas/allen-ccf",
  desikan_killiany: "/atlas/desikan-killiany",
} as const;

export default function AtlasOverviewPage() {
  return (
    <section className="container section">
      <p className="eyebrow">Backbone</p>
      <h1>Four-atlas overview</h1>
      <p className="lead">
        HCP-MMP1, Julich-Brain v3.1, Allen CCFv3, and Desikan-Killiany form the
        Phase 1 reference spine.
      </p>
      <div className="grid" style={{ marginTop: "1rem" }}>
        {listAtlases().map((atlas) => (
          <Link className="card" href={atlasLinks[atlas.key]} key={atlas.key}>
            <h3>{atlas.label}</h3>
            <p className="muted">{atlas.citation}</p>
            <p className="mono">{atlas.file}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
