import explainers from "@/data/explainers.json";
import { Citation } from "@/components/content/Citation";
import { EquationCard } from "@/components/content/EquationCard";
import { ExplainerWidget } from "@/components/interactive/ExplainerWidget";

export function generateStaticParams() {
  return explainers.map((explainer) => ({ slug: explainer.slug }));
}

export default async function ExplainerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const explainer =
    explainers.find((item) => item.slug === slug) ?? explainers[0];

  return (
    <section className="container section">
      <p className="eyebrow">Distill-style explainer</p>
      <h1>{explainer.title}</h1>
      <article className="callout">
        <strong>BLUF:</strong> {explainer.bluf}
      </article>
      <article className="callout secondary">
        <strong>What changes if you do not read further:</strong>{" "}
        {explainer.changes}
      </article>
      <ExplainerWidget kind={explainer.widget} />
      <div className="grid" style={{ marginTop: "1rem" }}>
        <article className="card">
          <h3>Hover Glosses</h3>
          <ul className="pill-list">
            {explainer.glosses.map((gloss) => (
              <li
                key={gloss}
                title={`${gloss}: context-specific term used in this explainer`}
              >
                {gloss}
              </li>
            ))}
          </ul>
        </article>
        <EquationCard
          description="A compact notation anchor for the interactive argument above."
          equation={explainer.equation}
          title="Concept Equation"
        />
        <article className="card">
          <h3>Primary Citation</h3>
          <ul className="list">
            {explainer.citations.map((citation) => (
              <li key={citation.doi}>
                <Citation citation={citation} />
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
