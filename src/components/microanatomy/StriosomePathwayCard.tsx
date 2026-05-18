import { TierBadge } from "@/components/content/TierBadge";
import { Tier } from "@/lib/tier";

export function StriosomePathwayCard() {
  return (
    <section className="card" data-testid="striosome-pathway-card">
      <div className="button-row">
        <span className="new-badge">NEW</span>
        <TierBadge
          tier={Tier.ROBUST}
          justification="Mouse striosomal D1/D2 to SNc pathway via central-zone GPe."
        />
        <TierBadge
          tier={Tier.PLAUSIBLE}
          justification="Human/primate confirmation remains pending."
        />
      </div>
      <h3>Striosomal czGPe Pathway</h3>
      <p className="muted">Lazaridis 2024 DOI: 10.1016/j.cub.2024.09.070</p>
    </section>
  );
}
