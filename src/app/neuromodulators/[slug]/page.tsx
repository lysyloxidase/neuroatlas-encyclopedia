import { notFound } from "next/navigation";
import systems from "@/data/neuromodulators.json";
import { Citation } from "@/components/content/Citation";
import { TierBadge } from "@/components/content/TierBadge";
import type { Neuromodulator } from "@/lib/types";

type Phase5Neuromodulator = Neuromodulator & {
  color: string;
  cell_body_locations: Array<{
    name: string;
    xyz: [number, number, number];
  }>;
  projection_fields: string[];
  pathways: string[];
  receptors: string[];
  taxonomy: string[];
  clinical_notes: string[];
};

const neuromodulators = systems as Phase5Neuromodulator[];

export function generateStaticParams() {
  return neuromodulators.map((system) => ({ slug: system.slug }));
}

export default async function NeuromodulatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const system = neuromodulators.find((item) => item.slug === slug);
  if (!system) notFound();

  return (
    <section className="container section">
      <p className="eyebrow">{system.abbreviation}</p>
      <h1>{system.name}</h1>
      <TierBadge tier={system.tier} />
      <div className="grid" style={{ marginTop: "1rem" }}>
        <article className="card">
          <h3>Nuclei</h3>
          <ul className="pill-list">
            {system.nuclei.map((nucleus) => (
              <li key={nucleus}>{nucleus}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Projection Fields</h3>
          <p>{system.projections.join(", ")}</p>
          <ul className="list">
            {system.projection_fields.map((projection) => (
              <li key={projection}>{projection}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Pathways</h3>
          <ul className="list">
            {system.pathways.map((pathway) => (
              <li key={pathway}>{pathway}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Receptors</h3>
          <ul className="pill-list">
            {system.receptors.map((receptor) => (
              <li key={receptor}>{receptor}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Taxonomy</h3>
          <ul className="list">
            {system.taxonomy.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Clinical Notes</h3>
          <ul className="list">
            {system.clinical_notes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Citations</h3>
          <ul className="list">
            {system.citations.map((citation) => (
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
