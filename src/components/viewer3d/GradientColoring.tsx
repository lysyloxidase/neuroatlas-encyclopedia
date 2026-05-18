"use client";

import gradient from "@/data/gradient/margulies2016_g1.json";

interface GradientPoint {
  structure_id: string;
  g1: number;
  color: string;
}

const samples = (gradient as GradientPoint[]).filter(
  (_, index) => index % 4 === 0,
);

export function GradientColoring({ enabled = false }: { enabled?: boolean }) {
  if (!enabled) return null;

  return (
    <group>
      {samples.map((point, index) => {
        const theta = (index / samples.length) * Math.PI * 2;
        const band = ((index % 18) - 8.5) / 8.5;
        const radius = 0.84 + point.g1 * 0.08;
        return (
          <mesh
            key={point.structure_id}
            position={[
              Math.cos(theta) * radius,
              band * 0.36,
              Math.sin(theta) * 0.18 + 0.72,
            ]}
            scale={[0.035, 0.035, 0.035]}
          >
            <sphereGeometry args={[1, 12, 8]} />
            <meshBasicMaterial color={point.color} transparent opacity={0.78} />
          </mesh>
        );
      })}
    </group>
  );
}
