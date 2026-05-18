import networks from "@/data/networks.json";

interface HomunculusNetwork {
  slug: string;
  name: string;
  color: string;
  homunculus: string[];
}

const rows = (networks as unknown as HomunculusNetwork[]).filter((network) => network.homunculus);

export function MotorSomatosensoryHomunculus() {
  return (
    <section className="card" data-testid="homunculus-panel">
      <h3>Motor + Somatosensory Homunculi</h3>
      <div className="grid">
        {rows.map((network) => (
          <article className="micro-tile" data-testid="homunculus-map" key={network.slug}>
            <strong>{network.name}</strong>
            <div style={{ display: "grid", gap: "0.35rem", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", marginTop: "0.75rem" }}>
              {network.homunculus.map((part, index) => (
                <span className="filter-button" key={part} style={{ borderColor: network.color, minHeight: `${2.2 + index * 0.18}rem` }}>
                  {part}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
