import { notFound } from "next/navigation";
import networks from "@/data/networks.json";
import { TierBadge } from "@/components/content/TierBadge";
import type { Network } from "@/lib/types";

const networkList = networks as Network[];

export function generateStaticParams() {
  return networkList.map((network) => ({ slug: network.slug }));
}

export default async function NetworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const network = networkList.find((item) => item.slug === slug);
  if (!network) notFound();

  return (
    <section className="container section">
      <p className="eyebrow">{network.system}</p>
      <h1>{network.name}</h1>
      <TierBadge tier={network.tier} />
      <p className="lead">{network.description}</p>
      <ul className="pill-list">
        {network.key_regions.map((region) => (
          <li key={region}>{region}</li>
        ))}
      </ul>
    </section>
  );
}
