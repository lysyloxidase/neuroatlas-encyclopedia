"use client";

"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { buildSearchIndex } from "@/lib/search-index";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const index = useMemo(() => buildSearchIndex(), []);
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (normalized.length < 2) return [];
    return index
      .filter((entry) => entry.tokens.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [index, normalized]);

  return (
    <div className="search">
      <label className="sr-only" htmlFor="global-search">
        Search NeuroAtlas
      </label>
      <div style={{ position: "relative" }}>
        <Search
          aria-hidden="true"
          size={16}
          style={{ left: 10, position: "absolute", top: 11 }}
        />
        <input
          aria-autocomplete="list"
          aria-controls="global-search-results"
          id="global-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search atlas"
          style={{ paddingLeft: "2rem" }}
          type="search"
          value={query}
        />
      </div>
      {results.length > 0 ? (
        <div
          className="search-results"
          id="global-search-results"
          role="listbox"
        >
          {results.map((entry) => (
            <Link
              className="search-result"
              href={entry.href}
              key={`${entry.category}-${entry.id}`}
              role="option"
            >
              <span>{entry.title}</span>
              <small>
                {entry.category} · {entry.subtitle}
              </small>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
