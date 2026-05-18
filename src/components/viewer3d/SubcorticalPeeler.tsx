"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh, MeshStandardMaterial } from "three";

type Pos = [number, number, number];
type Rot = [number, number, number];
type Scale = [number, number, number];

interface Structure {
  name: string;
  color: string;
  position: Pos;
  rotation?: Rot;
  scale?: Scale;
  shape:
    | { kind: "sphere" }
    | {
        kind: "torus";
        radius: number;
        tube: number;
        radialSeg: number;
        tubularSeg: number;
        arc: number;
      }
    | {
        kind: "cylinder";
        radiusTop: number;
        radiusBottom: number;
        height: number;
        segments: number;
      };
}

const structures: Structure[] = [
  // Thalamus - bilateral egg-shaped nuclei, central, separated by 3rd ventricle
  {
    name: "thalamus-left",
    color: "#a78bfa",
    position: [-0.13, -0.04, 0.05],
    rotation: [0, 0.12, 0],
    scale: [0.2, 0.18, 0.3],
    shape: { kind: "sphere" },
  },
  {
    name: "thalamus-right",
    color: "#a78bfa",
    position: [0.13, -0.04, 0.05],
    rotation: [0, -0.12, 0],
    scale: [0.2, 0.18, 0.3],
    shape: { kind: "sphere" },
  },
  // Hippocampus - C-shaped curl in the temporal lobe, bilateral
  {
    name: "hippocampus-left",
    color: "#22d3ee",
    position: [-0.34, -0.36, 0.0],
    rotation: [Math.PI / 2, 0, Math.PI / 2.4],
    scale: [1, 1, 0.55],
    shape: {
      kind: "torus",
      radius: 0.18,
      tube: 0.05,
      radialSeg: 14,
      tubularSeg: 40,
      arc: Math.PI * 1.15,
    },
  },
  {
    name: "hippocampus-right",
    color: "#22d3ee",
    position: [0.34, -0.36, 0.0],
    rotation: [Math.PI / 2, 0, -Math.PI / 2.4 + Math.PI],
    scale: [1, 1, 0.55],
    shape: {
      kind: "torus",
      radius: 0.18,
      tube: 0.05,
      radialSeg: 14,
      tubularSeg: 40,
      arc: Math.PI * 1.15,
    },
  },
  // Amygdala - small almond-shaped, anterior to hippocampus
  {
    name: "amygdala-left",
    color: "#f43f5e",
    position: [-0.3, -0.3, 0.32],
    rotation: [0.2, 0, 0.3],
    scale: [0.09, 0.08, 0.1],
    shape: { kind: "sphere" },
  },
  {
    name: "amygdala-right",
    color: "#f43f5e",
    position: [0.3, -0.3, 0.32],
    rotation: [0.2, 0, -0.3],
    scale: [0.09, 0.08, 0.1],
    shape: { kind: "sphere" },
  },
  // Brainstem - midbrain → pons → medulla, tapered, descending
  {
    name: "brainstem-midbrain",
    color: "#c4b5fd",
    position: [0, -0.4, 0.04],
    scale: [1, 1, 1],
    shape: {
      kind: "cylinder",
      radiusTop: 0.14,
      radiusBottom: 0.16,
      height: 0.18,
      segments: 28,
    },
  },
  {
    name: "brainstem-pons",
    color: "#a78bfa",
    position: [0, -0.55, 0.06],
    scale: [1.05, 1, 1.15],
    shape: {
      kind: "cylinder",
      radiusTop: 0.16,
      radiusBottom: 0.13,
      height: 0.16,
      segments: 28,
    },
  },
  {
    name: "brainstem-medulla",
    color: "#8b5cf6",
    position: [0, -0.72, 0.02],
    scale: [1, 1, 1],
    shape: {
      kind: "cylinder",
      radiusTop: 0.12,
      radiusBottom: 0.07,
      height: 0.2,
      segments: 24,
    },
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
    const target = peeled || hovered ? 0.92 : 0.42;
    for (const mesh of refs.current) {
      const material = mesh?.material as MeshStandardMaterial | undefined;
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
      userData={{ labels: structures.map((s) => s.name) }}
    >
      {structures.map((structure, index) => (
        <mesh
          key={structure.name}
          ref={(mesh) => {
            refs.current[index] = mesh;
          }}
          position={structure.position}
          rotation={structure.rotation ?? [0, 0, 0]}
          scale={structure.scale ?? [1, 1, 1]}
          userData={{ label: structure.name }}
        >
          {structure.shape.kind === "sphere" ? (
            <sphereGeometry args={[1, 40, 28]} />
          ) : structure.shape.kind === "torus" ? (
            <torusGeometry
              args={[
                structure.shape.radius,
                structure.shape.tube,
                structure.shape.radialSeg,
                structure.shape.tubularSeg,
                structure.shape.arc,
              ]}
            />
          ) : (
            <cylinderGeometry
              args={[
                structure.shape.radiusTop,
                structure.shape.radiusBottom,
                structure.shape.height,
                structure.shape.segments,
              ]}
            />
          )}
          <meshStandardMaterial
            color={structure.color}
            metalness={0.12}
            roughness={0.5}
            transparent
            opacity={peeled ? 0.92 : 0.42}
          />
        </mesh>
      ))}
    </group>
  );
}
