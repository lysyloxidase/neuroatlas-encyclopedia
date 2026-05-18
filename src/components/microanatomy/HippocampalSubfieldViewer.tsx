"use client";

export const HIPPOCAMPAL_SUBFIELDS = [
  "DG-GCL",
  "DG molecular layer",
  "DG hilus/CA4",
  "CA3",
  "CA2",
  "CA1",
  "Subiculum",
  "Presubiculum",
  "Parasubiculum",
  "MEC",
  "LEC",
  "Braak I/II EC tau zone",
] as const;

export function HippocampalSubfieldViewer() {
  return (
    <section className="card" data-testid="hippocampal-subfield-viewer">
      <h3>Hippocampal Subfields</h3>
      <div className="grid">
        {HIPPOCAMPAL_SUBFIELDS.map((subfield, index) => (
          <div
            className="micro-tile"
            data-testid="hippocampal-subfield"
            key={subfield}
            style={{ borderColor: `hsl(${(index * 29) % 360} 80% 58%)` }}
          >
            {subfield}
          </div>
        ))}
      </div>
    </section>
  );
}
