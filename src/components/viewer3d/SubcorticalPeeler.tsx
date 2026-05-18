"use client";

export function SubcorticalPeeler({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <group>
      <mesh position={[0, -0.18, 0.08]} scale={[0.55, 0.3, 0.42]}>
        <sphereGeometry args={[1, 32, 18]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.5} transparent opacity={0.82} />
      </mesh>
      <mesh position={[0, -0.58, 0.2]} scale={[0.2, 0.55, 0.2]}>
        <cylinderGeometry args={[0.55, 0.28, 1.7, 24]} />
        <meshStandardMaterial color="#a78bfa" roughness={0.6} transparent opacity={0.72} />
      </mesh>
    </group>
  );
}
