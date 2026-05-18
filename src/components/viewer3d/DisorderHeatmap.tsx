"use client";

export function DisorderHeatmap({ enabled = false }: { enabled?: boolean }) {
  if (!enabled) return null;

  return (
    <mesh position={[0.35, 0.2, 0.88]} scale={[0.34, 0.2, 0.04]}>
      <sphereGeometry args={[1, 24, 12]} />
      <meshBasicMaterial color="#ef4444" transparent opacity={0.76} />
    </mesh>
  );
}
