import { notFound } from "next/navigation";
import { QuizClient } from "@/components/interactive/QuizClient";
import { findQuizTopic, quizTopics } from "@/data/quizzes";

export function generateStaticParams() {
  return quizTopics.map((topic) => ({ topic: topic.slug }));
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const quiz = findQuizTopic(topic);
  if (!quiz) notFound();

  return (
    <section className="container section">
      <p className="eyebrow">Quiz</p>
      <h1>{quiz.title}</h1>
      <p className="lead">
        Tier-aware practice with local progress tracking. Quizzes use robust and
        plausible claims only.
      </p>
      <QuizClient topic={quiz} />
    </section>
  );
}
