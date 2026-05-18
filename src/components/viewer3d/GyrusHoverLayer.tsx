"use client";

const targets = [
  { id: "precentral", label: "Precentral gyrus", position: [-0.62, 0.1, 0.88] },
  {
    id: "postcentral",
    label: "Postcentral gyrus",
    position: [-0.35, 0.24, 0.86],
  },
  { id: "fusiform", label: "Fusiform gyrus", position: [0.44, -0.54, 0.62] },
] as const;

interface GyrusHoverLayerProps {
  selectedGyrus: string | null;
  onSelect: (label: string | null) => void;
}

export function GyrusHoverLayer({
  selectedGyrus,
  onSelect,
}: GyrusHoverLayerProps) {
  return (
    <group userData={{ layer: "gyrus-hover" }}>
      {targets.map((target) => (
        <mesh
          key={target.id}
          onPointerOut={() => onSelect(null)}
          onPointerOver={() => onSelect(target.label)}
          position={target.position}
        >
          <sphereGeometry
            args={[selectedGyrus === target.label ? 0.095 : 0.065, 20, 12]}
          />
          <meshBasicMaterial
            color={selectedGyrus === target.label ? "#facc15" : "#e2e8f0"}
            transparent
            opacity={0.82}
          />
        </mesh>
      ))}
    </group>
  );
}

export function GyrusHoverControls({
  selectedGyrus,
  onSelect,
}: GyrusHoverLayerProps) {
  return (
    <div>
      <p className="mono" data-testid="selected-gyrus">
        {selectedGyrus ? `Selected gyrus: ${selectedGyrus}` : "Hover a gyrus"}
      </p>
      <div className="filter-bar" aria-label="Gyrus hover targets">
        {targets.map((target) => (
          <button
            className="filter-button"
            data-testid="gyrus-hover-target"
            key={target.id}
            onMouseEnter={() => onSelect(target.label)}
            onMouseLeave={() => onSelect(null)}
            type="button"
          >
            {target.label}
          </button>
        ))}
      </div>
    </div>
  );
}
