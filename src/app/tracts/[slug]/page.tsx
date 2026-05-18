import { notFound } from "next/navigation";
import tracts from "@/data/tracts.json";
import { TierBadge } from "@/components/content/TierBadge";
import type { Tract } from "@/lib/types";

const tractList = tracts as Tract[];

export function generateStaticParams() {
  return tractList.map((tract) => ({ slug: tract.slug }));
}

export default async function TractPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tract = tractList.find((item) => item.slug === slug);
  if (!tract) notFound();

  return (
    <section className="container section">
      <p className="eyebrow">TractSeg {tract.tractseg_label}</p>
      <h1>{tract.name}</h1>
      <TierBadge tier={tract.tier} />
      <h2>Endpoints</h2>
      <p>{tract.endpoints.join(" -> ")}</p>
      <h2>Functions</h2>
      <p>{tract.functions.join(", ")}</p>
    </section>
  );
}
