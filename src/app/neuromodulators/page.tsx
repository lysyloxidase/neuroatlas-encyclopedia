import Link from "next/link";
import { NeurotransmitterMap } from "@/components/interactive/NeurotransmitterMap";
import { TierBadge } from "@/components/content/TierBadge";
import neuromodulators from "@/data/neuromodulators.json";
import type { Neuromodulator } from "@/lib/types";

const systems = neuromodulators as Neuromodulator[];

export default function NeuromodulatorsPage() {
  return (
    <section className="container section">
      <p className="eyebrow">Level 5</p>
      <h1>Neuromodulators</h1>
      <p className="lead">Ascending modulatory nuclei, principal neurotransmitters, receptors, projection fields, and disease-relevant vulnerabilities.</p>
      <NeurotransmitterMap />
      <div className="grid" style={{ marginTop: "1rem" }}>
        {systems.map((system) => (
          <Link className="card" href={`/neuromodulators/${system.slug}`} key={system.slug}>
            <h3>{system.name}</h3>
            <TierBadge tier={system.tier} />
            <p className="mono">{system.abbreviation}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
