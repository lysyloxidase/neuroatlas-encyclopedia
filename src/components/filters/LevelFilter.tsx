"use client";

import { useState } from "react";

export interface LevelFilterItem {
  id: string;
  title: string;
  level: 1 | 2 | 3;
}

export function LevelFilter({ items }: { items: LevelFilterItem[] }) {
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(1);
  const levels = [1, 2, 3] as const;

  return (
    <div>
      <div className="filter-bar" aria-label="Level filter">
        {levels.map((level) => (
          <button
            aria-pressed={selectedLevel === level}
            className="filter-button"
            key={level}
            onClick={() => setSelectedLevel(level)}
            type="button"
          >
            Level {level}
          </button>
        ))}
      </div>
      <ul className="list" data-testid="level-filter-results">
        {items
          .filter((item) => item.level === selectedLevel)
          .map((item) => (
            <li className="card" data-level={item.level} key={item.id}>
              {item.title}
            </li>
          ))}
      </ul>
    </div>
  );
}
