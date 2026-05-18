import circuits from "@/data/limbic/circuits.json";

interface Circuit {
  slug: string;
  name: string;
  edges: [string, string][];
  citation: {
    doi: string;
  };
}

const circuitRows = circuits as unknown as Circuit[];

export function LimbicCircuitGraph() {
  return (
    <section className="card" data-testid="limbic-circuit-graph">
      <h3>Limbic Circuit Overlays</h3>
      <div className="grid">
        {circuitRows.map((circuit) => (
          <article className="micro-tile" key={circuit.slug}>
            <strong>{circuit.name}</strong>
            <ul className="list">
              {circuit.edges.map(([source, target]) => (
                <li data-testid="circuit-edge" key={`${circuit.slug}-${source}-${target}`}>
                  <span>{source}</span>
                  {" -> "}
                  <span>{target}</span>
                </li>
              ))}
            </ul>
            <p className="mono">{circuit.citation.doi}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
