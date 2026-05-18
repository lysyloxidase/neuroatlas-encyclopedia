"use client";

export function GradientColoring({ enabled = false }: { enabled?: boolean }) {
  if (!enabled) return null;

  return (
    <mesh position={[-0.35, -0.36, 0.9]} scale={[0.42, 0.14, 0.05]}>
      <sphereGeometry args={[1, 24, 12]} />
      <meshBasicMaterial color="#22c55e" transparent opacity={0.74} />
    </mesh>
  );
}
