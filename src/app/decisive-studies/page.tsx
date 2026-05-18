import { Citation } from "@/components/content/Citation";
import { structures } from "@/lib/structures";

export default function DecisiveStudiesPage() {
  const citations = Array.from(
    new Map(
      structures
        .flatMap((structure) => structure.primary_citations)
        .map((citation) => [citation.doi, citation]),
    ).values(),
  );

  return (
    <section className="container section">
      <p className="eyebrow">Primary citations</p>
      <h1>Decisive Studies</h1>
      <ul className="list">
        {citations.map((citation) => (
          <li className="card" key={citation.doi}>
            <Citation citation={citation} />
            {citation.title ? <p className="muted">{citation.title}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
