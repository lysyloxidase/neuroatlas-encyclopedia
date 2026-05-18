const explainers = [
  {
    slug: "tier-system",
    title: "Tier Classification",
    body: "Claims are separated from structures so robust, plausible, and speculative statements can coexist without flattening uncertainty.",
  },
  {
    slug: "four-atlas-backbone",
    title: "Four-Atlas Backbone",
    body: "HCP-MMP1, Julich-Brain, Allen CCFv3, and Desikan-Killiany supply complementary surface, cytoarchitectonic, mouse, and gyral references.",
  },
];

export function generateStaticParams() {
  return explainers.map((explainer) => ({ slug: explainer.slug }));
}

export default async function ExplainerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const explainer = explainers.find((item) => item.slug === slug) ?? explainers[0];

  return (
    <section className="container section">
      <p className="eyebrow">Explainer</p>
      <h1>{explainer.title}</h1>
      <p className="lead">{explainer.body}</p>
    </section>
  );
}
