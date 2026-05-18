"use client";

import { createAtlasRenderLayer, type AtlasKey } from "@/lib/atlas-loader";

export function ParcellationOverlay({ atlasKey }: { atlasKey: AtlasKey }) {
  const layer = createAtlasRenderLayer(atlasKey);

  return (
    <mesh position={[0, 0, 0]} scale={[1.8, 1.25, 1.38]} userData={{ layer }}>
      <torusGeometry args={[0.82, 0.01, 8, 72]} />
      <meshBasicMaterial color={layer.atlas.color} transparent opacity={0.72} />
    </mesh>
  );
}
