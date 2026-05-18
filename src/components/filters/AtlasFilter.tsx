"use client";

import { useState } from "react";
import {
  createAtlasRenderLayer,
  listAtlases,
  type AtlasKey,
} from "@/lib/atlas-loader";

interface AtlasFilterProps {
  onAtlasChange?: (atlas: AtlasKey) => void;
}

export function AtlasFilter({ onAtlasChange }: AtlasFilterProps) {
  const [selected, setSelected] = useState<AtlasKey>("hcp_mmp1");
  const layer = createAtlasRenderLayer(selected);

  function choose(atlas: AtlasKey) {
    setSelected(atlas);
    onAtlasChange?.(atlas);
  }

  return (
    <div>
      <div className="filter-bar" aria-label="Atlas filter">
        {listAtlases().map((atlas) => (
          <button
            aria-pressed={selected === atlas.key}
            className="filter-button"
            key={atlas.key}
            onClick={() => choose(atlas.key)}
            style={{
              borderColor: selected === atlas.key ? atlas.color : undefined,
            }}
            type="button"
          >
            {atlas.shortLabel}
          </button>
        ))}
      </div>
      <p className="muted mono" data-testid="atlas-render-layer">
        {layer.textureUniform}
        {" -> "}
        {layer.renderMode}
      </p>
    </div>
  );
}
