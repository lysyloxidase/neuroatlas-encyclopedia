import { notFound } from "next/navigation";
import disorders from "@/data/disorders.json";
import { TierBadge } from "@/components/content/TierBadge";
import { DisorderToggle } from "@/components/interactive/DisorderToggle";
import type { Disorder } from "@/lib/types";

const disorderList = disorders as Disorder[];

export function generateStaticParams() {
  return disorderList.map((disorder) => ({ slug: disorder.slug }));
}

export default async function DisorderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const disorder = disorderList.find((item) => item.slug === slug);
  if (!disorder) notFound();

  return (
    <section className="container section">
      <p className="eyebrow">ENIGMA overlay</p>
      <h1>{disorder.name}</h1>
      <TierBadge tier={disorder.tier} />
      <p className="lead">{disorder.summary}</p>
      <p className="mono">{disorder.enigma_overlay}</p>
      <DisorderToggle />
    </section>
  );
}
