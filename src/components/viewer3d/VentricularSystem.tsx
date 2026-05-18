"use client";

export function VentricularSystem({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <group userData={{ layer: "ventricular-system" }}>
      <mesh position={[-0.16, 0.02, 0.06]} scale={[0.12, 0.42, 0.16]}>
        <capsuleGeometry args={[0.8, 0.95, 8, 24]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.58} />
      </mesh>
      <mesh position={[0.16, 0.02, 0.06]} scale={[0.12, 0.42, 0.16]}>
        <capsuleGeometry args={[0.8, 0.95, 8, 24]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.58} />
      </mesh>
      <mesh position={[0, -0.25, -0.08]} scale={[0.12, 0.2, 0.12]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.64} />
      </mesh>
    </group>
  );
}
