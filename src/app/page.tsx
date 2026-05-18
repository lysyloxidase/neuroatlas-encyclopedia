import Link from "next/link";
import { BrainViewer } from "@/components/viewer3d/BrainViewer";
import { LevelFilter } from "@/components/filters/LevelFilter";
import { structures } from "@/lib/structures";
import { listAtlases } from "@/lib/atlas-loader";

export default function Home() {
  const filterItems = structures.map((structure) => ({
    id: structure.structure_id,
    title: structure.names.english,
    level: structure.level,
  }));

  return (
    <>
      <section className="hero-immersive">
        <div className="hero-scene">
          <BrainViewer />
        </div>
        <div className="container hero-content">
          <p className="eyebrow">Four-atlas reference backbone</p>
          <h1>NeuroAtlas Encyclopedia</h1>
          <p className="lead">
            A tiered encyclopedia for cortical, subcortical, cellular, network, tract, disorder, and development views.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/viewer">
              Open viewer
            </Link>
            <Link className="button secondary" href="/atlas">
              Compare atlases
            </Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <p className="eyebrow">Backbone</p>
        <h2>Reference Atlases</h2>
        <div className="grid" style={{ marginTop: "1rem" }}>
          {listAtlases().map((atlas) => (
            <article className="card" key={atlas.key}>
              <h3>{atlas.label}</h3>
              <p className="muted">{atlas.modality}</p>
              <p className="mono">{atlas.n_areas ?? atlas.n_structures} labels</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <p className="eyebrow">Structure browser</p>
        <h2>Macro to advanced structures</h2>
        <LevelFilter items={filterItems} />
      </section>
    </>
  );
}
