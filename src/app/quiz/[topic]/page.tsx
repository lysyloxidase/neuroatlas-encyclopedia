export function generateStaticParams() {
  return [{ topic: "tiers" }, { topic: "atlas" }];
}

export default async function QuizPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;

  return (
    <section className="container section">
      <p className="eyebrow">Quiz</p>
      <h1>{topic.replace(/-/g, " ")}</h1>
      <article className="card">
        <h3>Question 1</h3>
        <p className="muted">Which tier requires at least five independent replications and consensus?</p>
        <p>🟢 Robust</p>
      </article>
    </section>
  );
}
