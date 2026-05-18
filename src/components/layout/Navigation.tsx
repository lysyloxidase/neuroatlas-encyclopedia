import Link from "next/link";
import { TierFilter } from "@/components/filters/TierFilter";
import { SearchBar } from "./SearchBar";

const links = [
  ["Atlas", "/atlas"],
  ["Viewer", "/viewer"],
  ["Cellular", "/cellular"],
  ["Networks", "/networks"],
  ["NeuroNT", "/neuromodulators"],
  ["Disorders", "/disorders"],
  ["Micro", "/microanatomy"],
  ["Explain", "/explainers/principal-gradient"],
  ["Quiz", "/quiz/cortical-anatomy"],
  ["Connectome", "/connectome"],
  ["Caveats", "/caveats"],
  ["Glossary", "/glossary"],
] as const;

export function Navigation() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link className="brand" href="/">
          <span>NeuroAtlas</span>
          <span>Encyclopedia</span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <SearchBar />
        <TierFilter compact />
      </div>
    </header>
  );
}
