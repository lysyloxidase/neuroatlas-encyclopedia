"use client";

import { useEffect, useState } from "react";

const views = [
  {
    id: "student",
    label: "Student",
    description:
      "Plain-language intuition, landmark anatomy, and a low-friction animation-first reading path.",
  },
  {
    id: "researcher",
    label: "Researcher",
    description:
      "Cell classes, atlas crosswalks, quantitative benchmarks, caveats, and DOI-backed source trails.",
  },
  {
    id: "clinician",
    label: "Clinician",
    description:
      "Imaging signatures, biomarkers, disorders, DBS targets, and bedside-relevant differential anchors.",
  },
] as const;

type AudienceId = (typeof views)[number]["id"];

interface AudienceTabsProps {
  context: "structure" | "disorder";
}

const storageKey = "neuroatlas-audience-view";

export function AudienceTabs({ context }: AudienceTabsProps) {
  const [active, setActive] = useState<AudienceId>("student");

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (
      stored === "student" ||
      stored === "researcher" ||
      stored === "clinician"
    ) {
      setActive(stored);
    }
  }, []);

  function choose(view: AudienceId) {
    setActive(view);
    window.localStorage.setItem(storageKey, view);
  }

  const selected = views.find((view) => view.id === active) ?? views[0];

  return (
    <section
      aria-label={`${context} audience view`}
      className="audience-tabs"
      data-testid="audience-tabs"
    >
      <div className="filter-bar" role="tablist">
        {views.map((view) => (
          <button
            aria-controls={`audience-panel-${view.id}`}
            aria-selected={active === view.id}
            className="filter-button"
            id={`audience-tab-${view.id}`}
            key={view.id}
            onClick={() => choose(view.id)}
            role="tab"
            type="button"
          >
            {view.label}
          </button>
        ))}
      </div>
      <article
        aria-labelledby={`audience-tab-${selected.id}`}
        className="micro-tile"
        id={`audience-panel-${selected.id}`}
        role="tabpanel"
      >
        <h3>{selected.label} View</h3>
        <p>{selected.description}</p>
      </article>
    </section>
  );
}
