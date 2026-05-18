import Link from "next/link";
import { LanguageDualStream } from "@/components/networks/LanguageDualStream";
import { MotorSomatosensoryHomunculus } from "@/components/networks/MotorSomatosensoryHomunculus";
import { TheoryMirrorSystems } from "@/components/networks/TheoryMirrorSystems";
import { TripleNetworkSwitch } from "@/components/networks/TripleNetworkSwitch";
import { VisualStreamExplorer } from "@/components/networks/VisualStreamExplorer";
import { YeoNetworkOverlays } from "@/components/networks/YeoNetworkOverlays";
import networks from "@/data/networks.json";
import { TierBadge } from "@/components/content/TierBadge";
import type { Network } from "@/lib/types";

const networkList = networks as Network[];

export default function NetworksPage() {
  return (
    <section className="container section">
      <p className="eyebrow">Level 4</p>
      <h1>Functional Networks</h1>
      <p className="lead">Yeo intrinsic networks, the triple-network model, and task-defined language, vision, motor, social, and mirror systems.</p>
      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        <YeoNetworkOverlays />
        <TripleNetworkSwitch />
        <LanguageDualStream />
        <VisualStreamExplorer />
        <MotorSomatosensoryHomunculus />
        <TheoryMirrorSystems />
      </div>
      <div className="grid" style={{ marginTop: "1rem" }}>
        {networkList.map((network) => (
          <Link className="card" href={`/networks/${network.slug}`} key={network.slug}>
            <h3>{network.name}</h3>
            <TierBadge tier={network.tier} />
            <p className="muted">{network.system}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
