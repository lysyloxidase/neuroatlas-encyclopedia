import glossary from "@/data/glossary.json";

export default function GlossaryPage() {
  return (
    <section className="container section">
      <p className="eyebrow">Reference</p>
      <h1>Glossary</h1>
      <dl className="grid" style={{ marginTop: "1rem" }}>
        {glossary.map((item) => (
          <div className="card" key={item.term}>
            <dt>
              <strong>{item.term}</strong>
            </dt>
            <dd className="muted" style={{ margin: 0 }}>
              {item.definition}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
