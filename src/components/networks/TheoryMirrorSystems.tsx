import networks from "@/data/networks.json";
import { TierBadge } from "@/components/content/TierBadge";
import { Tier } from "@/lib/tier";

interface SocialNetwork {
  slug: string;
  name: string;
  tier: Tier;
  key_regions: string[];
  note?: string;
}

const socialNetworks = (networks as unknown as SocialNetwork[]).filter(
  (network) =>
    ["theory-of-mind", "mirror-neuron-system"].includes(network.slug),
);

export function TheoryMirrorSystems() {
  return (
    <section className="card" data-testid="theory-mirror-systems">
      <h3>Theory of Mind + Mirror System</h3>
      <div className="grid">
        {socialNetworks.map((network) => (
          <article className="micro-tile" key={network.slug}>
            <strong>{network.name}</strong>
            <TierBadge tier={network.tier} />
            <ul className="pill-list">
              {network.key_regions.map((region) => (
                <li key={region}>{region}</li>
              ))}
            </ul>
            {network.note ? <p className="muted">{network.note}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
