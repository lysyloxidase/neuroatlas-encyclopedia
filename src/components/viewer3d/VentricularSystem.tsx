"use client";

import { useMemo } from "react";
import {
  CatmullRomCurve3,
  type BufferGeometry,
  TubeGeometry,
  Vector3,
} from "three";

function createLateralVentricleGeometry(
  side: "left" | "right",
): BufferGeometry {
  const s = side === "left" ? -1 : 1;
  // Anterior horn → body → atrium → inferior (temporal) horn — classic C-shape
  const points = [
    new Vector3(s * 0.1, 0.2, 0.5), // anterior horn tip (frontal lobe)
    new Vector3(s * 0.14, 0.24, 0.32),
    new Vector3(s * 0.16, 0.28, 0.05), // body (over thalamus)
    new Vector3(s * 0.18, 0.24, -0.22),
    new Vector3(s * 0.22, 0.14, -0.4), // atrium / trigone
    new Vector3(s * 0.28, -0.04, -0.34),
    new Vector3(s * 0.34, -0.22, -0.18),
    new Vector3(s * 0.36, -0.32, 0.08), // inferior horn into temporal lobe
    new Vector3(s * 0.34, -0.34, 0.28),
  ];
  const curve = new CatmullRomCurve3(points, false, "catmullrom", 0.35);
  return new TubeGeometry(curve, 80, 0.045, 14, false);
}

function createThirdVentricleGeometry(): BufferGeometry {
  // Thin midline slit between the thalami
  const points = [
    new Vector3(0, 0.06, 0.18),
    new Vector3(0, -0.02, 0.1),
    new Vector3(0, -0.08, -0.02),
    new Vector3(0, -0.12, -0.15),
  ];
  const curve = new CatmullRomCurve3(points, false, "catmullrom", 0.4);
  return new TubeGeometry(curve, 40, 0.022, 10, false);
}

function createFourthVentricleGeometry(): BufferGeometry {
  // Sits between brainstem and cerebellum
  const points = [
    new Vector3(0, -0.34, -0.18),
    new Vector3(0, -0.45, -0.22),
    new Vector3(0, -0.58, -0.2),
    new Vector3(0, -0.68, -0.12),
  ];
  const curve = new CatmullRomCurve3(points, false, "catmullrom", 0.3);
  return new TubeGeometry(curve, 36, 0.04, 12, false);
}

export function VentricularSystem({ visible = true }: { visible?: boolean }) {
  const left = useMemo(() => createLateralVentricleGeometry("left"), []);
  const right = useMemo(() => createLateralVentricleGeometry("right"), []);
  const third = useMemo(() => createThirdVentricleGeometry(), []);
  const fourth = useMemo(() => createFourthVentricleGeometry(), []);

  if (!visible) return null;

  return (
    <group userData={{ layer: "ventricular-system" }}>
      <mesh geometry={left}>
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#0e7490"
          emissiveIntensity={0.35}
          transparent
          opacity={0.62}
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>
      <mesh geometry={right}>
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#0e7490"
          emissiveIntensity={0.35}
          transparent
          opacity={0.62}
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>
      <mesh geometry={third}>
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#155e75"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh geometry={fourth}>
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#155e75"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}
