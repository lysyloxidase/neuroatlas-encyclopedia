"use client";

type Pos = [number, number, number];
type Rot = [number, number, number];
type Scale = [number, number, number];

interface Lobe {
  name: string;
  color: string;
  position: Pos;
  rotation?: Rot;
  scale: Scale;
}

// Lobes approximated as flattened ellipsoids positioned over each hemisphere.
// Cover both sides via mirrored entries so the overlay reads correctly when
// the cortex rotates.
const lobes: Lobe[] = [
  // Frontal - large, anterior-superior
  {
    name: "frontal-left",
    color: "#38bdf8",
    position: [-0.35, 0.28, 0.55],
    scale: [0.4, 0.42, 0.45],
  },
  {
    name: "frontal-right",
    color: "#38bdf8",
    position: [0.35, 0.28, 0.55],
    scale: [0.4, 0.42, 0.45],
  },
  // Parietal - superior-posterior
  {
    name: "parietal-left",
    color: "#22c55e",
    position: [-0.35, 0.5, -0.05],
    scale: [0.4, 0.32, 0.38],
  },
  {
    name: "parietal-right",
    color: "#22c55e",
    position: [0.35, 0.5, -0.05],
    scale: [0.4, 0.32, 0.38],
  },
  // Temporal - inferior-lateral
  {
    name: "temporal-left",
    color: "#f97316",
    position: [-0.5, -0.18, 0.18],
    scale: [0.22, 0.3, 0.4],
  },
  {
    name: "temporal-right",
    color: "#f97316",
    position: [0.5, -0.18, 0.18],
    scale: [0.22, 0.3, 0.4],
  },
  // Occipital - posterior pole
  {
    name: "occipital-left",
    color: "#a855f7",
    position: [-0.28, 0.15, -0.55],
    scale: [0.3, 0.32, 0.28],
  },
  {
    name: "occipital-right",
    color: "#a855f7",
    position: [0.28, 0.15, -0.55],
    scale: [0.3, 0.32, 0.28],
  },
  // Insular - deep, between frontal and temporal
  {
    name: "insular-left",
    color: "#14b8a6",
    position: [-0.32, -0.02, 0.18],
    scale: [0.08, 0.14, 0.18],
  },
  {
    name: "insular-right",
    color: "#14b8a6",
    position: [0.32, -0.02, 0.18],
    scale: [0.08, 0.14, 0.18],
  },
  // Limbic ring (cingulate) - medial
  {
    name: "limbic-left",
    color: "#eab308",
    position: [-0.08, 0.2, 0.0],
    rotation: [0, 0, 0.05],
    scale: [0.05, 0.34, 0.45],
  },
  {
    name: "limbic-right",
    color: "#eab308",
    position: [0.08, 0.2, 0.0],
    rotation: [0, 0, -0.05],
    scale: [0.05, 0.34, 0.45],
  },
];

export function LobeOverlay({ visible = false }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <group userData={{ layer: "lobes" }}>
      {lobes.map((lobe) => (
        <mesh
          key={lobe.name}
          position={lobe.position}
          rotation={lobe.rotation ?? [0, 0, 0]}
          scale={lobe.scale}
          userData={{ label: lobe.name }}
        >
          <sphereGeometry args={[1, 36, 24]} />
          <meshBasicMaterial color={lobe.color} transparent opacity={0.32} />
        </mesh>
      ))}
    </group>
  );
}
