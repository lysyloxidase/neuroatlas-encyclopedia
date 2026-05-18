"use client";

import { useState } from "react";
import type { Disorder } from "@/lib/types";

export function DisorderFilter({ disorders }: { disorders: Disorder[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.toLowerCase();

  return (
    <div>
      <input
        aria-label="Filter disorders"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Filter disorders"
        value={query}
      />
      <ul className="list">
        {disorders
          .filter((disorder) => disorder.name.toLowerCase().includes(normalized))
          .map((disorder) => (
            <li className="card" key={disorder.slug}>
              {disorder.name}
            </li>
          ))}
      </ul>
    </div>
  );
}
