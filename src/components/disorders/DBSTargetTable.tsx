import targets from "@/data/disorders/dbs_targets.json";
import { TierBadge } from "@/components/content/TierBadge";
import { Tier } from "@/lib/tier";

interface DBSRow {
  indication: string;
  target: string;
  fda_approval: string;
  evidence_tier: Tier;
}

export function DBSTargetTable() {
  return (
    <section className="card" data-testid="dbs-target-table">
      <h3>DBS Targets</h3>
      <table className="meta-table">
        <thead>
          <tr>
            <th>Indication</th>
            <th>Target</th>
            <th>FDA approval</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>
          {(targets as DBSRow[]).map((row) => (
            <tr data-testid="dbs-target-row" key={row.indication}>
              <td>{row.indication}</td>
              <td>{row.target}</td>
              <td>{row.fda_approval}</td>
              <td><TierBadge tier={row.evidence_tier} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
