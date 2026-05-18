"use client";

export function BasalGangliaLayer({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <group userData={{ layer: "basal-ganglia" }}>
      <mesh position={[-0.26, -0.12, 0.24]} scale={[0.24, 0.18, 0.4]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color="#c084fc" roughness={0.42} />
      </mesh>
      <mesh position={[0.26, -0.12, 0.24]} scale={[0.24, 0.18, 0.4]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color="#c084fc" roughness={0.42} />
      </mesh>
      <mesh position={[-0.18, -0.22, -0.08]} scale={[0.14, 0.1, 0.25]}>
        <sphereGeometry args={[1, 24, 12]} />
        <meshStandardMaterial color="#a78bfa" roughness={0.52} />
      </mesh>
      <mesh position={[0.18, -0.22, -0.08]} scale={[0.14, 0.1, 0.25]}>
        <sphereGeometry args={[1, 24, 12]} />
        <meshStandardMaterial color="#a78bfa" roughness={0.52} />
      </mesh>
    </group>
  );
}
