import type { Structure } from "@/lib/types";

export function CytoarchitectureBox({ structure }: { structure: Structure }) {
  const { cytoarchitecture } = structure;

  return (
    <section className="card" id="cytoarchitecture">
      <h3>Cytoarchitecture</h3>
      {cytoarchitecture.layers ? <p>{cytoarchitecture.layers}</p> : null}
      <div className="grid">
        <div>
          <strong>Excitatory</strong>
          <ul className="pill-list">
            {cytoarchitecture.cell_classes.excitatory.map((cell) => (
              <li key={cell}>{cell}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Inhibitory</strong>
          <ul className="pill-list">
            {cytoarchitecture.cell_classes.inhibitory.map((cell) => (
              <li key={cell}>{cell}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
