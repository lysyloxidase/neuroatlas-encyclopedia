"use client";

import disorders from "@/data/disorders/enigma_effects.json";
import networks from "@/data/networks.json";

interface ViewerControlsProps {
  activeDisorder?: string;
  activeNetwork?: string;
  showCortex: boolean;
  showGradient?: boolean;
  showLobes: boolean;
  showTracts?: boolean;
  showVentricles: boolean;
  onDisorderChange?: (value: string) => void;
  onNetworkChange?: (value: string) => void;
  onToggleCortex: () => void;
  onToggleLobes: () => void;
  onToggleVentricles: () => void;
  onToggleCrossSection: () => void;
  onToggleDisorder: () => void;
  onToggleCyto: () => void;
  onToggleGradient?: () => void;
  onToggleTracts?: () => void;
}

const networkOptions = (
  networks as { slug: string; name: string; system: string }[]
)
  .filter(
    (network) => network.system.includes("Yeo") || network.slug === "limbic",
  )
  .slice(0, 8);

const disorderOptions = Array.from(
  new Set(
    (disorders as { disorder: string }[]).map((effect) => effect.disorder),
  ),
);

export function ViewerControls({
  activeDisorder = "alzheimers-disease",
  activeNetwork = "yeo-default-mode",
  showCortex,
  showGradient = true,
  showLobes,
  showTracts = true,
  showVentricles,
  onDisorderChange = () => {},
  onNetworkChange = () => {},
  onToggleCortex,
  onToggleLobes,
  onToggleVentricles,
  onToggleCrossSection,
  onToggleDisorder,
  onToggleCyto,
  onToggleGradient = () => {},
  onToggleTracts = () => {},
}: ViewerControlsProps) {
  return (
    <div className="filter-bar" aria-label="Viewer controls">
      <button
        aria-pressed={!showCortex}
        className="filter-button"
        onClick={onToggleCortex}
        type="button"
      >
        Peel BG
      </button>
      <button
        aria-pressed={showLobes}
        className="filter-button"
        onClick={onToggleLobes}
        type="button"
      >
        Lobes
      </button>
      <button
        aria-pressed={showVentricles}
        className="filter-button"
        onClick={onToggleVentricles}
        type="button"
      >
        Ventricles
      </button>
      <button
        aria-pressed={showTracts}
        className="filter-button"
        onClick={onToggleTracts}
        type="button"
      >
        Tracts
      </button>
      <button
        aria-pressed={showGradient}
        className="filter-button"
        onClick={onToggleGradient}
        type="button"
      >
        G1
      </button>
      <button
        className="filter-button"
        onClick={onToggleCrossSection}
        type="button"
      >
        Slice
      </button>
      <button
        className="filter-button"
        onClick={onToggleDisorder}
        type="button"
      >
        ENIGMA
      </button>
      <button className="filter-button" onClick={onToggleCyto} type="button">
        BigBrain
      </button>
      <label className="sr-only" htmlFor="viewer-network-select">
        Network overlay
      </label>
      <select
        id="viewer-network-select"
        value={activeNetwork}
        onChange={(event) => onNetworkChange(event.target.value)}
      >
        {networkOptions.map((network) => (
          <option key={network.slug} value={network.slug}>
            {network.name}
          </option>
        ))}
      </select>
      <label className="sr-only" htmlFor="viewer-disorder-select">
        ENIGMA disorder heatmap
      </label>
      <select
        id="viewer-disorder-select"
        value={activeDisorder}
        onChange={(event) => onDisorderChange(event.target.value)}
      >
        {disorderOptions.map((disorder) => (
          <option key={disorder} value={disorder}>
            {disorder.replace(/-/g, " ")}
          </option>
        ))}
      </select>
    </div>
  );
}
