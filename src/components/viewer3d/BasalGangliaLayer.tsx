"use client";

type Pos = [number, number, number];
type Rot = [number, number, number];
type Scale = [number, number, number];

interface Nucleus {
  name: string;
  color: string;
  position: Pos;
  rotation?: Rot;
  scale: Scale;
}

// Stylised positions for the major basal-ganglia nuclei.
// The caudate has a long C-shaped tail; the putamen + globus pallidus
// form the lentiform nucleus laterally.
const nuclei: Nucleus[] = [
  // Caudate head (anterior bulge of the C)
  {
    name: "caudate-head-left",
    color: "#f0abfc",
    position: [-0.18, 0.05, 0.3],
    scale: [0.12, 0.14, 0.18],
  },
  {
    name: "caudate-head-right",
    color: "#f0abfc",
    position: [0.18, 0.05, 0.3],
    scale: [0.12, 0.14, 0.18],
  },
  // Caudate body (along lateral ventricle, getting thinner)
  {
    name: "caudate-body-left",
    color: "#e879f9",
    position: [-0.2, 0.16, 0.0],
    rotation: [0, 0, -0.2],
    scale: [0.05, 0.05, 0.32],
  },
  {
    name: "caudate-body-right",
    color: "#e879f9",
    position: [0.2, 0.16, 0.0],
    rotation: [0, 0, 0.2],
    scale: [0.05, 0.05, 0.32],
  },
  // Caudate tail (curling down into temporal lobe)
  {
    name: "caudate-tail-left",
    color: "#d946ef",
    position: [-0.25, -0.1, -0.32],
    scale: [0.04, 0.18, 0.08],
  },
  {
    name: "caudate-tail-right",
    color: "#d946ef",
    position: [0.25, -0.1, -0.32],
    scale: [0.04, 0.18, 0.08],
  },
  // Putamen - lateral, larger (lens-shaped)
  {
    name: "putamen-left",
    color: "#c084fc",
    position: [-0.3, -0.05, 0.06],
    scale: [0.08, 0.18, 0.22],
  },
  {
    name: "putamen-right",
    color: "#c084fc",
    position: [0.3, -0.05, 0.06],
    scale: [0.08, 0.18, 0.22],
  },
  // Globus pallidus - medial to putamen, slightly smaller
  {
    name: "globus-pallidus-left",
    color: "#a78bfa",
    position: [-0.22, -0.08, 0.06],
    scale: [0.05, 0.13, 0.16],
  },
  {
    name: "globus-pallidus-right",
    color: "#a78bfa",
    position: [0.22, -0.08, 0.06],
    scale: [0.05, 0.13, 0.16],
  },
  // Substantia nigra & subthalamic nucleus (small midbrain markers)
  {
    name: "substantia-nigra-left",
    color: "#7c3aed",
    position: [-0.1, -0.26, -0.04],
    scale: [0.07, 0.04, 0.1],
  },
  {
    name: "substantia-nigra-right",
    color: "#7c3aed",
    position: [0.1, -0.26, -0.04],
    scale: [0.07, 0.04, 0.1],
  },
];

export function BasalGangliaLayer({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <group userData={{ layer: "basal-ganglia" }}>
      {nuclei.map((nucleus) => (
        <mesh
          key={nucleus.name}
          position={nucleus.position}
          rotation={nucleus.rotation ?? [0, 0, 0]}
          scale={nucleus.scale}
          userData={{ label: nucleus.name }}
        >
          <sphereGeometry args={[1, 32, 20]} />
          <meshStandardMaterial
            color={nucleus.color}
            metalness={0.15}
            roughness={0.45}
            transparent
            opacity={0.78}
          />
        </mesh>
      ))}
    </group>
  );
}
