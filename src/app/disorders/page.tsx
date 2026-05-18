import Link from "next/link";
import { DBSTargetTable } from "@/components/disorders/DBSTargetTable";
import { ENIGMAOverlay } from "@/components/interactive/ENIGMAOverlay";
import { TierBadge } from "@/components/content/TierBadge";
import disorders from "@/data/disorders.json";
import type { Disorder } from "@/lib/types";

const disorderList = disorders as Disorder[];

export default function DisordersPage() {
  return (
    <section className="container section">
      <p className="eyebrow">Level 6</p>
      <h1>Disorders</h1>
      <p className="lead">
        Structural maps, ENIGMA Cohen&apos;s-d overlays, biomarkers,
        pathway-spread animations, and DBS target summaries.
      </p>
      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        <ENIGMAOverlay disorder="major-depressive-disorder" />
        <DBSTargetTable />
      </div>
      <div className="grid" style={{ marginTop: "1rem" }}>
        {disorderList.map((disorder) => (
          <Link
            className="card"
            href={`/disorders/${disorder.slug}`}
            key={disorder.slug}
          >
            <h3>{disorder.name}</h3>
            <TierBadge tier={disorder.tier} />
            <p className="muted">{disorder.summary}</p>
          </Link>
        ))}
        <Link className="card" href="/disorders/dbs">
          <h3>DBS targets</h3>
          <p className="muted">
            Indications, target nuclei, FDA status, and evidence tier.
          </p>
        </Link>
      </div>
    </section>
  );
}
