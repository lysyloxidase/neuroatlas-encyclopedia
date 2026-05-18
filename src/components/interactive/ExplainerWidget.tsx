"use client";

import { useState } from "react";

const widgetCopy: Record<string, string[]> = {
  gradient: ["V1 / M1", "association cortex", "DMN apex"],
  atlas: ["Brodmann", "HCP-MMP1", "Julich"],
  "cell-taxonomy": ["supercluster", "cluster", "subcluster"],
  braak: ["transentorhinal", "limbic", "association cortex"],
  cerebellum: ["motor", "cognitive", "affective"],
  language: ["dorsal articulation", "ventral semantics", "left lateralized"],
  network: ["task-negative", "PCC", "mPFC"],
  hippocampus: ["grid", "place", "context"],
  neuromodulator: ["LC seed", "projection field", "vulnerability"],
  causal: ["association", "adjustment", "intervention"],
  interneurons: ["PV", "SST", "VIP/LAMP5/SNCG"],
  striatum: ["matrix", "striosome", "czGPe"],
};

export function ExplainerWidget({ kind }: { kind: string }) {
  const [step, setStep] = useState(0);
  const steps = widgetCopy[kind] ?? [
    "concept",
    "interaction",
    "interpretation",
  ];
  const active = steps[step % steps.length];

  return (
    <section className="card explainer-widget" data-testid="explainer-widget">
      <div className="section-heading-row">
        <h3>{active}</h3>
        <button
          className="filter-button"
          onClick={() => setStep((value) => value + 1)}
          type="button"
        >
          Advance
        </button>
      </div>
      <div aria-hidden="true" className="story-rail">
        {steps.map((item, index) => (
          <span
            className={index === step % steps.length ? "active" : ""}
            key={item}
          />
        ))}
      </div>
      <p className="muted">
        Scroll-story checkpoint {step + 1}: hover terms and advance the widget
        to compare the main concept states.
      </p>
    </section>
  );
}
