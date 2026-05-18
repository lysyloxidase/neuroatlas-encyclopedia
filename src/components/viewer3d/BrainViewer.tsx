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
import { NetworkOverlay } from "./NetworkOverlay";
import { ParcellationOverlay } from "./ParcellationOverlay";
import { SubcorticalPeeler } from "./SubcorticalPeeler";
import { TractographyLayer } from "./TractographyLayer";

interface BrainViewerProps {
  fullScreen?: boolean;
}

export function BrainViewer({ fullScreen = false }: BrainViewerProps) {
  const [atlasKey, setAtlasKey] = useState<AtlasKey>("hcp_mmp1");
  const [showCrossSection, setShowCrossSection] = useState(false);
  const [showDisorder, setShowDisorder] = useState(false);
  const [showCyto, setShowCyto] = useState(false);

  return (
    <section className={fullScreen ? "viewer-frame full" : "viewer-frame"} aria-label="3D brain viewer">
      <div className="viewer-label">
        <AtlasFilter onAtlasChange={setAtlasKey} />
      </div>
      <Canvas camera={{ position: [0, 0, 5], fov: 44 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.7} />
        <directionalLight intensity={1.8} position={[3, 3, 5]} />
        <CortexMesh />
        <SubcorticalPeeler />
        <ParcellationOverlay atlasKey={atlasKey} />
        <TractographyLayer />
        <NetworkOverlay />
        <DisorderHeatmap enabled={showDisorder} />
        <GradientColoring enabled />
        <CrossSection visible={showCrossSection} />
        <CytoZoom visible={showCyto} />
      </Canvas>
      <div className="viewer-label" style={{ left: "auto", right: "1rem", top: "1rem" }}>
        <div className="filter-bar">
          <button className="filter-button" onClick={() => setShowCrossSection((value) => !value)} type="button">
            Slice
          </button>
          <button className="filter-button" onClick={() => setShowDisorder((value) => !value)} type="button">
            ENIGMA
          </button>
          <button className="filter-button" onClick={() => setShowCyto((value) => !value)} type="button">
            BigBrain
          </button>
        </div>
      </div>
    </section>
  );
}
