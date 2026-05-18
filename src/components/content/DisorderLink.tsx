import Link from "next/link";
import { TierBadge } from "./TierBadge";
import type { DisorderAssociation } from "@/lib/types";

export function DisorderLink({ disorder }: { disorder: DisorderAssociation }) {
  return (
    <li className="association-row">
      <div className="button-row">
        <Link href={`/disorders/${disorder.disorder.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
          {disorder.disorder}
        </Link>
        <TierBadge tier={disorder.tier} showLabel={false} />
      </div>
      <p className="muted">{disorder.association}</p>
    </li>
  );
}
