import { DBSTargetTable } from "@/components/disorders/DBSTargetTable";

export default function DBSPage() {
  return (
    <section className="container section">
      <p className="eyebrow">Disorders</p>
      <h1>DBS Targets</h1>
      <p className="lead">
        Indication-specific deep brain stimulation targets with FDA status and
        evidence tier.
      </p>
      <DBSTargetTable />
      <p className="muted" style={{ marginTop: "1rem" }}>
        Educational resource. NOT medical advice or diagnosis. Always consult
        licensed clinicians for individual cases.
      </p>
    </section>
  );
}
