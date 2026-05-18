import type { Structure } from "@/lib/types";
import { TierBadge } from "./TierBadge";

export function DevelopmentTrajectory({ structure }: { structure: Structure }) {
  return (
    <section className="card" id="development">
      <h3>Development</h3>
      <table className="meta-table">
        <tbody>
          <tr>
            <th>Embryonic origin</th>
            <td>{structure.development.embryonic_origin}</td>
          </tr>
          <tr>
            <th>Peak synaptogenesis</th>
            <td>{structure.development.peak_synaptogenesis}</td>
          </tr>
          <tr>
            <th>Myelination</th>
            <td>{structure.development.myelination}</td>
          </tr>
          {structure.development.adult_neurogenesis ? (
            <tr>
              <th>Adult neurogenesis</th>
              <td>
                <TierBadge
                  tier={structure.development.adult_neurogenesis.tier}
                  justification={
                    structure.development.adult_neurogenesis.tier_justification
                  }
                />
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}
