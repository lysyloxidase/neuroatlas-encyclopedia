import Link from "next/link";
import { Citation } from "@/components/content/Citation";
import { TierBadge } from "@/components/content/TierBadge";
import { Tier } from "@/lib/tier";
import { structures } from "@/lib/structures";

const ccasCitations = [
  {
    doi: "10.1093/brain/awx317",
    year: 2018,
    journal: "Brain",
    title: "The cerebellar cognitive affective/Schmahmann syndrome scale",
  },
  {
    doi: "10.1007/s12311-023-01651-0",
    year: 2023,
    journal: "The Cerebellum",
    title: "Cerebellar cognitive affective syndrome",
  },
] as const;

export default function CerebellumPage() {
  const cerebellarStructures = structures.filter(
    (structure) => structure.macroanatomy?.category === "cerebellum",
  );

  return (
    <section className="container section">
      <p className="eyebrow">Cerebellum</p>
      <h1>Cerebellum</h1>
      <article className="card" style={{ marginTop: "1rem" }}>
        <div className="button-row">
          <span className="new-badge">PROMINENT</span>
          <TierBadge
            tier={Tier.ROBUST}
            justification="Validated syndrome scale and recent clinical review evidence."
          />
        </div>
        <h2>Cerebellar Cognitive Affective/Schmahmann Syndrome</h2>
        <p className="lead">
          CCAS is surfaced as a first-class cerebellar finding: posterior
          cerebellar injury can produce executive, linguistic, spatial, and
          affective symptoms in addition to motor signs.
        </p>
        <ul className="list">
          {ccasCitations.map((citation) => (
            <li key={citation.doi}>
              <Citation citation={citation} />
            </li>
          ))}
        </ul>
      </article>
      <div className="grid" style={{ marginTop: "1rem" }}>
        {cerebellarStructures.map((structure) => (
          <Link
            className="card"
            href={`/structures/level-1/${structure.names.english.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            key={structure.structure_id}
          >
            <h3>{structure.names.english}</h3>
            <p className="muted">{structure.functions[0]?.claim}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
