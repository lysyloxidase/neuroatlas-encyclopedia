"use client";

import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <label className="search">
      <span className="sr-only">Search NeuroAtlas</span>
      <div style={{ position: "relative" }}>
        <Search aria-hidden="true" size={16} style={{ left: 10, position: "absolute", top: 11 }} />
        <input placeholder="Search structures" style={{ paddingLeft: "2rem" }} type="search" />
      </div>
    </label>
  );
}
