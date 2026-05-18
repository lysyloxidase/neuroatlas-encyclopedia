"use client";

type Axis = "sagittal" | "coronal" | "axial";

const axisRotation: Record<Axis, [number, number, number]> = {
  sagittal: [0, Math.PI / 2, 0],
  coronal: [0, 0, 0],
  axial: [Math.PI / 2, 0, 0],
};

const axisColor: Record<Axis, string> = {
  sagittal: "#38bdf8",
  coronal: "#a78bfa",
  axial: "#f59e0b",
};

export function CrossSection({
  axis = "sagittal",
  visible = false,
}: {
  axis?: Axis;
  visible?: boolean;
}) {
  if (!visible) return null;

  return (
    <mesh
      data-testid={`cross-section-${axis}`}
      rotation={axisRotation[axis]}
      userData={{ axis }}
    >
      <planeGeometry args={[2.4, 2.1]} />
      <meshBasicMaterial color={axisColor[axis]} transparent opacity={0.18} />
    </mesh>
  );
}
