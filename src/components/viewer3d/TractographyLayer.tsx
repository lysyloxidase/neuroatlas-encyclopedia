"use client";

import { useMemo } from "react";
import {
  CatmullRomCurve3,
  type BufferGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import tracts from "@/data/tracts.json";

interface TractSegEntry {
  slug: string;
  group: string;
  render_top20: boolean;
}

const topTracts = (tracts as TractSegEntry[]).filter(
  (tract) => tract.render_top20,
);
const groupColors: Record<string, string> = {
  association: "#06b6d4",
  commissural: "#a855f7",
  projection: "#fb923c",
  cerebellar: "#10b981",
};

// Templates for the major fiber-bundle paths (very stylised).
// Each function returns a curve in normalised brain space.
function makeArcuate(side: number): Vector3[] {
  // Long fronto-temporal arc (perisylvian)
  return [
    new Vector3(side * 0.62, 0.05, 0.5),
    new Vector3(side * 0.7, 0.3, 0.3),
    new Vector3(side * 0.72, 0.45, 0),
    new Vector3(side * 0.7, 0.35, -0.3),
    new Vector3(side * 0.62, 0.05, -0.45),
    new Vector3(side * 0.5, -0.25, -0.25),
    new Vector3(side * 0.55, -0.35, 0.2),
  ];
}
function makeCorpusCallosum(): Vector3[] {
  // Bridge over the lateral ventricles
  return [
    new Vector3(-0.55, 0.18, 0.05),
    new Vector3(-0.3, 0.36, 0.05),
    new Vector3(0, 0.45, 0.05),
    new Vector3(0.3, 0.36, 0.05),
    new Vector3(0.55, 0.18, 0.05),
  ];
}
function makeCorticospinal(side: number): Vector3[] {
  // Projection from motor cortex down through internal capsule to brainstem
  return [
    new Vector3(side * 0.55, 0.55, 0.18),
    new Vector3(side * 0.4, 0.35, 0.14),
    new Vector3(side * 0.25, 0.05, 0.1),
    new Vector3(side * 0.16, -0.18, 0.05),
    new Vector3(side * 0.08, -0.4, 0),
    new Vector3(0, -0.7, -0.05),
  ];
}
function makeUncinate(side: number): Vector3[] {
  // Frontal ↔ temporal hook
  return [
    new Vector3(side * 0.48, 0.18, 0.55),
    new Vector3(side * 0.5, -0.06, 0.5),
    new Vector3(side * 0.42, -0.28, 0.4),
    new Vector3(side * 0.3, -0.32, 0.3),
  ];
}
function makeCerebellarPeduncle(side: number): Vector3[] {
  return [
    new Vector3(side * 0.12, -0.4, -0.18),
    new Vector3(side * 0.25, -0.5, -0.45),
    new Vector3(side * 0.35, -0.55, -0.7),
  ];
}
function makeCingulum(side: number): Vector3[] {
  // Cingulate bundle following the corpus callosum
  return [
    new Vector3(side * 0.06, 0.18, 0.55),
    new Vector3(side * 0.1, 0.4, 0.3),
    new Vector3(side * 0.12, 0.46, 0),
    new Vector3(side * 0.1, 0.38, -0.3),
    new Vector3(side * 0.06, 0.16, -0.55),
  ];
}
function makeIfof(side: number): Vector3[] {
  // Inferior fronto-occipital fasciculus
  return [
    new Vector3(side * 0.5, 0.05, 0.55),
    new Vector3(side * 0.45, -0.08, 0.2),
    new Vector3(side * 0.5, -0.05, -0.2),
    new Vector3(side * 0.45, 0.08, -0.55),
  ];
}
function makeFornix(side: number): Vector3[] {
  return [
    new Vector3(side * 0.18, -0.3, 0.05),
    new Vector3(side * 0.1, -0.05, -0.05),
    new Vector3(side * 0.04, 0.15, -0.1),
    new Vector3(0, 0.2, -0.2),
  ];
}

const tractTemplates: Array<(idx: number) => Vector3[]> = [
  (i) => makeArcuate(i % 2 === 0 ? -1 : 1),
  () => makeCorpusCallosum(),
  (i) => makeCorticospinal(i % 2 === 0 ? -1 : 1),
  (i) => makeUncinate(i % 2 === 0 ? -1 : 1),
  (i) => makeCerebellarPeduncle(i % 2 === 0 ? -1 : 1),
  (i) => makeCingulum(i % 2 === 0 ? -1 : 1),
  (i) => makeIfof(i % 2 === 0 ? -1 : 1),
  (i) => makeFornix(i % 2 === 0 ? -1 : 1),
];

function jitterPoints(
  points: Vector3[],
  seed: number,
  amount: number,
): Vector3[] {
  return points.map((p, idx) => {
    const r = Math.sin(seed * 12.9898 + idx * 78.233) * 43758.5453;
    const j = r - Math.floor(r) - 0.5;
    return new Vector3(
      p.x + j * amount,
      p.y + j * amount * 0.6,
      p.z + j * amount * 0.7,
    );
  });
}

function buildTubeFor(tract: TractSegEntry, index: number): BufferGeometry {
  const template = tractTemplates[index % tractTemplates.length];
  const base = template(index);
  const jittered = jitterPoints(base, index + 1, 0.035);
  const curve = new CatmullRomCurve3(jittered, false, "catmullrom", 0.4);
  const thickness = tract.group === "commissural" ? 0.022 : 0.018;
  return new TubeGeometry(curve, 56, thickness, 8, false);
}

export function TractographyLayer({ visible = true }: { visible?: boolean }) {
  const geometries = useMemo(
    () => topTracts.map((tract, idx) => buildTubeFor(tract, idx)),
    [],
  );

  if (!visible) return null;

  return (
    <group data-testid="tractography-layer">
      {topTracts.map((tract, index) => (
        <mesh
          key={tract.slug}
          geometry={geometries[index]}
          userData={{ label: tract.slug, group: tract.group }}
        >
          <meshStandardMaterial
            color={groupColors[tract.group] ?? "#fb923c"}
            emissive={groupColors[tract.group] ?? "#fb923c"}
            emissiveIntensity={0.45}
            metalness={0.2}
            roughness={0.35}
            transparent
            opacity={0.78}
          />
        </mesh>
      ))}
    </group>
  );
}
