"use client";

import networks from "@/data/networks.json";

interface NetworkNode {
  name: string;
  xyz: [number, number, number];
}

interface NetworkEntry {
  slug: string;
  color: string;
  core_nodes: NetworkNode[];
}

const rows = networks as unknown as NetworkEntry[];

export function NetworkOverlay({
  networkSlug = "yeo-default-mode",
}: {
  networkSlug?: string;
}) {
  const network = rows.find((item) => item.slug === networkSlug) ?? rows[0];
  const nodes = network.core_nodes?.length
    ? network.core_nodes
    : [
        {
          name: "left association",
          xyz: [-0.65, 0.42, 0.62] as [number, number, number],
        },
        {
          name: "right association",
          xyz: [0.62, 0.36, 0.64] as [number, number, number],
        },
        { name: "midline", xyz: [0, -0.08, 0.86] as [number, number, number] },
      ];

  return (
    <group data-testid="network-overlay-3d">
      {nodes.map((node) => (
        <mesh key={node.name} position={node.xyz}>
          <sphereGeometry args={[0.08, 18, 12]} />
          <meshBasicMaterial color={network.color} />
        </mesh>
      ))}
    </group>
  );
}
