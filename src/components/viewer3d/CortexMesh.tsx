"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

export function CortexMesh({ highlight = "#06b6d4" }: { highlight?: string }) {
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <group ref={ref} scale={[1.55, 1.08, 1.2]} data-testid="cortex-mesh">
      <mesh position={[-0.58, 0, 0]}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshStandardMaterial color={highlight} metalness={0.2} roughness={0.42} transparent opacity={0.68} />
      </mesh>
      <mesh position={[0.58, 0, 0]}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshStandardMaterial color={highlight} metalness={0.2} roughness={0.42} transparent opacity={0.68} />
      </mesh>
      <mesh scale={[0.12, 0.58, 0.7]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}
