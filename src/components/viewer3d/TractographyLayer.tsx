"use client";

export function TractographyLayer({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <group>
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, 1.2]} scale={[1.2, 0.04, 0.04]}>
        <capsuleGeometry args={[1, 1.2, 8, 24]} />
        <meshStandardMaterial color="#fb923c" emissive="#7c2d12" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}
