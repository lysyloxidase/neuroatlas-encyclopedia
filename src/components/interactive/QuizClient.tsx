"use client";

import { useEffect, useState } from "react";
import { Citation } from "@/components/content/Citation";
import { TierBadge } from "@/components/content/TierBadge";
import type { QuizTopic } from "@/data/quizzes";

export function QuizClient({ topic }: { topic: QuizTopic }) {
  const storageKey = `neuroatlas-quiz-${topic.slug}`;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(storageKey));
    if (
      Number.isFinite(stored) &&
      stored >= 0 &&
      stored < topic.questions.length
    ) {
      setIndex(stored);
    }
  }, [storageKey, topic.questions.length]);

  const question = topic.questions[index];
  const answered = selected !== null;

  function next() {
    const nextIndex = (index + 1) % topic.questions.length;
    setIndex(nextIndex);
    setSelected(null);
    window.localStorage.setItem(storageKey, String(nextIndex));
  }

  return (
    <section className="card quiz-card" data-testid="quiz-module">
      <div className="section-heading-row">
        <h3>
          Question {index + 1} / {topic.totalQuestions}
        </h3>
        <TierBadge tier={question.tier} />
      </div>
      <div aria-hidden="true" className="quiz-figure">
        <span />
        <span />
        <span />
      </div>
      <p>{question.prompt}</p>
      <div className="grid" role="group" aria-label="Answer choices">
        {question.choices.map((choice) => (
          <button
            aria-pressed={selected === choice}
            className="filter-button"
            key={choice}
            onClick={() => setSelected(choice)}
            type="button"
          >
            {choice}
          </button>
        ))}
      </div>
      {answered ? (
        <article className="micro-tile" aria-live="polite">
          <strong>{selected === question.answer ? "Correct" : "Review"}</strong>
          <p>{question.explanation}</p>
          <Citation citation={question.citation} />
        </article>
      ) : null}
      <button className="button" onClick={next} type="button">
        Next
      </button>
    </section>
  );
}
