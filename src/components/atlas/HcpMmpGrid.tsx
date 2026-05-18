import Link from "next/link";
import { getStructureSlug, structuresByLevel } from "@/lib/structures";
import { levelPath } from "@/lib/slug";

const hcpAreas = structuresByLevel(3).filter((structure) => structure.microanatomy?.category === "hcp-mmp1 area");

export function HcpMmpGrid() {
  return (
    <section className="card" data-testid="hcp-mmp-grid">
      <h3>HCP-MMP1 360 Clickable Areas</h3>
      <p className="muted">
        180 areas per hemisphere, including 97 newly described Glasser parcels and 83 prior microscopy-confirming
        territories. Each tile routes to its YAML-backed structure page.
      </p>
      <div className="grid">
        {hcpAreas.map((structure) => (
          <Link
            className="micro-tile"
            data-testid="hcp-area-link"
            href={`/structures/${levelPath(structure.level)}/${getStructureSlug(structure)}`}
            key={structure.structure_id}
          >
            <strong>{structure.atlas_links.hcp_mmp1}</strong>
            <p className="muted">{structure.names.english}</p>
            <p className="mono">G1 {structure.gradient_value?.toFixed(3)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
