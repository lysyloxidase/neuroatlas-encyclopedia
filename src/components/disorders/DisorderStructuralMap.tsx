interface DisorderStructuralMapProps {
  name: string;
  regions: string[];
  mapType?: string;
}

const territoryColors: Record<string, string> = {
  MCA: "#06b6d4",
  ACA: "#22c55e",
  PCA: "#8b5cf6",
  "vertebral/basilar": "#f59e0b",
  lacunar: "#ef4444",
  watershed: "#f472b6",
};

export function DisorderStructuralMap({ name, regions, mapType }: DisorderStructuralMapProps) {
  if (mapType === "vascular") {
    const territories = [
      ["MCA", "lateral face/arm > leg"],
      ["ACA", "medial leg > arm"],
      ["PCA", "occipital + medial temporal + thalamus"],
      ["vertebral/basilar", "brainstem + cerebellum"],
      ["lacunar", "capsule, BG, thalamus"],
      ["watershed", "ACA-MCA and MCA-PCA borders"],
    ];
    return (
      <section className="card" data-testid="stroke-territory-map">
        <h3>Vascular Territory Map</h3>
        <svg aria-label="stroke vascular territory map" role="img" viewBox="0 0 720 260" width="100%" style={{ minHeight: "15rem" }}>
          {territories.map(([territory, label], index) => (
            <path
              d={`M ${80 + index * 92} ${70 + (index % 2) * 32} C ${130 + index * 80} ${20 + index * 8}, ${170 + index * 62} ${220 - index * 13}, ${250 + index * 64} ${125}`}
              data-testid="vascular-territory"
              fill="none"
              key={territory}
              stroke={territoryColors[territory]}
              strokeLinecap="round"
              strokeWidth="14"
            >
              <title>{territory}: {label}</title>
            </path>
          ))}
        </svg>
        <ul className="pill-list">
          {territories.map(([territory, label]) => (
            <li key={territory}>{territory}: {label}</li>
          ))}
        </ul>
      </section>
    );
  }

  if (mapType === "hippocampal_sclerosis") {
    return (
      <section className="card" data-testid="hippocampal-sclerosis-map">
        <h3>Hippocampal Sclerosis Pattern</h3>
        <p className="muted">ILAE type 1: CA1 + CA4/hilus + dentate gyrus loss with relative CA2 preservation.</p>
        <div className="grid">
          {["CA1 loss", "CA4/hilus loss", "DG loss", "CA2 preserved"].map((field) => (
            <article className="micro-tile" key={field}>
              <strong>{field}</strong>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="card" data-testid="disorder-structural-map">
      <h3>Structural Map</h3>
      <p className="muted">{name} primary structures and atlas targets.</p>
      <svg aria-label={`${name} structural map`} role="img" viewBox="0 0 720 240" width="100%" style={{ minHeight: "14rem" }}>
        <ellipse cx="360" cy="120" fill="#020617" rx="250" ry="88" stroke="rgba(148, 163, 184, 0.32)" />
        {regions.slice(0, 10).map((region, index) => {
          const angle = (index / Math.max(regions.slice(0, 10).length, 1)) * Math.PI * 2;
          const x = 360 + Math.cos(angle) * 180;
          const y = 120 + Math.sin(angle) * 62;
          return (
            <g data-testid="structural-map-region" key={region}>
              <circle cx={x} cy={y} fill={index % 2 ? "#8b5cf6" : "#06b6d4"} r="15" opacity="0.82" />
              <text fill="#e5e7eb" fontSize="11" textAnchor="middle" x={x} y={y + 30}>{region}</text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}
