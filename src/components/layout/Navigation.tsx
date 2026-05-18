"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { TierFilter } from "@/components/filters/TierFilter";
import { SearchBar } from "./SearchBar";

interface NavLink {
  label: string;
  href: string;
  blurb?: string;
}

interface NavGroup {
  id: string;
  label: string;
  links: NavLink[];
}

const navGroups: NavGroup[] = [
  {
    id: "anatomy",
    label: "Anatomy",
    links: [
      { label: "Atlases", href: "/atlas", blurb: "HCP-MMP1, Julich, Allen CCF, Desikan-Killiany" },
      { label: "3D viewer", href: "/viewer", blurb: "Interactive exploration of cortex and deep structures" },
      { label: "Microanatomy", href: "/microanatomy", blurb: "Cortical layers, hippocampal subfields, thalamic nuclei" },
      { label: "Cerebellum", href: "/cerebellum", blurb: "Lobules and cerebellar cortex" },
      { label: "Cellular", href: "/cellular", blurb: "Cell types, Siletti and Yao taxonomies" },
    ],
  },
  {
    id: "function",
    label: "Function",
    links: [
      { label: "Networks", href: "/networks", blurb: "DMN, salience, CEN, language, visual" },
      { label: "Neuromodulators", href: "/neuromodulators", blurb: "Dopamine, serotonin, NA, ACh, histamine" },
      { label: "Connectome", href: "/connectome", blurb: "HCP-MMP1 360-node graph with edges" },
      { label: "Gradient", href: "/gradient", blurb: "Margulies principal gradient" },
    ],
  },
  {
    id: "pathology",
    label: "Pathology",
    links: [
      { label: "Disorders", href: "/disorders", blurb: "ENIGMA maps, biomarkers, tiered evidence" },
      { label: "DBS", href: "/disorders/dbs", blurb: "DBS targets, indications, FDA status" },
    ],
  },
  {
    id: "learn",
    label: "Learn",
    links: [
      { label: "Explainers", href: "/explainers/principal-gradient", blurb: "Short walk-throughs of key concepts" },
      { label: "Quiz", href: "/quiz/cortical-anatomy", blurb: "Test your anatomical knowledge" },
      { label: "Development", href: "/development", blurb: "Brain-development timeline" },
      { label: "Decisive studies", href: "/decisive-studies", blurb: "Landmark papers" },
    ],
  },
  {
    id: "reference",
    label: "Reference",
    links: [
      { label: "Glossary", href: "/glossary" },
      { label: "Caveats", href: "/caveats" },
      { label: "Acknowledgments", href: "/acknowledgments" },
    ],
  },
];

function isActiveHref(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isActiveGroup(pathname: string, group: NavGroup): boolean {
  return group.links.some((link) => isActiveHref(pathname, link.href));
}

export function Navigation() {
  const pathname = usePathname() ?? "/";
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);

  // Close any open dropdown when route changes
  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [pathname]);

  // Outside click closes dropdown
  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (
        groupRef.current &&
        !groupRef.current.contains(event.target as Node)
      ) {
        setOpenGroup(null);
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  // Escape closes
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenGroup(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link className="brand" href="/" aria-label="NeuroAtlas Encyclopedia home">
          <span>NeuroAtlas</span>
          <span>Encyclopedia</span>
        </Link>

        <nav
          className="nav-groups"
          aria-label="Main navigation"
          ref={groupRef}
        >
          {navGroups.map((group) => {
            const isOpen = openGroup === group.id;
            const active = isActiveGroup(pathname, group);
            return (
              <div className="nav-group" key={group.id}>
                <button
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className={`nav-group-trigger${active ? " active" : ""}`}
                  onClick={() => setOpenGroup(isOpen ? null : group.id)}
                  type="button"
                >
                  {group.label}
                  <ChevronDown
                    aria-hidden="true"
                    size={14}
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 160ms ease",
                    }}
                  />
                </button>
                {isOpen ? (
                  <div className="nav-dropdown" role="menu">
                    {group.links.map((link) => (
                      <Link
                        className={`nav-dropdown-item${
                          isActiveHref(pathname, link.href) ? " active" : ""
                        }`}
                        href={link.href}
                        key={link.href}
                        role="menuitem"
                      >
                        <span className="nav-dropdown-label">{link.label}</span>
                        {link.blurb ? (
                          <span className="nav-dropdown-blurb">{link.blurb}</span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="nav-right">
          <SearchBar />
          <TierFilter compact />
          <button
            aria-controls="mobile-nav"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="nav-burger"
            onClick={() => setMobileOpen((v) => !v)}
            type="button"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="nav-mobile" id="mobile-nav">
          {navGroups.map((group) => (
            <section className="nav-mobile-group" key={group.id}>
              <h2 className="nav-mobile-heading">{group.label}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      className={
                        isActiveHref(pathname, link.href)
                          ? "nav-mobile-link active"
                          : "nav-mobile-link"
                      }
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : null}
    </header>
  );
}
