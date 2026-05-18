"use client";

export function ThalamicNucleiOverlay({ count = 60 }: { count?: number }) {
  return (
    <section className="card" data-testid="thalamic-nuclei-overlay">
      <h3>Iglesias Thalamic Atlas Overlay</h3>
      <p className="mono">{count} thalamic nuclei labels loaded</p>
      <p className="muted">Anterior, medial, midline, intralaminar, ventral, lateral, pulvinar, geniculate, and reticular nuclei.</p>
    </section>
  );
}
