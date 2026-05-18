"use client";

export function CytoZoom({ visible = false }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <group position={[1.35, 0.88, 0]}>
      <mesh>
        <boxGeometry args={[0.54, 0.36, 0.04]} />
        <meshBasicMaterial color="#f8fafc" transparent opacity={0.18} />
      </mesh>
      <mesh position={[0, 0.07, 0.04]} scale={[0.42, 0.03, 0.03]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
      <mesh position={[0, -0.04, 0.04]} scale={[0.42, 0.03, 0.03]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#8b5cf6" />
      </mesh>
    </group>
  );
}
