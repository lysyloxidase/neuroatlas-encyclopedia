import { getTierMeta, type Tier } from "@/lib/tier";

interface TierBadgeProps {
  tier: Tier;
  justification?: string;
  showLabel?: boolean;
}

export function TierBadge({ tier, justification, showLabel = true }: TierBadgeProps) {
  const meta = getTierMeta(tier);
  const title = justification ? `${meta.label}: ${justification}` : `${meta.label}: ${meta.description}`;

  return (
    <span className={meta.className} title={title} aria-label={title}>
      <span aria-hidden="true">{meta.icon}</span>
      {showLabel ? <span>{meta.label}</span> : null}
    </span>
  );
}
