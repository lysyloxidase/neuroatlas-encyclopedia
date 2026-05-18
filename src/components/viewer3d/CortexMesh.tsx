"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  type BufferAttribute,
  type BufferGeometry,
  type Group,
  SphereGeometry,
  Vector3,
} from "three";

function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return prefersReduced;
}

function hash3(x: number, y: number, z: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function valueNoise3D(x: number, y: number, z: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const ux = smoothstep(x - ix);
  const uy = smoothstep(y - iy);
  const uz = smoothstep(z - iz);
  const c000 = hash3(ix, iy, iz);
  const c100 = hash3(ix + 1, iy, iz);
  const c010 = hash3(ix, iy + 1, iz);
  const c110 = hash3(ix + 1, iy + 1, iz);
  const c001 = hash3(ix, iy, iz + 1);
  const c101 = hash3(ix + 1, iy, iz + 1);
  const c011 = hash3(ix, iy + 1, iz + 1);
  const c111 = hash3(ix + 1, iy + 1, iz + 1);
  const x00 = c000 * (1 - ux) + c100 * ux;
  const x10 = c010 * (1 - ux) + c110 * ux;
  const x01 = c001 * (1 - ux) + c101 * ux;
  const x11 = c011 * (1 - ux) + c111 * ux;
  const y0 = x00 * (1 - uy) + x10 * uy;
  const y1 = x01 * (1 - uy) + x11 * uy;
  return y0 * (1 - uz) + y1 * uz;
}

function fbm(x: number, y: number, z: number, octaves: number): number {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    value +=
      amp * (valueNoise3D(x * freq, y * freq, z * freq) * 2 - 1);
    amp *= 0.5;
    freq *= 2;
  }
  return value;
}

function createHemisphereGeometry(side: "left" | "right"): BufferGeometry {
  const geom = new SphereGeometry(1, 192, 128);
  const position = geom.attributes.position as BufferAttribute;
  const dir = new Vector3();
  const sign = side === "left" ? -1 : 1;
  const seed = side === "left" ? 0 : 31.7;
  const fissureGap = 0.028;

  for (let i = 0; i < position.count; i++) {
    let x = position.getX(i);
    let y = position.getY(i);
    let z = position.getZ(i);

    // Bean-shaped hemisphere: longer A-P (z), shorter M-L (x), intermediate S-I (y)
    x *= 0.62;
    y *= 0.82;
    z *= 1.1;

    // Slight temporal lobe drop on the inferior-lateral side
    const temporal =
      Math.max(0, -y - 0.1) * Math.max(0, 0.4 - Math.abs(z)) * 0.18;
    y -= temporal;
    z += temporal * 0.35;

    // Frontal and occipital poles slightly more prominent
    if (z > 0.55) z += (z - 0.55) * 0.12;
    if (z < -0.55) z += (z + 0.55) * 0.14;

    // Sample noise from a stable normalized direction
    dir.set(x, y, z).normalize();

    // Multi-octave noise gives the gyral/sulcal surface pattern
    const coarse = fbm(
      dir.x * 4.2 + seed,
      dir.y * 4.2,
      dir.z * 4.2,
      3,
    );
    const mid = fbm(
      dir.x * 9.3,
      dir.y * 9.3 + seed,
      dir.z * 9.3,
      3,
    );
    const fine = fbm(
      dir.x * 18.5,
      dir.y * 18.5,
      dir.z * 18.5 + seed,
      2,
    );

    // Ridge term emphasises deeper sulci
    const ridge = 1 - Math.abs(
      fbm(dir.x * 6.2 + seed, dir.y * 6.2, dir.z * 6.2, 2),
    );

    const disp =
      coarse * 0.078 + mid * 0.034 + fine * 0.016 + (ridge - 0.5) * 0.024;

    x += dir.x * disp;
    y += dir.y * disp;
    z += dir.z * disp;

    // Medial flattening - vertices past the midline collapse onto the fissure wall
    if (sign === -1) {
      if (x > -fissureGap) x = -fissureGap;
    } else {
      if (x < fissureGap) x = fissureGap;
    }

    position.setXYZ(i, x, y, z);
  }

  position.needsUpdate = true;
  geom.computeVertexNormals();
  return geom;
}

function createCerebellumGeometry(): BufferGeometry {
  const geom = new SphereGeometry(1, 144, 96);
  const position = geom.attributes.position as BufferAttribute;
  const dir = new Vector3();

  for (let i = 0; i < position.count; i++) {
    let x = position.getX(i);
    let y = position.getY(i);
    let z = position.getZ(i);

    // Cerebellum is wider than tall, flattened anteriorly
    x *= 0.96;
    y *= 0.52;
    z *= 0.78;

    dir.set(x, y, z).normalize();

    // Folia: tight parallel ridges running medio-laterally
    const folia = Math.sin(y * 28 + z * 4) * 0.022;
    // Vermis groove down the midline
    const vermis = Math.exp(-(x * x) * 95) * 0.03;
    // Add a touch of noise so it isn't perfectly regular
    const jitter = fbm(x * 6, y * 6, z * 6, 2) * 0.008;

    const disp = folia - vermis + jitter;
    x += dir.x * disp;
    y += dir.y * folia * 0.35;
    z += dir.z * disp;

    position.setXYZ(i, x, y, z);
  }

  position.needsUpdate = true;
  geom.computeVertexNormals();
  return geom;
}

export function CortexMesh({
  highlight = "#06b6d4",
  opacity = 0.68,
  reducedMotion = false,
  visible = true,
}: {
  highlight?: string;
  opacity?: number;
  reducedMotion?: boolean;
  visible?: boolean;
}) {
  const ref = useRef<Group>(null);
  const systemPrefersReduced = usePrefersReducedMotion();
  const motionOff = reducedMotion || systemPrefersReduced;

  const leftHemiGeom = useMemo(() => createHemisphereGeometry("left"), []);
  const rightHemiGeom = useMemo(() => createHemisphereGeometry("right"), []);
  const cerebellumGeom = useMemo(() => createCerebellumGeometry(), []);

  useEffect(() => {
    return () => {
      leftHemiGeom.dispose();
      rightHemiGeom.dispose();
      cerebellumGeom.dispose();
    };
  }, [leftHemiGeom, rightHemiGeom, cerebellumGeom]);

  useFrame((_, delta) => {
    if (ref.current && !motionOff) {
      ref.current.rotation.y += delta * 0.18;
    }
  });

  if (!visible) return null;

  return (
    <group ref={ref} scale={[1.5, 1.35, 1.55]} data-testid="cortex-mesh">
      <mesh geometry={leftHemiGeom} position={[0, 0.04, 0]}>
        <meshStandardMaterial
          color={highlight}
          metalness={0.08}
          roughness={0.55}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh geometry={rightHemiGeom} position={[0, 0.04, 0]}>
        <meshStandardMaterial
          color={highlight}
          metalness={0.08}
          roughness={0.55}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh geometry={cerebellumGeom} position={[0, -0.55, -0.78]}>
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.05}
          roughness={0.72}
          transparent
          opacity={Math.min(0.95, opacity + 0.18)}
        />
      </mesh>
    </group>
  );
}
