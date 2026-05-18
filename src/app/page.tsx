import Link from "next/link";
import {
  Activity,
  Atom,
  BookOpen,
  Brain,
  Compass,
  GraduationCap,
  Heart,
  Layers3,
  Network,
  ScrollText,
  Sparkles,
  Workflow,
} from "lucide-react";
import { BrainViewer } from "@/components/viewer3d/BrainViewer";
import { LevelFilter } from "@/components/filters/LevelFilter";
import { structures } from "@/lib/structures";
import { listAtlases } from "@/lib/atlas-loader";

interface SectionEntry {
  href: string;
  title: string;
  description: string;
  meta: string;
  icon: React.ReactNode;
  accent: "cyan" | "violet" | "amber" | "emerald" | "rose";
}

const sectionGroups: { id: string; title: string; entries: SectionEntry[] }[] = [
  {
    id: "anatomy",
    title: "Anatomy",
    entries: [
      {
        href: "/atlas",
        title: "Reference atlases",
        description:
          "HCP-MMP1, Julich, Allen CCFv3, and Desikan-Killiany as a shared backbone.",
        meta: "4 atlases",
        icon: <Layers3 size={20} />,
        accent: "cyan",
      },
      {
        href: "/viewer",
        title: "3D viewer",
        description:
          "Interactive cortex with gyri/sulci, deep structures, ventricles, and tractography.",
        meta: "Full screen",
        icon: <Brain size={20} />,
        accent: "cyan",
      },
      {
        href: "/microanatomy",
        title: "Microanatomy",
        description:
          "Cortical layers, hippocampal subfields, thalamic nuclei, PAG columns.",
        meta: "Level 5",
        icon: <Atom size={20} />,
        accent: "violet",
      },
      {
        href: "/cerebellum",
        title: "Cerebellum",
        description: "HOA lobules, cerebellar cortex, pontine connections.",
        meta: "Posterior fossa",
        icon: <Compass size={20} />,
        accent: "emerald",
      },
      {
        href: "/cellular",
        title: "Cell types",
        description:
          "Siletti and Yao taxonomies — excitatory, inhibitory, and glial classes.",
        meta: "Cross-species",
        icon: <Sparkles size={20} />,
        accent: "violet",
      },
    ],
  },
  {
    id: "function",
    title: "Function",
    entries: [
      {
        href: "/networks",
        title: "Large-scale networks",
        description:
          "DMN, salience, CEN, dual-stream language, dorsal/ventral visual streams.",
        meta: "Yeo / Glasser",
        icon: <Network size={20} />,
        accent: "cyan",
      },
      {
        href: "/neuromodulators",
        title: "Neuromodulators",
        description:
          "DA, 5-HT, NA, ACh, and histamine pathways with receptor mapping.",
        meta: "5 systems",
        icon: <Workflow size={20} />,
        accent: "amber",
      },
      {
        href: "/connectome",
        title: "Connectome",
        description: "360-node HCP-MMP1 graph with rich-club hubs.",
        meta: "Structural",
        icon: <Network size={20} />,
        accent: "cyan",
      },
      {
        href: "/gradient",
        title: "Principal gradient",
        description:
          "Sensory-to-transmodal cortical hierarchy (Margulies 2016).",
        meta: "G1",
        icon: <Activity size={20} />,
        accent: "violet",
      },
    ],
  },
  {
    id: "pathology",
    title: "Pathology",
    entries: [
      {
        href: "/disorders",
        title: "Disorders",
        description:
          "ENIGMA structural maps, biomarkers, pathology propagation, tiered evidence.",
        meta: "Cohen's d",
        icon: <Heart size={20} />,
        accent: "rose",
      },
      {
        href: "/disorders/dbs",
        title: "DBS targets",
        description:
          "Indications, target nuclei, FDA status, and evidence levels.",
        meta: "Clinical",
        icon: <Activity size={20} />,
        accent: "rose",
      },
    ],
  },
  {
    id: "learn",
    title: "Learn",
    entries: [
      {
        href: "/explainers/principal-gradient",
        title: "Explainers",
        description:
          "Short walk-throughs of key concepts with interactive widgets.",
        meta: "~5 min",
        icon: <BookOpen size={20} />,
        accent: "amber",
      },
      {
        href: "/quiz/cortical-anatomy",
        title: "Quizzes",
        description: "Test your knowledge of cortical and subcortical anatomy.",
        meta: "Multiple choice",
        icon: <GraduationCap size={20} />,
        accent: "emerald",
      },
      {
        href: "/development",
        title: "Development",
        description:
          "Brain-development timeline from embryo to adulthood.",
        meta: "Timeline",
        icon: <Activity size={20} />,
        accent: "amber",
      },
      {
        href: "/decisive-studies",
        title: "Decisive studies",
        description: "Landmark papers that shaped modern neuroanatomy.",
        meta: "Citations",
        icon: <ScrollText size={20} />,
        accent: "violet",
      },
    ],
  },
];

export default function Home() {
  const filterItems = structures.map((structure) => ({
    id: structure.structure_id,
    title: structure.names.english,
    level: structure.level,
  }));

  return (
    <>
      <section className="hero-immersive">
        <div className="hero-scene" aria-hidden="true">
          <BrainViewer minimal />
        </div>
        <div className="hero-veil" aria-hidden="true" />
        <div className="container hero-content">
          <p className="eyebrow">Four-atlas reference backbone</p>
          <h1>NeuroAtlas Encyclopedia</h1>
          <p className="lead">
            A multi-layer encyclopedia of cortex, deep structures, cell types,
            large-scale networks, white-matter tracts, disorders, and brain
            development.
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
        <p className="eyebrow">Section map</p>
        <h2>Where to start</h2>
        <p className="lead muted">
          Each group is a focused exploration path — pick a domain
          (anatomy, function, pathology) or follow the learning track.
        </p>
        <div className="section-map">
          {sectionGroups.map((group) => (
            <div className="section-map-group" key={group.id}>
              <h3 className="section-map-title">{group.title}</h3>
              <div className="section-map-grid">
                {group.entries.map((entry) => (
                  <Link
                    className={`section-tile accent-${entry.accent}`}
                    href={entry.href}
                    key={entry.href}
                  >
                    <span className="section-tile-icon" aria-hidden="true">
                      {entry.icon}
                    </span>
                    <span className="section-tile-body">
                      <span className="section-tile-meta">{entry.meta}</span>
                      <span className="section-tile-title">{entry.title}</span>
                      <span className="section-tile-desc">
                        {entry.description}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <p className="eyebrow">Backbone</p>
        <h2>Reference atlases</h2>
        <div className="grid" style={{ marginTop: "1rem" }}>
          {listAtlases().map((atlas) => (
            <article className="card atlas-card" key={atlas.key}>
              <h3>{atlas.label}</h3>
              <p className="muted">{atlas.modality}</p>
              <p className="mono">
                {atlas.n_areas ?? atlas.n_structures} labels
              </p>
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
