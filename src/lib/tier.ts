export enum Tier {
  ROBUST = 1,
  PLAUSIBLE = 2,
  SPECULATIVE = 3,
}

export interface Citation {
  doi: string;
  year: number;
  journal: string;
  title?: string;
}

export interface FunctionalClaim {
  claim: string;
  tier: Tier;
  tier_justification: string;
  citations: Citation[];
  contradicting?: Citation[];
}

export const TIER_META = {
  [Tier.ROBUST]: {
    icon: "🟢",
    label: "Robust",
    description: ">=5 independent replications, consensus",
    className: "tier tier-robust",
  },
  [Tier.PLAUSIBLE]: {
    icon: "🟡",
    label: "Plausible",
    description: "2-4 studies, mechanism debated",
    className: "tier tier-plausible",
  },
  [Tier.SPECULATIVE]: {
    icon: "🔴",
    label: "Speculative",
    description: "Single study or computational only",
    className: "tier tier-speculative",
  },
} as const;

export type TierValue = keyof typeof TIER_META;

export function getTierMeta(tier: Tier) {
  return TIER_META[tier];
}

export function tierFromString(value: string): Tier | null {
  const normalized = value.toLowerCase();
  if (normalized === "robust" || normalized === "1") return Tier.ROBUST;
  if (normalized === "plausible" || normalized === "2") return Tier.PLAUSIBLE;
  if (normalized === "speculative" || normalized === "3")
    return Tier.SPECULATIVE;
  return null;
}

export function passesTierFilter(tier: Tier, selected: readonly Tier[]) {
  return selected.includes(tier);
}
