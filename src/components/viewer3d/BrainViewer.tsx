"use client";

import { Canvas } from "@react-three/fiber";
import { useState } from "react";
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

export function BrainViewer({ fullScreen = false }: BrainViewerProps) {
  const [atlasKey, setAtlasKey] = useState<AtlasKey>("hcp_mmp1");
  const [showCrossSection, setShowCrossSection] = useState(false);
  const [showDisorder, setShowDisorder] = useState(false);
  const [showCyto, setShowCyto] = useState(false);
  const [showCortex, setShowCortex] = useState(true);
  const [showLobes, setShowLobes] = useState(false);
  const [showVentricles, setShowVentricles] = useState(true);
  const [selectedGyrus, setSelectedGyrus] = useState<string | null>(null);

  return (
    <section className={fullScreen ? "viewer-frame full" : "viewer-frame"} aria-label="3D brain viewer">
      <div className="viewer-label">
        <AtlasFilter onAtlasChange={setAtlasKey} />
      </div>
      <Canvas camera={{ position: [0, 0, 5], fov: 44 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.7} />
        <directionalLight intensity={1.8} position={[3, 3, 5]} />
        <CortexMesh highlight={selectedGyrus ? "#facc15" : "#06b6d4"} visible={showCortex} />
        <SubcorticalPeeler />
        <BasalGangliaLayer visible={!showCortex} />
        <VentricularSystem visible={showVentricles} />
        <LobeOverlay visible={showLobes} />
        <ParcellationOverlay atlasKey={atlasKey} />
        <TractographyLayer />
        <NetworkOverlay />
        <DisorderHeatmap enabled={showDisorder} />
        <GradientColoring enabled />
        <CrossSection visible={showCrossSection} />
        <CytoZoom visible={showCyto} />
        <GyrusHoverLayer selectedGyrus={selectedGyrus} onSelect={setSelectedGyrus} />
      </Canvas>
      <div className="viewer-label" style={{ left: "auto", right: "1rem", top: "1rem" }}>
        <ViewerControls
          showCortex={showCortex}
          showLobes={showLobes}
          showVentricles={showVentricles}
          onToggleCortex={() => setShowCortex((value) => !value)}
          onToggleLobes={() => setShowLobes((value) => !value)}
          onToggleVentricles={() => setShowVentricles((value) => !value)}
          onToggleCrossSection={() => setShowCrossSection((value) => !value)}
          onToggleDisorder={() => setShowDisorder((value) => !value)}
          onToggleCyto={() => setShowCyto((value) => !value)}
        />
        <GyrusHoverControls selectedGyrus={selectedGyrus} onSelect={setSelectedGyrus} />
      </div>
    </section>
  );
}
