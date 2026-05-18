import tracts from "@/data/tracts.json";

interface TractSegEntry {
  slug: string;
  name: string;
  tractseg_label: string;
  group: string;
  render_top20: boolean;
  endpoints: string[];
  functions: string[];
  asymmetry?: {
    leftward_in_right_handers_percent: number;
  };
}

const topTracts = (tracts as TractSegEntry[]).filter(
  (tract) => tract.render_top20,
);

const groupColors: Record<string, string> = {
  association: "#06b6d4",
  commissural: "#8b5cf6",
  projection: "#fb923c",
  cerebellar: "#10b981",
};

export function TractSegViewer() {
  return (
    <section className="card" data-testid="tractseg-viewer">
      <h3>TractSeg Major Tracts</h3>
      <p className="muted">
        {topTracts.length} priority tract tube geometries rendered from the
        72-label TractSeg scaffold.
      </p>
      <svg
        aria-label="TractSeg tube geometry"
        role="img"
        viewBox="0 0 720 260"
        width="100%"
        style={{ minHeight: "16rem" }}
      >
        {topTracts.map((tract, index) => {
          const y = 18 + index * 11;
          const offset = (index % 5) * 22;
          return (
            <path
              d={`M ${40 + offset} ${y} C ${180 + offset} ${y - 28}, ${410 - offset} ${y + 32}, ${680 - offset} ${y}`}
              data-testid="tract-tube"
              fill="none"
              key={tract.slug}
              stroke={groupColors[tract.group] ?? "#cbd5e1"}
              strokeLinecap="round"
              strokeOpacity="0.82"
              strokeWidth={
                tract.name.includes("Arcuate fasciculus long") ? 7 : 4
              }
            />
          );
        })}
      </svg>
      <div className="grid">
        {topTracts.map((tract) => (
          <article className="micro-tile" key={tract.slug}>
            <strong>{tract.name}</strong>
            <p className="muted">
              {tract.group} · {tract.endpoints.join(" -> ")}
            </p>
            {tract.asymmetry ? (
              <p className="mono">
                Leftward asymmetry in ~
                {tract.asymmetry.leftward_in_right_handers_percent}% of
                right-handers
              </p>
            ) : (
              <p className="mono">{tract.tractseg_label}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
