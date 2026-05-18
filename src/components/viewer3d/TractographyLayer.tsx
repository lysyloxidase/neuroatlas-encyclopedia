"use client";

import tracts from "@/data/tracts.json";

interface TractSegEntry {
  slug: string;
  group: string;
  render_top20: boolean;
}

const topTracts = (tracts as TractSegEntry[]).filter((tract) => tract.render_top20);
const groupColors: Record<string, string> = {
  association: "#06b6d4",
  commissural: "#8b5cf6",
  projection: "#fb923c",
  cerebellar: "#10b981",
};

export function TractographyLayer({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <group data-testid="tractography-layer">
      {topTracts.map((tract, index) => {
        const row = Math.floor(index / 5);
        const column = index % 5;
        return (
          <mesh
            key={tract.slug}
            position={[(column - 2) * 0.22, -0.38 + row * 0.12, 0.56 - row * 0.08]}
            rotation={[0.1 * row, 0.3, 0.72 + column * 0.18]}
            scale={[0.6 + row * 0.08, 0.025, 0.025]}
          >
            <capsuleGeometry args={[1, 1.2, 8, 24]} />
            <meshStandardMaterial color={groupColors[tract.group] ?? "#fb923c"} emissive="#7c2d12" emissiveIntensity={0.18} />
          </mesh>
        );
      })}
    </group>
  );
}
