const acknowledgments = [
  "Allen Institute for Brain Science",
  "BICCN (Brain Initiative Cell Census Network)",
  "Human Connectome Project",
  "EBRAINS / Julich Forschungszentrum",
  "ENIGMA Consortium",
  "FreeSurfer and Iglesias atlas contributors",
  "TractSeg and Wasserthal contributors",
  "Margulies lab",
  "All primary authors cited across NeuroAtlas Encyclopedia",
];

export default function AcknowledgmentsPage() {
  return (
    <section className="container section">
      <p className="eyebrow">Licensing and credits</p>
      <h1>Acknowledgments</h1>
      <div className="grid">
        {acknowledgments.map((name) => (
          <article className="card" key={name}>
            <h3>{name}</h3>
            <p className="muted">
              Source data and publications are credited in entry-level DOI
              trails and atlas metadata.
            </p>
          </article>
        ))}
      </div>
      <article className="callout" style={{ marginTop: "1rem" }}>
        Code is Apache-2.0. Original content is CC-BY-SA 4.0. Atlas data retains
        upstream licensing and attribution.
      </article>
    </section>
  );
}
