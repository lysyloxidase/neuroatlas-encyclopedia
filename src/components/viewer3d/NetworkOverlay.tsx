"use client";

export function NetworkOverlay({ color = "#e11d48" }: { color?: string }) {
  return (
    <group>
      {[
        [-0.65, 0.42, 0.62],
        [0.62, 0.36, 0.64],
        [0.0, -0.08, 0.86],
      ].map(([x, y, z]) => (
        <mesh key={`${x}-${y}-${z}`} position={[x, y, z]}>
          <sphereGeometry args={[0.08, 18, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}
