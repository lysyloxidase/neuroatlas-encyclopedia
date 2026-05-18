"use client";

interface ViewerControlsProps {
  showCortex: boolean;
  showLobes: boolean;
  showVentricles: boolean;
  onToggleCortex: () => void;
  onToggleLobes: () => void;
  onToggleVentricles: () => void;
  onToggleCrossSection: () => void;
  onToggleDisorder: () => void;
  onToggleCyto: () => void;
}

export function ViewerControls({
  showCortex,
  showLobes,
  showVentricles,
  onToggleCortex,
  onToggleLobes,
  onToggleVentricles,
  onToggleCrossSection,
  onToggleDisorder,
  onToggleCyto,
}: ViewerControlsProps) {
  return (
    <div className="filter-bar" aria-label="Viewer controls">
      <button aria-pressed={!showCortex} className="filter-button" onClick={onToggleCortex} type="button">
        Peel BG
      </button>
      <button aria-pressed={showLobes} className="filter-button" onClick={onToggleLobes} type="button">
        Lobes
      </button>
      <button aria-pressed={showVentricles} className="filter-button" onClick={onToggleVentricles} type="button">
        Ventricles
      </button>
      <button className="filter-button" onClick={onToggleCrossSection} type="button">
        Slice
      </button>
      <button className="filter-button" onClick={onToggleDisorder} type="button">
        ENIGMA
      </button>
      <button className="filter-button" onClick={onToggleCyto} type="button">
        BigBrain
      </button>
    </div>
  );
}
