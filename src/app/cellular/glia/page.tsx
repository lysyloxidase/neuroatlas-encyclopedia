export default function GliaPage() {
  return (
    <section className="container section">
      <p className="eyebrow">Cellular</p>
      <h1>Glia</h1>
      <div className="grid">
        {["Astrocytes", "Oligodendrocytes", "Microglia"].map((name) => (
          <article className="card" key={name}>
            <h3>{name}</h3>
            <p className="muted">
              Phase 1 schema support for structure-level glial annotations.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
