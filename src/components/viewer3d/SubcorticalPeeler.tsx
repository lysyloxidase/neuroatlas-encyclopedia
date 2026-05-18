"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";

const structures = [
  {
    name: "thalamus",
    color: "#8b5cf6",
    position: [0, -0.12, 0.12] as [number, number, number],
    scale: [0.5, 0.24, 0.36] as [number, number, number],
  },
  {
    name: "hippocampus",
    color: "#22d3ee",
    position: [-0.34, -0.46, 0.2] as [number, number, number],
    scale: [0.34, 0.12, 0.16] as [number, number, number],
  },
  {
    name: "amygdala",
    color: "#f43f5e",
    position: [0.34, -0.4, 0.18] as [number, number, number],
    scale: [0.16, 0.13, 0.13] as [number, number, number],
  },
  {
    name: "brainstem",
    color: "#a78bfa",
    position: [0, -0.64, 0.08] as [number, number, number],
    scale: [0.18, 0.5, 0.18] as [number, number, number],
  },
];

export function SubcorticalPeeler({
  peeled = false,
  visible = true,
}: {
  peeled?: boolean;
  visible?: boolean;
}) {
  const refs = useRef<(Mesh | null)[]>([]);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    const target = peeled || hovered ? 0.9 : 0.42;
    for (const mesh of refs.current) {
      const material = mesh?.material;
      if (material && "opacity" in material) {
        material.opacity +=
          (target - material.opacity) * Math.min(1, delta * 8);
      }
    }
  });

  if (!visible) return null;

  return (
    <group
      data-testid="subcortical-peeler"
      onPointerOut={() => setHovered(false)}
      onPointerOver={() => setHovered(true)}
      userData={{ labels: structures.map((structure) => structure.name) }}
    >
      {structures.map((structure, index) => (
        <mesh
          key={structure.name}
          ref={(mesh) => {
            refs.current[index] = mesh;
          }}
          position={structure.position}
          scale={structure.scale}
          userData={{ label: structure.name }}
        >
          {structure.name === "brainstem" ? (
            <cylinderGeometry args={[0.55, 0.28, 1.7, 24]} />
          ) : (
            <sphereGeometry args={[1, 32, 18]} />
          )}
          <meshStandardMaterial
            color={structure.color}
            roughness={0.55}
            transparent
            opacity={peeled ? 0.9 : 0.42}
          />
        </mesh>
      ))}
    </group>
  );
}
