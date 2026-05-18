"use client";

export function CrossSection({ visible = false }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <mesh rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[2.4, 2.1]} />
      <meshBasicMaterial color="#e2e8f0" transparent opacity={0.12} />
    </mesh>
  );
}
