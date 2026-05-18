import { notFound } from "next/navigation";
import disorders from "@/data/disorders.json";
import { AudienceTabs } from "@/components/content/AudienceTabs";
import { Citation } from "@/components/content/Citation";
import { DisorderStructuralMap } from "@/components/disorders/DisorderStructuralMap";
import { PathwaySpreadAnimation } from "@/components/disorders/PathwaySpreadAnimation";
import { TierBadge } from "@/components/content/TierBadge";
import { DisorderToggle } from "@/components/interactive/DisorderToggle";
import { ENIGMAOverlay } from "@/components/interactive/ENIGMAOverlay";
import type { Disorder } from "@/lib/types";

type Phase6Disorder = Disorder & {
  structural_map_regions: string[];
  biomarkers: string[];
  treatments: string[];
  dbs_targets: string[];
  braak_type?: "ad_tau" | "pd_lewy" | "hd_striatal" | "als_motor";
  map_type?: string;
  mechanism_tier?: number;
};

const disorderList = disorders as Phase6Disorder[];

export function generateStaticParams() {
  return disorderList.map((disorder) => ({ slug: disorder.slug }));
}

export default async function DisorderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const disorder = disorderList.find((item) => item.slug === slug);
  if (!disorder) notFound();

  return (
    <section className="container section">
      <p className="eyebrow">ENIGMA overlay</p>
      <h1>{disorder.name}</h1>
      <TierBadge tier={disorder.tier} />
      <p className="lead">{disorder.summary}</p>
      <AudienceTabs context="disorder" />
      <p className="mono">{disorder.enigma_overlay}</p>
      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        <DisorderStructuralMap
          name={disorder.name}
          regions={disorder.structural_map_regions}
          mapType={disorder.map_type}
        />
        <ENIGMAOverlay disorder={disorder.slug} />
        {disorder.braak_type ? (
          <PathwaySpreadAnimation type={disorder.braak_type} />
        ) : null}
        <div className="grid">
          <article className="card">
            <h3>Biomarkers</h3>
            <ul className="list">
              {disorder.biomarkers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h3>Treatments / Targets</h3>
            <ul className="list">
              {[
                ...disorder.treatments,
                ...disorder.dbs_targets.map(
                  (target) => `DBS target: ${target}`,
                ),
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h3>Affected Structures</h3>
            <ul className="pill-list">
              {disorder.affected_structures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h3>Citations</h3>
            <ul className="list">
              {disorder.citations.map((citation) => (
                <li key={citation.doi}>
                  <Citation citation={citation} />
                </li>
              ))}
            </ul>
          </article>
        </div>
        <DisorderToggle />
      </div>
      <p className="muted" style={{ marginTop: "1rem" }}>
        Educational resource. NOT medical advice or diagnosis. Always consult
        licensed clinicians for individual cases.
      </p>
    </section>
  );
}
