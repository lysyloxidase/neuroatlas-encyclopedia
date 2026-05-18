import { notFound } from "next/navigation";
import networks from "@/data/networks.json";
import { Citation } from "@/components/content/Citation";
import { TierBadge } from "@/components/content/TierBadge";
import type { Network } from "@/lib/types";

type Phase5Network = Network & {
  color: string;
  core_nodes?: Array<{
    name: string;
    hcp_mmp1: string[];
    julich: string[];
    role: string;
  }>;
  function_claims?: string[];
  connectivity?: string;
  disorders?: string[];
  streams?: Array<{
    name: string;
    route: string[];
    function: string;
  }>;
  homunculus?: string[];
  lateralization?: {
    rightHandersLeftPercent: number;
    leftHandersLeftPercent: number;
    bilateralPercent: number;
    rightHemispherePercent: number;
  };
  note?: string;
};

const networkList = networks as Phase5Network[];

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
      {network.note ? <p className="muted">{network.note}</p> : null}
      <ul className="pill-list">
        {network.key_regions.map((region) => (
          <li key={region}>{region}</li>
        ))}
      </ul>
      <div className="grid" style={{ marginTop: "1rem" }}>
        {network.core_nodes?.length ? (
          <article className="card">
            <h3>Core Nodes</h3>
            <table className="meta-table">
              <thead>
                <tr>
                  <th>Node</th>
                  <th>HCP-MMP1</th>
                  <th>Julich</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {network.core_nodes.map((node) => (
                  <tr key={node.name}>
                    <td>{node.name}</td>
                    <td className="mono">{node.hcp_mmp1.join(", ")}</td>
                    <td>{node.julich.join(", ")}</td>
                    <td>{node.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ) : null}
        <article className="card">
          <h3>Connectivity</h3>
          <p>{network.connectivity}</p>
          <ul className="pill-list">
            {network.function_claims?.map((claim) => (
              <li key={claim}>{claim}</li>
            ))}
          </ul>
        </article>
        {network.streams?.length ? (
          <article className="card">
            <h3>Streams</h3>
            <ul className="list">
              {network.streams.map((stream) => (
                <li key={stream.name}>
                  <strong>{stream.name}</strong>
                  <p className="mono">{stream.function}</p>
                  <p>{stream.route.join(" -> ")}</p>
                </li>
              ))}
            </ul>
          </article>
        ) : null}
        {network.lateralization ? (
          <article className="card">
            <h3>Language Lateralization</h3>
            <p className="mono">{network.lateralization.rightHandersLeftPercent}% right-handers left hemisphere</p>
            <p className="mono">{network.lateralization.leftHandersLeftPercent}% left-handers left hemisphere</p>
            <p className="mono">{network.lateralization.bilateralPercent}% bilateral · {network.lateralization.rightHemispherePercent}% right-hemispheric</p>
          </article>
        ) : null}
        {network.homunculus?.length ? (
          <article className="card">
            <h3>Homunculus</h3>
            <ul className="pill-list">
              {network.homunculus.map((part) => (
                <li key={part}>{part}</li>
              ))}
            </ul>
          </article>
        ) : null}
        <article className="card">
          <h3>Disorders</h3>
          <ul className="list">
            {network.disorders?.map((disorder) => (
              <li key={disorder}>{disorder}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Citations</h3>
          <ul className="list">
            {network.citations.map((citation) => (
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
