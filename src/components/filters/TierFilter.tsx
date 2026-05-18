"use client";

import { useMemo, useState } from "react";
import { passesTierFilter, Tier, TIER_META } from "@/lib/tier";

export interface TierFilterItem {
  id: string;
  title: string;
  tier: Tier;
  body?: string;
}

interface TierFilterProps {
  items?: TierFilterItem[];
  compact?: boolean;
}

const ALL_TIERS = [Tier.ROBUST, Tier.PLAUSIBLE, Tier.SPECULATIVE] as const;

export function TierFilter({ items = [], compact = false }: TierFilterProps) {
  const [selected, setSelected] = useState<Tier[]>([...ALL_TIERS]);
  const visibleItems = useMemo(
    () => items.filter((item) => passesTierFilter(item.tier, selected)),
    [items, selected],
  );

  function toggle(tier: Tier) {
    setSelected((current) =>
      current.includes(tier)
        ? current.filter((value) => value !== tier)
        : [...current, tier].sort(),
    );
  }

  return (
    <div>
      <div className="filter-bar" aria-label="Tier filter">
        {ALL_TIERS.map((tier) => {
          const meta = TIER_META[tier];
          return (
            <button
              aria-pressed={selected.includes(tier)}
              className="filter-button"
              key={tier}
              onClick={() => toggle(tier)}
              title={meta.description}
              type="button"
            >
              <span aria-hidden="true">{meta.icon}</span>{" "}
              {compact ? meta.label[0] : meta.label}
            </button>
          );
        })}
      </div>
      {items.length > 0 ? (
        <ul className="list" data-testid="tier-filter-results">
          {visibleItems.map((item) => (
            <li className="card" data-tier={item.tier} key={item.id}>
              <strong>{item.title}</strong>
              {item.body ? <p className="muted">{item.body}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
