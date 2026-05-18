"use client";

import effects from "@/data/disorders/enigma_effects.json";

export function DisorderHeatmap({
  disorderSlug,
  enabled = false,
}: {
  disorderSlug?: string;
  enabled?: boolean;
}) {
  if (!enabled) return null;
  const rows = disorderSlug
    ? effects.filter((effect) => effect.disorder === disorderSlug)
    : effects;

  return (
    <group data-testid="disorder-heatmap">
      {rows.slice(0, 12).map((effect, index) => {
        const angle = (index / 12) * Math.PI * 2;
        const color = effect.cohens_d < 0 ? "#3b82f6" : "#ef4444";
        return (
          <mesh
            key={`${effect.disorder}-${effect.region_id}`}
            position={[Math.cos(angle) * 0.58, Math.sin(angle) * 0.26, 0.88]}
            scale={[0.12 + Math.abs(effect.cohens_d) * 0.08, 0.08, 0.04]}
          >
            <sphereGeometry args={[1, 24, 12]} />
            <meshBasicMaterial color={color} transparent opacity={0.76} />
          </mesh>
        );
      })}
    </group>
  );
}
