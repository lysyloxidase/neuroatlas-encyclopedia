"use client";

const lobes = [
  { name: "frontal", color: "#38bdf8", position: [0, 0.36, 0.76] },
  { name: "parietal", color: "#22c55e", position: [0, 0.68, 0.02] },
  { name: "temporal", color: "#f97316", position: [0, -0.35, 0.44] },
  { name: "occipital", color: "#a855f7", position: [0, 0.22, -0.8] },
  { name: "insular", color: "#14b8a6", position: [0, -0.08, 0.04] },
  { name: "limbic", color: "#eab308", position: [0, 0.06, -0.12] },
] as const;

export function LobeOverlay({ visible = false }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <group userData={{ layer: "lobes" }}>
      {lobes.map((lobe) => (
        <mesh
          key={lobe.name}
          position={lobe.position}
          scale={[0.75, 0.25, 0.42]}
        >
          <sphereGeometry args={[1, 24, 12]} />
          <meshBasicMaterial color={lobe.color} transparent opacity={0.34} />
        </mesh>
      ))}
    </group>
  );
}
