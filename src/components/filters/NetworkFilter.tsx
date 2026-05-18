"use client";

import { useState } from "react";
import type { Network } from "@/lib/types";

export function NetworkFilter({ networks }: { networks: Network[] }) {
  const [system, setSystem] = useState("all");
  const systems = ["all", ...Array.from(new Set(networks.map((network) => network.system)))];

  return (
    <div>
      <select aria-label="Network system" onChange={(event) => setSystem(event.target.value)} value={system}>
        {systems.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <ul className="list">
        {networks
          .filter((network) => system === "all" || network.system === system)
          .map((network) => (
            <li className="card" key={network.slug}>
              {network.name}
            </li>
          ))}
      </ul>
    </div>
  );
}
