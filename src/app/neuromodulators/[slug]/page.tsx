import { notFound } from "next/navigation";
import systems from "@/data/neuromodulators.json";
import { TierBadge } from "@/components/content/TierBadge";
import type { Neuromodulator } from "@/lib/types";

const neuromodulators = systems as Neuromodulator[];

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
      <h2>Nuclei</h2>
      <p>{system.nuclei.join(", ")}</p>
      <h2>Projection scaffold</h2>
      <p>{system.projections.join(", ")}</p>
    </section>
  );
}
