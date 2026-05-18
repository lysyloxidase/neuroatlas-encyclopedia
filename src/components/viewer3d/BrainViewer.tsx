"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { Vector3 } from "three";
import { AtlasFilter } from "@/components/filters/AtlasFilter";
import type { AtlasKey } from "@/lib/atlas-loader";
import { CortexMesh } from "./CortexMesh";
import { CrossSection } from "./CrossSection";
import { CytoZoom } from "./CytoZoom";
import { DisorderHeatmap } from "./DisorderHeatmap";
import { GradientColoring } from "./GradientColoring";
import { BasalGangliaLayer } from "./BasalGangliaLayer";
import { GyrusHoverControls, GyrusHoverLayer } from "./GyrusHoverLayer";
import { LobeOverlay } from "./LobeOverlay";
import { NetworkOverlay } from "./NetworkOverlay";
import { ParcellationOverlay } from "./ParcellationOverlay";
import { SubcorticalPeeler } from "./SubcorticalPeeler";
import { TractographyLayer } from "./TractographyLayer";
import { VentricularSystem } from "./VentricularSystem";
import { ViewerControls } from "./ViewerControls";

interface BrainViewerProps {
  fullScreen?: boolean;
}

type Axis = "sagittal" | "coronal" | "axial";

const axisPositions: Record<Axis, [number, number, number]> = {
  sagittal: [4.6, 0.3, 0.6],
  coronal: [0, 0.2, 5],
  axial: [0, 4.2, 1.8],
};

function KeyboardCameraRig({
  axis,
  pan,
  zoom,
}: {
  axis: Axis;
  pan: [number, number];
  zoom: number;
}) {
  const { camera } = useThree();
  const target = useMemo(() => new Vector3(), []);
  const lookAt = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const [x, y, z] = axisPositions[axis];
    target.set(x * zoom + pan[0], y * zoom + pan[1], z * zoom);
    lookAt.set(pan[0], pan[1], 0);
    camera.position.lerp(target, 0.12);
    camera.lookAt(lookAt);
  });

  return null;
}

export function BrainViewer({ fullScreen = false }: BrainViewerProps) {
  const [atlasKey, setAtlasKey] = useState<AtlasKey>("hcp_mmp1");
  const [axis, setAxis] = useState<Axis>("coronal");
  const [activeDisorder, setActiveDisorder] = useState("alzheimers-disease");
  const [activeNetwork, setActiveNetwork] = useState("yeo-default-mode");
  const [cameraPan, setCameraPan] = useState<[number, number]>([0, 0]);
  const [cameraZoom, setCameraZoom] = useState(1);
  const [showCrossSection, setShowCrossSection] = useState(false);
  const [showDisorder, setShowDisorder] = useState(false);
  const [showCyto, setShowCyto] = useState(false);
  const [showCortex, setShowCortex] = useState(true);
  const [showGradient, setShowGradient] = useState(true);
  const [showLobes, setShowLobes] = useState(false);
  const [showTracts, setShowTracts] = useState(true);
  const [showVentricles, setShowVentricles] = useState(true);
  const [selectedGyrus, setSelectedGyrus] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "a") setAxis("sagittal");
    if (event.key === "s") setAxis("coronal");
    if (event.key === "d") setAxis("axial");
    if (event.key === "+" || event.key === "=")
      setCameraZoom((value) => Math.max(0.55, value - 0.08));
    if (event.key === "-" || event.key === "_")
      setCameraZoom((value) => Math.min(1.65, value + 0.08));
    if (event.key === "ArrowLeft") setCameraPan(([x, y]) => [x - 0.08, y]);
    if (event.key === "ArrowRight") setCameraPan(([x, y]) => [x + 0.08, y]);
    if (event.key === "ArrowUp") setCameraPan(([x, y]) => [x, y + 0.08]);
    if (event.key === "ArrowDown") setCameraPan(([x, y]) => [x, y - 0.08]);
  }, []);

  return (
    <section
      aria-label="3D brain viewer. Keyboard controls: a sagittal, s coronal, d axial, plus and minus zoom, arrow keys pan."
      className={fullScreen ? "viewer-frame full" : "viewer-frame"}
      data-axis={axis}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="viewer-label">
        <AtlasFilter onAtlasChange={setAtlasKey} />
      </div>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <KeyboardCameraRig axis={axis} pan={cameraPan} zoom={cameraZoom} />
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.7} />
        <directionalLight intensity={1.8} position={[3, 3, 5]} />
        <CortexMesh
          highlight={selectedGyrus ? "#facc15" : "#06b6d4"}
          opacity={showCortex ? 0.68 : 0.18}
          reducedMotion={reducedMotion}
          visible
        />
        <SubcorticalPeeler peeled={!showCortex} />
        <BasalGangliaLayer visible={!showCortex} />
        <VentricularSystem visible={showVentricles} />
        <LobeOverlay visible={showLobes} />
        <ParcellationOverlay atlasKey={atlasKey} />
        <TractographyLayer visible={showTracts} />
        <NetworkOverlay networkSlug={activeNetwork} />
        <DisorderHeatmap disorderSlug={activeDisorder} enabled={showDisorder} />
        <GradientColoring enabled={showGradient} />
        <CrossSection axis={axis} visible={showCrossSection} />
        <CytoZoom visible={showCyto} />
        <GyrusHoverLayer
          selectedGyrus={selectedGyrus}
          onSelect={setSelectedGyrus}
        />
      </Canvas>
      <div
        className="viewer-label"
        style={{ left: "auto", right: "1rem", top: "1rem" }}
      >
        <ViewerControls
          activeDisorder={activeDisorder}
          activeNetwork={activeNetwork}
          showCortex={showCortex}
          showGradient={showGradient}
          showLobes={showLobes}
          showTracts={showTracts}
          showVentricles={showVentricles}
          onDisorderChange={setActiveDisorder}
          onNetworkChange={setActiveNetwork}
          onToggleCortex={() => setShowCortex((value) => !value)}
          onToggleLobes={() => setShowLobes((value) => !value)}
          onToggleVentricles={() => setShowVentricles((value) => !value)}
          onToggleCrossSection={() => setShowCrossSection((value) => !value)}
          onToggleDisorder={() => setShowDisorder((value) => !value)}
          onToggleCyto={() => setShowCyto((value) => !value)}
          onToggleGradient={() => setShowGradient((value) => !value)}
          onToggleTracts={() => setShowTracts((value) => !value)}
        />
        <button
          aria-pressed={reducedMotion}
          className="filter-button"
          onClick={() => setReducedMotion((value) => !value)}
          type="button"
        >
          Motion
        </button>
        <GyrusHoverControls
          selectedGyrus={selectedGyrus}
          onSelect={setSelectedGyrus}
        />
      </div>
    </section>
  );
}
