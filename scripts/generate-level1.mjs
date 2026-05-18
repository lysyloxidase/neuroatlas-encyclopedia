import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import YAML from "yaml";

const ROOT = process.cwd();
const CONTENT_ROOT = join(ROOT, "src/content/structures/level1");
const JSON_PATH = join(ROOT, "src/data/structures/level1_macro.json");

const Tier = {
  ROBUST: 1,
  PLAUSIBLE: 2,
  SPECULATIVE: 3,
};

const citations = {
  desikan2006: {
    doi: "10.1016/j.neuroimage.2006.01.021",
    year: 2006,
    journal: "NeuroImage",
    title:
      "An automated labeling system for subdividing the human cerebral cortex on MRI scans",
  },
  destrieux2010: {
    doi: "10.1016/j.neuroimage.2010.06.010",
    year: 2010,
    journal: "NeuroImage",
    title:
      "Automatic parcellation of human cortical gyri and sulci using standard anatomical nomenclature",
  },
  glasser2016: {
    doi: "10.1038/nature18933",
    year: 2016,
    journal: "Nature",
    title: "A multi-modal parcellation of human cerebral cortex",
  },
  amunts2020: {
    doi: "10.1126/science.abb4588",
    year: 2020,
    journal: "Science",
    title:
      "Julich-Brain: A 3D probabilistic atlas of the human brain's cytoarchitecture",
  },
  wang2020: {
    doi: "10.1016/j.cell.2020.04.007",
    year: 2020,
    journal: "Cell",
    title: "The Allen Mouse Brain Common Coordinate Framework",
  },
  stuss2013: {
    doi: "10.1093/med/9780199837755.001.0001",
    year: 2013,
    journal: "Oxford Medicine Online",
    title: "Principles of Frontal Lobe Function",
  },
  ledoux2012: {
    doi: "10.1016/j.neuron.2012.02.004",
    year: 2012,
    journal: "Neuron",
    title: "Rethinking the emotional brain",
  },
  seeley2007: {
    doi: "10.1016/j.neuron.2007.05.011",
    year: 2007,
    journal: "Neuron",
    title:
      "Dissociable intrinsic connectivity networks for salience processing and executive control",
  },
  yeo2011: {
    doi: "10.1152/jn.00338.2011",
    year: 2011,
    journal: "Journal of Neurophysiology",
    title:
      "The organization of the human cerebral cortex estimated by intrinsic functional connectivity",
  },
  lazaridis2024: {
    doi: "10.1016/j.cub.2024.09.070",
    year: 2024,
    journal: "Current Biology",
    title:
      "Striosome circuits in the primate striatum support a striosomal indirect pathway",
  },
  hoche2018: {
    doi: "10.1093/brain/awx317",
    year: 2018,
    journal: "Brain",
    title: "The cerebellar cognitive affective/Schmahmann syndrome scale",
  },
  selvadurai2023: {
    doi: "10.1007/s12311-023-01651-0",
    year: 2023,
    journal: "The Cerebellum",
    title: "Cerebellar cognitive affective syndrome",
  },
  hofer2006: {
    doi: "10.1016/j.neuroimage.2006.05.044",
    year: 2006,
    journal: "NeuroImage",
    title: "Topography of the human corpus callosum revisited",
  },
  damkier2013: {
    doi: "10.1152/physrev.00004.2013",
    year: 2013,
    journal: "Physiological Reviews",
    title: "Cerebrospinal fluid secretion by the choroid plexus",
  },
  lehtinen2011: {
    doi: "10.1016/j.cell.2011.01.023",
    year: 2011,
    journal: "Cell",
    title:
      "The cerebrospinal fluid provides a proliferative niche for neural progenitor cells",
  },
  iliff2012: {
    doi: "10.1126/scitranslmed.3003748",
    year: 2012,
    journal: "Science Translational Medicine",
    title:
      "A paravascular pathway facilitates CSF flow through the brain parenchyma",
  },
};

const cite = (...keys) => keys.map((key) => citations[key]);

const citationSets = {
  cortex: cite("desikan2006", "glasser2016", "amunts2020"),
  sulcus: cite("destrieux2010", "desikan2006", "glasser2016"),
  frontal: cite("stuss2013", "desikan2006", "glasser2016"),
  insula: cite("seeley2007", "desikan2006", "yeo2011"),
  limbic: cite("ledoux2012", "desikan2006", "yeo2011"),
  basalGanglia: cite("lazaridis2024", "amunts2020", "wang2020"),
  diencephalon: cite("amunts2020", "wang2020", "glasser2016"),
  cerebellum: cite("hoche2018", "selvadurai2023", "amunts2020"),
  brainstem: cite("amunts2020", "wang2020", "glasser2016"),
  ventricular: cite("damkier2013", "lehtinen2011", "iliff2012"),
  whiteMatter: cite("hofer2006", "desikan2006", "glasser2016"),
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function folderFor(category) {
  return {
    lobe: "lobes",
    gyrus: "gyri",
    sulcus: "sulci",
    "basal ganglia": "basal-ganglia",
    diencephalon: "diencephalon",
    cerebellum: "cerebellum",
    brainstem: "brainstem",
    ventricle: "ventricular-system",
    "white matter": "white-matter",
  }[category];
}

function defaultCellClasses(category) {
  if (["ventricle", "white matter"].includes(category)) {
    return {
      excitatory: ["ependymal or projection-associated support cells"],
      inhibitory: [
        "periventricular or tract-associated interneuron interfaces",
      ],
      glia: ["astrocyte", "oligodendrocyte", "microglia"],
    };
  }

  if (
    ["basal ganglia", "diencephalon", "brainstem", "cerebellum"].includes(
      category,
    )
  ) {
    return {
      excitatory: ["projection neurons"],
      inhibitory: ["GABAergic neurons"],
      glia: ["astrocyte", "oligodendrocyte", "microglia"],
    };
  }

  return {
    excitatory: ["IT", "ET", "CT", "L6b"],
    inhibitory: ["PV", "SST", "VIP", "LAMP5", "SNCG"],
    glia: ["astrocyte", "oligodendrocyte", "microglia"],
  };
}

function defaultInputs(category) {
  if (category === "ventricle") {
    return {
      afferent_cortical: [],
      afferent_subcortical: ["choroid plexus", "ependymal lining"],
      afferent_modulatory: ["autonomic and vascular regulation"],
    };
  }

  if (category === "white matter") {
    return {
      afferent_cortical: ["cortical projection and commissural neurons"],
      afferent_subcortical: ["thalamic and brainstem projection systems"],
      afferent_modulatory: ["diffuse neuromodulatory fibers"],
    };
  }

  return {
    afferent_cortical: [
      "association cortex",
      "primary and secondary cortical fields",
    ],
    afferent_subcortical: ["thalamus", "basal ganglia and cerebellar loops"],
    afferent_modulatory: [
      "dopamine",
      "serotonin",
      "norepinephrine",
      "acetylcholine",
    ],
  };
}

function defaultOutputs(category) {
  if (category === "ventricle") {
    return {
      efferent_cortical: [],
      efferent_subcortical: ["CSF pathways", "subarachnoid space"],
    };
  }

  if (category === "white matter") {
    return {
      efferent_cortical: ["homotopic and heterotopic cortical targets"],
      efferent_subcortical: ["capsular, commissural, and projection pathways"],
    };
  }

  return {
    efferent_cortical: ["local cortical and association networks"],
    efferent_subcortical: [
      "thalamus",
      "basal ganglia",
      "brainstem",
      "cerebellum",
    ],
  };
}

function disorder(name, association, citationsForDisorder, effectSize = 0.45) {
  return {
    disorder: name,
    association,
    effect_size: effectSize,
    tier: Tier.ROBUST,
    citations: [citationsForDisorder[0]],
  };
}

function claim(
  text,
  citationsForClaim,
  tier = Tier.ROBUST,
  justification,
  contradicting = [],
) {
  return {
    claim: text,
    tier,
    tier_justification:
      justification ??
      "Robust clinical lesion, stimulation, atlas, and systems-neuroscience evidence converge at the macroanatomical level.",
    citations: [citationsForClaim[0]],
    ...(tier === Tier.ROBUST ? {} : { contradicting }),
  };
}

function makeStructure(config) {
  const category = config.category;
  const primary = config.citations ?? citationSets.cortex;
  const folder = config.folder ?? folderFor(category);
  const english = config.english;
  const baseClaim = config.claims ?? [
    claim(
      config.functionText ??
        `${english} supports ${config.role ?? "macroanatomical integration within its parent system"}.`,
      primary,
    ),
  ];

  return {
    folder,
    data: {
      structure_id: config.id,
      names: {
        latin: config.latin ?? english,
        english,
        abbreviations: config.abbreviations ?? [],
      },
      level: 1,
      macroanatomy: {
        category,
        ...(config.boundaries ? { boundaries: config.boundaries } : {}),
        ...(config.subdivisions ? { subdivisions: config.subdivisions } : {}),
        ...(config.tags ? { phase2_tags: config.tags } : {}),
        ...(config.note ? { note: config.note } : {}),
        ...(config.color ? { color: config.color } : {}),
        ...(config.systemViewTier
          ? { system_view_tier: config.systemViewTier }
          : {}),
      },
      atlas_links: {
        ...(config.atlas ?? {}),
        crosswalks: config.crosswalks ?? [],
      },
      location: {
        ...(config.mniLeft ? { mni_centroid_left: config.mniLeft } : {}),
        ...(config.mniRight ? { mni_centroid_right: config.mniRight } : {}),
        ...(config.ccf ? { ccf_centroid: config.ccf } : {}),
        neighbors: config.neighbors ?? [],
        parent: config.parent ?? null,
        children: config.children ?? [],
      },
      cytoarchitecture: {
        layers:
          config.layers ??
          (category === "sulcus"
            ? "Cortical infolding landmark with adjacent banks carrying region-specific laminar patterns."
            : "Macroanatomical entry; cellular details resolve in Level 2 and Level 3 pages."),
        cell_classes: config.cellClasses ?? defaultCellClasses(category),
        ...(config.siletti ? { siletti_clusters: config.siletti } : {}),
        ...(config.yao ? { yao_clusters: config.yao } : {}),
      },
      inputs: config.inputs ?? defaultInputs(category),
      outputs: config.outputs ?? defaultOutputs(category),
      functions: baseClaim,
      neurotransmitters: config.neurotransmitters ?? {
        intrinsic: ["glutamate", "GABA"],
        modulatory: [
          "dopamine",
          "serotonin",
          "norepinephrine",
          "acetylcholine",
        ],
      },
      disorders: config.disorders ?? [],
      imaging: {
        t1_signal:
          config.t1 ??
          `${english} is identifiable as a Level 1 macroanatomical landmark on structural MRI or atlas surfaces.`,
        ...(config.t2 ? { t2_signal: config.t2 } : {}),
        fmri_tasks: config.fmri ?? ["resting state", "task localizer"],
        ...(config.pet ? { pet_tracers: config.pet } : {}),
      },
      development: {
        embryonic_origin:
          config.embryonic ??
          "Neural tube-derived central nervous system territory.",
        peak_synaptogenesis:
          config.synaptogenesis ??
          "Region-specific prenatal and postnatal maturation.",
        myelination:
          config.myelination ??
          "Maturation follows local circuit and long-range tract development.",
      },
      primary_citations: primary,
      ...(typeof config.gradient === "number"
        ? { gradient_value: config.gradient }
        : {}),
    },
  };
}

const lobes = [
  makeStructure({
    id: "L1_LOBE_FRONTAL",
    category: "lobe",
    english: "Frontal lobe",
    latin: "Lobus frontalis",
    abbreviations: ["FL"],
    color: "#38bdf8",
    citations: citationSets.frontal,
    boundaries:
      "Anterior to the central sulcus and superior to the lateral sulcus.",
    subdivisions: [
      "dlPFC",
      "vlPFC",
      "OFC",
      "motor cortex",
      "premotor cortex",
      "frontal pole",
    ],
    claims: [
      claim(
        "Executive function, motor control, left language production, and personality are core frontal lobe functions.",
        citationSets.frontal,
      ),
    ],
    disorders: [
      disorder(
        "frontal lobe syndrome",
        "Dysexecutive, disinhibited, apathetic, or personality-change syndromes follow frontal injury.",
        citationSets.frontal,
      ),
      disorder(
        "behavioral variant frontotemporal dementia",
        "bvFTD prominently affects frontal and anterior temporal systems.",
        citationSets.frontal,
      ),
      disorder(
        "Pick disease",
        "Frontotemporal degeneration classically involves frontal and temporal cortex.",
        citationSets.frontal,
      ),
    ],
  }),
  makeStructure({
    id: "L1_LOBE_PARIETAL",
    category: "lobe",
    english: "Parietal lobe",
    latin: "Lobus parietalis",
    abbreviations: ["PL"],
    color: "#22c55e",
    citations: citationSets.cortex,
    boundaries:
      "Posterior to the central sulcus, superior to the lateral sulcus, and anterior to the parieto-occipital boundary.",
    subdivisions: [
      "postcentral gyrus",
      "superior parietal lobule",
      "supramarginal gyrus",
      "angular gyrus",
      "precuneus",
    ],
    claims: [
      claim(
        "Somatosensation, spatial attention, left praxis, calculation, and body image are robust parietal lobe functions.",
        citationSets.cortex,
      ),
    ],
    disorders: [
      disorder(
        "hemineglect",
        "Right parietal injury robustly causes contralesional spatial neglect.",
        citationSets.cortex,
      ),
      disorder(
        "Gerstmann syndrome",
        "Left angular-region injury can produce acalculia, agraphia, finger agnosia, and left-right confusion.",
        citationSets.cortex,
      ),
      disorder(
        "Balint syndrome",
        "Bilateral parietal-occipital injury can cause simultanagnosia, optic ataxia, and ocular apraxia.",
        citationSets.cortex,
      ),
    ],
  }),
  makeStructure({
    id: "L1_LOBE_TEMPORAL",
    category: "lobe",
    english: "Temporal lobe",
    latin: "Lobus temporalis",
    abbreviations: ["TL"],
    color: "#f97316",
    citations: citationSets.cortex,
    boundaries:
      "Inferior to the lateral sulcus and extending from the temporal pole to posterior temporal association cortex.",
    subdivisions: [
      "superior temporal gyrus",
      "middle temporal gyrus",
      "inferior temporal gyrus",
      "fusiform gyrus",
      "parahippocampal gyrus",
      "hippocampus",
      "amygdala",
      "entorhinal cortex",
    ],
    claims: [
      claim(
        "Audition, left language comprehension, declarative memory, object recognition, and face processing are robust temporal lobe functions.",
        citationSets.cortex,
      ),
    ],
    disorders: [
      disorder(
        "Wernicke aphasia",
        "Left posterior superior temporal injury can impair language comprehension.",
        citationSets.cortex,
      ),
      disorder(
        "temporal lobe epilepsy",
        "Medial and lateral temporal structures are common seizure-network nodes.",
        citationSets.cortex,
      ),
    ],
  }),
  makeStructure({
    id: "L1_LOBE_OCCIPITAL",
    category: "lobe",
    english: "Occipital lobe",
    latin: "Lobus occipitalis",
    abbreviations: ["OL"],
    color: "#a855f7",
    citations: citationSets.cortex,
    boundaries:
      "Posterior cortical pole surrounding calcarine, cuneus, lingual, and lateral occipital visual territories.",
    subdivisions: [
      "V1 BA17",
      "V2 BA18",
      "V3/V4/V5 BA19",
      "cuneus",
      "lingual gyrus",
      "lateral occipital cortex",
    ],
    claims: [
      claim(
        "Vision is the defining robust function of the occipital lobe.",
        citationSets.cortex,
      ),
    ],
    disorders: [
      disorder(
        "cortical blindness",
        "Bilateral primary visual cortex injury causes cortical blindness.",
        citationSets.cortex,
      ),
      disorder(
        "prosopagnosia",
        "Ventral occipital-temporal injury can impair face recognition.",
        citationSets.cortex,
      ),
      disorder(
        "achromatopsia",
        "Ventral visual cortex injury can impair color perception.",
        citationSets.cortex,
      ),
    ],
  }),
  makeStructure({
    id: "L1_LOBE_INSULAR",
    category: "lobe",
    english: "Insular cortex",
    latin: "Lobus insularis",
    abbreviations: ["insula", "insula of Reil"],
    color: "#14b8a6",
    citations: citationSets.insula,
    boundaries:
      "Buried within the lateral sulcus beneath frontal, parietal, and temporal opercula.",
    subdivisions: ["anterior short gyri", "posterior long gyri"],
    claims: [
      claim(
        "Interoception, salience processing, taste, autonomic control, and pain affect are robust insular functions.",
        citationSets.insula,
      ),
    ],
    disorders: [
      disorder(
        "frontotemporal dementia salience-network dysfunction",
        "Anterior insula and cingulate vulnerability is prominent in salience-network degeneration.",
        citationSets.insula,
      ),
      disorder(
        "addiction",
        "Insular injury and activity can alter craving and addictive behavior.",
        citationSets.insula,
      ),
    ],
  }),
  makeStructure({
    id: "L1_LOBE_LIMBIC",
    category: "lobe",
    english: "Limbic lobe",
    latin: "Grand lobe limbique",
    abbreviations: ["limbic system view"],
    color: "#eab308",
    citations: citationSets.limbic,
    boundaries:
      "Medial cortical ring including cingulate, parahippocampal, and subcallosal territories.",
    subdivisions: [
      "cingulate gyrus",
      "parahippocampal gyrus",
      "subcallosal area",
    ],
    systemViewTier: Tier.PLAUSIBLE,
    note: "Broca's limbic lobe is shown as a toggleable system view. LeDoux argues against treating the limbic system as a unitary emotion center.",
    claims: [
      claim(
        "The limbic lobe is a useful system-level view for memory, autonomic, and affective circuits, but not a strict emotion-center lobe.",
        citationSets.limbic,
        Tier.PLAUSIBLE,
        "The anatomy is historically useful, while modern circuit evidence rejects a single limbic emotion center.",
        [citations.ledoux2012],
      ),
    ],
  }),
];

const gyri = [
  [
    "L1_GYRUS_PRECENTRAL",
    "Precentral gyrus",
    "Gyrus precentralis",
    ["PreCG", "M1"],
    { hcp_mmp1: "4", brodmann: 4, dk: "precentral gyrus" },
    "primary motor execution and corticospinal output",
  ],
  [
    "L1_GYRUS_POSTCENTRAL",
    "Postcentral gyrus",
    "Gyrus postcentralis",
    ["PostCG", "S1"],
    { brodmann: 3, dk: "postcentral gyrus" },
    "primary somatosensory representation",
  ],
  [
    "L1_GYRUS_SUPERIOR_FRONTAL",
    "Superior frontal gyrus",
    "Gyrus frontalis superior",
    ["SFG"],
    { brodmann: 9, dk: "superior frontal gyrus" },
    "executive and medial frontal association functions",
  ],
  [
    "L1_GYRUS_MIDDLE_FRONTAL",
    "Middle frontal gyrus",
    "Gyrus frontalis medius",
    ["MFG", "dlPFC"],
    { brodmann: 46, dk: "rostral middle frontal" },
    "working memory and cognitive control",
  ],
  [
    "L1_GYRUS_INFERIOR_FRONTAL",
    "Inferior frontal gyrus",
    "Gyrus frontalis inferior",
    ["IFG", "BA44/45"],
    { hcp_mmp1: "44", brodmann: 44, dk: "pars opercularis" },
    "language production and response control",
  ],
  [
    "L1_GYRUS_SUPERIOR_TEMPORAL",
    "Superior temporal gyrus",
    "Gyrus temporalis superior",
    ["STG"],
    { brodmann: 22, dk: "superior temporal gyrus" },
    "auditory and language comprehension processing",
  ],
  [
    "L1_GYRUS_MIDDLE_TEMPORAL",
    "Middle temporal gyrus",
    "Gyrus temporalis medius",
    ["MTG"],
    { brodmann: 21, dk: "middle temporal gyrus" },
    "semantic and lateral temporal association processing",
  ],
  [
    "L1_GYRUS_INFERIOR_TEMPORAL",
    "Inferior temporal gyrus",
    "Gyrus temporalis inferior",
    ["ITG"],
    { brodmann: 20, dk: "inferior temporal gyrus" },
    "ventral-stream object recognition",
  ],
  [
    "L1_GYRUS_SUPERIOR_PARIETAL",
    "Superior parietal lobule",
    "Lobulus parietalis superior",
    ["SPL", "BA5/7"],
    { brodmann: 7, dk: "superior parietal" },
    "sensorimotor integration and spatial attention",
  ],
  [
    "L1_GYRUS_INFERIOR_PARIETAL",
    "Inferior parietal lobule",
    "Lobulus parietalis inferior",
    ["IPL", "BA39/40"],
    { brodmann: 40, dk: "inferior parietal" },
    "multimodal association, praxis, and attention",
  ],
  [
    "L1_GYRUS_SUPRAMARGINAL",
    "Supramarginal gyrus",
    "Gyrus supramarginalis",
    ["SMG", "BA40"],
    { brodmann: 40, dk: "supramarginal gyrus" },
    "phonological, praxis, and sensorimotor association",
  ],
  [
    "L1_GYRUS_ANGULAR",
    "Angular gyrus",
    "Gyrus angularis",
    ["AG", "BA39"],
    { brodmann: 39, dk: "angular gyrus" },
    "semantic integration, calculation, and default-mode association",
  ],
  [
    "L1_GYRUS_LINGUAL",
    "Lingual gyrus",
    "Gyrus lingualis",
    ["LG"],
    { brodmann: 18, dk: "lingual gyrus" },
    "visual association and scene/color processing",
  ],
  [
    "L1_GYRUS_FUSIFORM",
    "Fusiform gyrus",
    "Gyrus fusiformis",
    ["FG", "FFA", "VWFA", "PPA"],
    { brodmann: 37, dk: "fusiform gyrus" },
    "face, word-form, place, and object-sensitive ventral visual processing",
  ],
  [
    "L1_GYRUS_PARAHIPPOCAMPAL",
    "Parahippocampal gyrus",
    "Gyrus parahippocampalis",
    ["PHG", "BA27/28/35/36"],
    { brodmann: 35, dk: "parahippocampal gyrus" },
    "scene memory and medial temporal contextual processing",
  ],
  [
    "L1_GYRUS_ENTORHINAL",
    "Entorhinal cortex",
    "Cortex entorhinalis",
    ["EC", "BA28"],
    { brodmann: 28, dk: "entorhinal cortex" },
    "hippocampal input-output gateway for declarative memory",
  ],
  [
    "L1_GYRUS_ANTERIOR_CINGULATE",
    "Anterior cingulate cortex",
    "Cortex cingularis anterior",
    ["ACC"],
    { brodmann: 24, dk: "rostral anterior cingulate" },
    "conflict, motivation, pain affect, and salience control",
  ],
  [
    "L1_GYRUS_POSTERIOR_CINGULATE",
    "Posterior cingulate cortex",
    "Cortex cingularis posterior",
    ["PCC"],
    { brodmann: 23, dk: "posterior cingulate" },
    "default-mode, memory, and internally oriented cognition",
  ],
  [
    "L1_GYRUS_ISTHMUS_CINGULATE",
    "Isthmus cingulate cortex",
    "Isthmus gyri cinguli",
    ["isthmus"],
    { brodmann: 29, dk: "isthmus cingulate" },
    "retrosplenial and medial memory-network integration",
  ],
  [
    "L1_GYRUS_PRECUNEUS",
    "Precuneus",
    "Precuneus",
    ["PCu"],
    { brodmann: 7, dk: "precuneus" },
    "visuospatial imagery, self-related processing, and default-mode integration",
  ],
  [
    "L1_GYRUS_CUNEUS",
    "Cuneus",
    "Cuneus",
    ["Cu"],
    { brodmann: 17, dk: "cuneus" },
    "dorsal visual field processing",
  ],
  [
    "L1_GYRUS_LATERAL_OCCIPITAL",
    "Lateral occipital cortex",
    "Cortex occipitalis lateralis",
    ["LOC"],
    { brodmann: 19, dk: "lateral occipital" },
    "object-sensitive visual association processing",
  ],
  [
    "L1_GYRUS_PERICALCARINE",
    "Pericalcarine cortex",
    "Cortex pericalcarinus",
    ["V1", "BA17"],
    { brodmann: 17, dk: "pericalcarine cortex" },
    "primary visual cortex along the calcarine sulcus",
  ],
  [
    "L1_GYRUS_PARACENTRAL",
    "Paracentral lobule",
    "Lobulus paracentralis",
    ["PCL"],
    { brodmann: 4, dk: "paracentral lobule" },
    "medial leg motor and sensory representation",
  ],
  [
    "L1_GYRUS_INSULAR_SHORT",
    "Short insular gyri",
    "Gyri breves insulae",
    ["anterior insula"],
    {},
    "anterior insular salience and interoceptive processing",
  ],
  [
    "L1_GYRUS_INSULAR_LONG",
    "Long insular gyri",
    "Gyri longi insulae",
    ["posterior insula"],
    {},
    "posterior insular somatic, vestibular, and visceral processing",
  ],
  [
    "L1_GYRUS_FRONTAL_POLE",
    "Frontal pole",
    "Polus frontalis",
    ["FP", "BA10"],
    { brodmann: 10, dk: "frontal pole" },
    "prospective, relational, and high-level control processing",
  ],
  [
    "L1_GYRUS_TEMPORAL_POLE",
    "Temporal pole",
    "Polus temporalis",
    ["TP", "BA38"],
    { brodmann: 38, dk: "temporal pole" },
    "social-semantic and anterior temporal memory association",
  ],
].map(([id, english, latin, abbreviations, atlas, role]) =>
  makeStructure({
    id,
    category: "gyrus",
    english,
    latin,
    abbreviations,
    atlas,
    citations:
      english.includes("Frontal") || english.includes("frontal")
        ? citationSets.frontal
        : citationSets.cortex,
    role,
    parent: atlas.dk?.includes("cingulate") ? "L1_LOBE_LIMBIC" : undefined,
    crosswalks:
      id === "L1_GYRUS_PRECENTRAL"
        ? [
            {
              source_atlas: "Desikan-Killiany",
              source_label: "precentral gyrus",
              target_atlas: "Brodmann",
              target_label: "BA4",
              confidence: Tier.ROBUST,
              citation: citations.desikan2006,
            },
            {
              source_atlas: "Desikan-Killiany",
              source_label: "precentral gyrus",
              target_atlas: "HCP-MMP1",
              target_label: "4",
              confidence: Tier.ROBUST,
              citation: citations.glasser2016,
            },
          ]
        : [],
  }),
);

const sulci = [
  [
    "L1_SULCUS_CENTRAL",
    "Central sulcus",
    "Sulcus centralis",
    ["Rolando"],
    "Boundary between M1 precentral and S1 postcentral cortex.",
  ],
  [
    "L1_SULCUS_LATERAL",
    "Lateral sulcus",
    "Sulcus lateralis",
    ["Sylvian fissure"],
    "Separates frontal/parietal opercula from temporal cortex and contains the insula.",
  ],
  [
    "L1_SULCUS_PARIETO_OCCIPITAL",
    "Parieto-occipital sulcus",
    "Sulcus parietooccipitalis",
    ["POS"],
    "Medial boundary between parietal and occipital lobes.",
  ],
  [
    "L1_SULCUS_CALCARINE",
    "Calcarine sulcus",
    "Sulcus calcarinus",
    ["V1 sulcus"],
    "Primary visual cortex is concentrated along the calcarine banks.",
  ],
  [
    "L1_SULCUS_CINGULATE",
    "Cingulate sulcus",
    "Sulcus cinguli",
    ["CiS"],
    "Superior boundary landmark for cingulate cortex.",
  ],
  [
    "L1_SULCUS_COLLATERAL",
    "Collateral sulcus",
    "Sulcus collateralis",
    ["CoS"],
    "Ventral temporal landmark near fusiform and parahippocampal cortex.",
  ],
  [
    "L1_SULCUS_RHINAL",
    "Rhinal sulcus",
    "Sulcus rhinalis",
    ["RS"],
    "Medial temporal landmark adjacent to entorhinal and perirhinal cortex.",
  ],
  [
    "L1_SULCUS_SUPERIOR_TEMPORAL",
    "Superior temporal sulcus",
    "Sulcus temporalis superior",
    ["STS"],
    "Multisensory and social-perceptual lateral temporal association landmark.",
  ],
  [
    "L1_SULCUS_INFERIOR_TEMPORAL",
    "Inferior temporal sulcus",
    "Sulcus temporalis inferior",
    ["ITS"],
    "Boundary between middle and inferior temporal gyri.",
  ],
  [
    "L1_SULCUS_INTRAPARIETAL",
    "Intraparietal sulcus",
    "Sulcus intraparietalis",
    ["IPS", "DAN"],
    "Dorsal attention and visuomotor association landmark.",
  ],
  [
    "L1_SULCUS_SUPERIOR_FRONTAL",
    "Superior frontal sulcus",
    "Sulcus frontalis superior",
    ["SFS"],
    "Boundary between superior and middle frontal gyri.",
  ],
  [
    "L1_SULCUS_INFERIOR_FRONTAL",
    "Inferior frontal sulcus",
    "Sulcus frontalis inferior",
    ["IFS"],
    "Boundary between middle and inferior frontal gyri.",
  ],
  [
    "L1_SULCUS_OLFACTORY",
    "Olfactory sulcus",
    "Sulcus olfactorius",
    ["OlfS"],
    "Orbital frontal groove carrying the olfactory tract.",
  ],
  [
    "L1_SULCUS_ORBITAL",
    "Orbital sulci",
    "Sulci orbitales",
    ["H-shaped orbital sulci"],
    "H-shaped sulcal complex partitioning orbital frontal cortex.",
  ],
].map(([id, english, latin, abbreviations, role]) =>
  makeStructure({
    id,
    category: "sulcus",
    english,
    latin,
    abbreviations,
    citations: citationSets.sulcus,
    role,
    fmri: ["anatomical landmarking", "surface registration"],
  }),
);

const basalGanglia = [
  makeStructure({
    id: "L1_BG_CAUDATE",
    category: "basal ganglia",
    english: "Caudate nucleus",
    latin: "Nucleus caudatus",
    abbreviations: ["Cd"],
    citations: citationSets.basalGanglia,
    subdivisions: ["head associative", "body sensorimotor", "tail limbic"],
    claims: [
      claim(
        "Cognitive and executive striatal loops support goal-directed behavior.",
        citationSets.basalGanglia,
      ),
    ],
    disorders: [
      disorder(
        "Huntington disease",
        "Dorsomedial caudate vulnerability is a classic early basal-ganglia pattern.",
        citationSets.basalGanglia,
      ),
      disorder(
        "obsessive-compulsive disorder",
        "Caudate head and cortico-striatal loops are implicated in OCD.",
        citationSets.basalGanglia,
      ),
    ],
  }),
  makeStructure({
    id: "L1_BG_PUTAMEN",
    category: "basal ganglia",
    english: "Putamen",
    latin: "Putamen",
    abbreviations: ["Put"],
    citations: citationSets.basalGanglia,
    subdivisions: ["sensorimotor striatum"],
    claims: [
      claim(
        "The putamen is the sensorimotor striatum for motor learning and habit formation.",
        citationSets.basalGanglia,
      ),
    ],
    disorders: [
      disorder(
        "Parkinson disease",
        "Dopamine depletion disrupts putaminal sensorimotor loops.",
        citationSets.basalGanglia,
      ),
      disorder(
        "Huntington disease",
        "Putaminal degeneration contributes to motor signs.",
        citationSets.basalGanglia,
      ),
    ],
  }),
  makeStructure({
    id: "L1_BG_NUCLEUS_ACCUMBENS",
    category: "basal ganglia",
    english: "Nucleus accumbens",
    latin: "Nucleus accumbens",
    abbreviations: ["NAcc", "Acb"],
    citations: citationSets.basalGanglia,
    subdivisions: ["core", "shell"],
    claims: [
      claim(
        "Reward, motivation, and addiction are robust nucleus accumbens functions.",
        citationSets.basalGanglia,
      ),
    ],
    disorders: [
      disorder(
        "addiction",
        "NAcc core and shell participate in reward learning and cue-driven motivation.",
        citationSets.basalGanglia,
      ),
      disorder(
        "major depressive disorder",
        "Anhedonia is linked to ventral striatal reward dysfunction.",
        citationSets.basalGanglia,
      ),
    ],
  }),
  makeStructure({
    id: "L1_BG_GPE",
    category: "basal ganglia",
    english: "Globus pallidus externus",
    latin: "Globus pallidus externus",
    abbreviations: ["GPe"],
    citations: citationSets.basalGanglia,
    subdivisions: ["central zone czGPe", "peripheral zone pzGPe"],
    claims: [
      claim(
        "The GPe is a robust indirect-pathway hub in basal ganglia action selection.",
        citationSets.basalGanglia,
      ),
      claim(
        "NEW: Lazaridis 2024 identifies czGPe and pzGPe organization supporting a striosomal indirect pathway.",
        citationSets.basalGanglia,
      ),
    ],
    tags: ["NEW", "czGPe", "pzGPe"],
  }),
  makeStructure({
    id: "L1_BG_GPI",
    category: "basal ganglia",
    english: "Globus pallidus internus",
    latin: "Globus pallidus internus",
    abbreviations: ["GPi"],
    citations: citationSets.basalGanglia,
    subdivisions: ["GABAergic output to VA/VL thalamus"],
    claims: [
      claim(
        "GPi is a main inhibitory basal-ganglia output nucleus to VA/VL thalamus.",
        citationSets.basalGanglia,
      ),
    ],
    disorders: [
      disorder(
        "Parkinson disease",
        "Indirect-pathway imbalance over-activates GPi output in Parkinsonian models.",
        citationSets.basalGanglia,
      ),
      disorder(
        "dystonia",
        "GPi deep brain stimulation is an established target for dystonia.",
        citationSets.basalGanglia,
      ),
    ],
  }),
  makeStructure({
    id: "L1_BG_SUBSTANTIA_NIGRA",
    category: "basal ganglia",
    english: "Substantia nigra",
    latin: "Substantia nigra",
    abbreviations: ["SN", "SNc", "SNr"],
    citations: citationSets.basalGanglia,
    subdivisions: [
      "pars compacta A9 dopaminergic",
      "pars reticulata GABAergic output",
    ],
    claims: [
      claim(
        "SNc dopaminergic neurons modulate striatum, while SNr is an inhibitory output homolog of GPi.",
        citationSets.basalGanglia,
      ),
    ],
    disorders: [
      disorder(
        "Parkinson disease",
        "Motor symptoms appear after substantial SNc dopaminergic neuron loss.",
        citationSets.basalGanglia,
      ),
    ],
  }),
  makeStructure({
    id: "L1_BG_STN",
    category: "basal ganglia",
    english: "Subthalamic nucleus",
    latin: "Nucleus subthalamicus",
    abbreviations: ["STN"],
    citations: citationSets.basalGanglia,
    subdivisions: ["indirect pathway node", "hyperdirect cortical input node"],
    claims: [
      claim(
        "The STN participates in indirect and hyperdirect pathways and is a strong-evidence DBS target for Parkinson disease.",
        citationSets.basalGanglia,
      ),
    ],
    disorders: [
      disorder(
        "Parkinson disease",
        "STN deep brain stimulation is an established treatment target for selected Parkinson disease patients.",
        citationSets.basalGanglia,
      ),
    ],
  }),
  makeStructure({
    id: "L1_BG_VENTRAL_PALLIDUM",
    category: "basal ganglia",
    english: "Ventral pallidum",
    latin: "Pallidum ventrale",
    abbreviations: ["VP"],
    citations: citationSets.basalGanglia,
    subdivisions: ["limbic pallidal output of nucleus accumbens"],
    claims: [
      claim(
        "Ventral pallidum is a limbic basal-ganglia output structure downstream of nucleus accumbens.",
        citationSets.basalGanglia,
      ),
    ],
  }),
];

const diencephalon = [
  [
    "L1_DIENCEPHALON_THALAMUS",
    "Thalamus",
    "Thalamus",
    ["THA"],
    "top-level diencephalic relay and integrative hub pointing to 60 nuclei",
    ["60 thalamic nuclei scaffold"],
  ],
  [
    "L1_DIENCEPHALON_HYPOTHALAMUS",
    "Hypothalamus",
    "Hypothalamus",
    ["HY"],
    "homeostatic, endocrine, autonomic, and motivated-behavior control",
    ["9+ hypothalamic nuclei scaffold"],
  ],
  [
    "L1_DIENCEPHALON_EPITHALAMUS",
    "Epithalamus",
    "Epithalamus",
    ["EpiTh"],
    "pineal and habenular diencephalic territory",
    ["pineal gland", "habenula"],
  ],
  [
    "L1_DIENCEPHALON_PINEAL",
    "Pineal gland",
    "Glandula pinealis",
    ["pineal"],
    "melatonin and circadian endocrine signaling",
    ["melatonin", "circadian"],
  ],
  [
    "L1_DIENCEPHALON_HABENULA",
    "Habenula",
    "Habenula",
    ["Hb", "LHb", "MHb"],
    "medial and lateral habenular regulation of aversion and anti-reward signaling",
    ["medial habenula", "lateral habenula anti-reward"],
  ],
  [
    "L1_DIENCEPHALON_SUBTHALAMUS",
    "Subthalamus",
    "Subthalamus",
    ["STh"],
    "subthalamic territory including STN, zona incerta, and fields of Forel",
    ["STN", "zona incerta", "fields of Forel"],
  ],
  [
    "L1_DIENCEPHALON_ZONA_INCERTA",
    "Zona incerta",
    "Zona incerta",
    ["ZI"],
    "subthalamic modulatory and sensorimotor integration zone",
    [],
  ],
  [
    "L1_DIENCEPHALON_FIELDS_FOREL",
    "Fields of Forel",
    "Campi Foreli",
    ["H fields"],
    "fiber fields linking pallidal, thalamic, and subthalamic systems",
    [],
  ],
].map(([id, english, latin, abbreviations, role, subdivisions]) =>
  makeStructure({
    id,
    category: "diencephalon",
    english,
    latin,
    abbreviations,
    subdivisions,
    citations: citationSets.diencephalon,
    role,
  }),
);

const cerebellum = [
  [
    "L1_CEREBELLUM_ANTERIOR_LOBE",
    "Anterior cerebellar lobe",
    "Lobus anterior cerebelli",
    ["lobules I-V"],
    "vermis I-V, paravermis, and hemispheric motor cerebellar territories",
  ],
  [
    "L1_CEREBELLUM_POSTERIOR_LOBE",
    "Posterior cerebellar lobe",
    "Lobus posterior cerebelli",
    ["Crus I/II"],
    "vermis VI-IX and hemispheric cognitive cerebellar territories including Crus I/II",
  ],
  [
    "L1_CEREBELLUM_FLOCCULONODULAR",
    "Flocculonodular lobe",
    "Lobus flocculonodularis",
    ["lobule X"],
    "vestibulocerebellar control through nodulus and flocculus",
  ],
  [
    "L1_CEREBELLUM_DENTATE",
    "Dentate nucleus",
    "Nucleus dentatus",
    ["DN"],
    "cerebellar output to thalamus and prefrontal-cognitive loops",
  ],
  [
    "L1_CEREBELLUM_INTERPOSED",
    "Interposed nuclei",
    "Nuclei interpositi",
    ["globose", "emboliform"],
    "intermediate cerebellar output for limb and motor coordination",
  ],
  [
    "L1_CEREBELLUM_FASTIGIAL",
    "Fastigial nucleus",
    "Nucleus fastigii",
    ["FN"],
    "medial cerebellar output for vestibular, axial, ocular, and autonomic control",
  ],
  [
    "L1_CEREBELLUM_MOLECULAR_LAYER",
    "Cerebellar molecular layer",
    "Stratum moleculare cerebelli",
    ["ML"],
    "parallel fiber, interneuron, and Purkinje dendritic integration",
  ],
  [
    "L1_CEREBELLUM_PURKINJE_LAYER",
    "Purkinje cell layer",
    "Stratum purkinjense",
    ["PCL"],
    "sole GABAergic output of cerebellar cortex",
  ],
  [
    "L1_CEREBELLUM_GRANULAR_LAYER",
    "Cerebellar granular layer",
    "Stratum granulosum cerebelli",
    ["GL"],
    "granule-cell input expansion with the most numerous neuron type",
  ],
  [
    "L1_CEREBELLUM_VERMIS",
    "Cerebellar vermis",
    "Vermis cerebelli",
    ["vermis"],
    "midline cerebellar motor, vestibular, and affective-autonomic integration",
  ],
].map(([id, english, latin, abbreviations, role]) =>
  makeStructure({
    id,
    category: "cerebellum",
    english,
    latin,
    abbreviations,
    citations: citationSets.cerebellum,
    role,
    claims:
      english === "Posterior cerebellar lobe"
        ? [
            claim(
              "Crus I/II and posterior cerebellar territories participate in cognitive cerebellar loops.",
              citationSets.cerebellum,
            ),
            claim(
              "Cerebellar Cognitive Affective/Schmahmann Syndrome can follow posterior cerebellar injury.",
              citationSets.cerebellum,
            ),
          ]
        : undefined,
    disorders:
      english === "Posterior cerebellar lobe"
        ? [
            disorder(
              "Cerebellar Cognitive Affective/Schmahmann Syndrome",
              "Executive, linguistic, spatial, and affective symptoms are prominent enough to be surfaced on the cerebellum page.",
              citationSets.cerebellum,
              0.7,
            ),
          ]
        : [],
  }),
);

const brainstem = [
  [
    "L1_BRAINSTEM_MIDBRAIN",
    "Midbrain",
    "Mesencephalon",
    ["tectum", "tegmentum"],
    "tectum, tegmentum, cerebral peduncles, red nucleus, substantia nigra, PAG columns, and VTA A10",
  ],
  [
    "L1_BRAINSTEM_PONS",
    "Pons",
    "Pons",
    ["basis pontis"],
    "basis pontis and pontine tegmentum including LC A6, parabrachial nucleus, PPN, and LDT",
  ],
  [
    "L1_BRAINSTEM_MEDULLA",
    "Medulla oblongata",
    "Medulla oblongata",
    ["medulla"],
    "pyramids, inferior olive, NTS, dorsal motor vagus, hypoglossal, raphe, ambiguus, gracile, and cuneate nuclei",
  ],
].map(([id, english, latin, abbreviations, role]) =>
  makeStructure({
    id,
    category: "brainstem",
    english,
    latin,
    abbreviations,
    citations: citationSets.brainstem,
    role,
  }),
);

const ventricles = [
  [
    "L1_VENT_LATERAL_ANTERIOR_HORN",
    "Lateral ventricle anterior horn",
    "Cornu anterius ventriculi lateralis",
    ["frontal horn"],
    "frontal extension of the lateral ventricle",
  ],
  [
    "L1_VENT_LATERAL_BODY",
    "Lateral ventricle body",
    "Pars centralis ventriculi lateralis",
    ["body"],
    "central lateral ventricular compartment",
  ],
  [
    "L1_VENT_LATERAL_ATRIUM",
    "Lateral ventricle atrium",
    "Atrium ventriculi lateralis",
    ["trigone"],
    "junction of body, occipital horn, and temporal horn",
  ],
  [
    "L1_VENT_LATERAL_OCCIPITAL_HORN",
    "Lateral ventricle occipital horn",
    "Cornu posterius ventriculi lateralis",
    ["occipital horn"],
    "posterior extension into occipital lobe",
  ],
  [
    "L1_VENT_LATERAL_TEMPORAL_HORN",
    "Lateral ventricle temporal horn",
    "Cornu inferius ventriculi lateralis",
    ["temporal horn"],
    "inferior extension into temporal lobe",
  ],
  [
    "L1_VENT_FORAMEN_MONRO",
    "Foramen of Monro",
    "Foramen interventriculare",
    ["interventricular foramen"],
    "CSF channel from lateral ventricles to third ventricle",
  ],
  [
    "L1_VENT_THIRD",
    "Third ventricle",
    "Ventriculus tertius",
    ["3V"],
    "midline diencephalic CSF cavity",
  ],
  [
    "L1_VENT_CEREBRAL_AQUEDUCT",
    "Cerebral aqueduct",
    "Aqueductus mesencephali",
    ["Sylvian aqueduct"],
    "narrow midbrain channel from third to fourth ventricle",
  ],
  [
    "L1_VENT_FOURTH",
    "Fourth ventricle",
    "Ventriculus quartus",
    ["4V"],
    "hindbrain CSF cavity between pons/medulla and cerebellum",
  ],
  [
    "L1_VENT_LUSCHKA",
    "Foramina of Luschka",
    "Aperturae laterales ventriculi quarti",
    ["lateral apertures"],
    "lateral fourth-ventricle outlets to subarachnoid space",
  ],
  [
    "L1_VENT_MAGENDIE",
    "Foramen of Magendie",
    "Apertura mediana ventriculi quarti",
    ["median aperture"],
    "midline fourth-ventricle outlet to cisterna magna",
  ],
  [
    "L1_VENT_CENTRAL_CANAL",
    "Central canal",
    "Canalis centralis",
    ["spinal canal"],
    "caudal continuation of ventricular CSF space",
  ],
  [
    "L1_VENT_CHOROID_PLEXUS",
    "Choroid plexus",
    "Plexus choroideus",
    ["CP"],
    "CSF production, approximately 500 mL/day in adults per Damkier 2013",
  ],
  [
    "L1_VENT_SUBARACHNOID_SPACE",
    "Subarachnoid space and cisterns",
    "Spatium subarachnoideum",
    ["cisterns"],
    "CSF circulation space around brain and spinal cord",
  ],
].map(([id, english, latin, abbreviations, role]) =>
  makeStructure({
    id,
    category: "ventricle",
    english,
    latin,
    abbreviations,
    citations: citationSets.ventricular,
    role,
    t1: `${english} is rendered as part of the cyan ventricular-system volume in the 3D viewer scaffold.`,
  }),
);

const whiteMatter = [
  [
    "L1_WM_CC_ROSTRUM",
    "Corpus callosum rostrum",
    "Rostrum corporis callosi",
    ["CC rostrum"],
    "orbitofrontal and inferior prefrontal commissural fibers",
  ],
  [
    "L1_WM_CC_GENU",
    "Corpus callosum genu",
    "Genu corporis callosi",
    ["genu"],
    "prefrontal commissural fibers",
  ],
  [
    "L1_WM_CC_ANTERIOR_BODY",
    "Corpus callosum anterior body",
    "Corpus anterius corporis callosi",
    ["CC anterior body"],
    "premotor and supplementary motor commissural fibers",
  ],
  [
    "L1_WM_CC_MID_BODY",
    "Corpus callosum mid-body",
    "Corpus medium corporis callosi",
    ["CC mid-body"],
    "motor commissural fibers",
  ],
  [
    "L1_WM_CC_POSTERIOR_BODY",
    "Corpus callosum posterior body",
    "Corpus posterius corporis callosi",
    ["CC posterior body"],
    "somatosensory commissural fibers",
  ],
  [
    "L1_WM_CC_ISTHMUS",
    "Corpus callosum isthmus",
    "Isthmus corporis callosi",
    ["CC isthmus"],
    "auditory and posterior temporal commissural fibers",
  ],
  [
    "L1_WM_CC_SPLENIUM",
    "Corpus callosum splenium",
    "Splenium corporis callosi",
    ["splenium"],
    "parietal, temporal, and occipital commissural fibers",
  ],
  [
    "L1_WM_ANTERIOR_COMMISSURE",
    "Anterior commissure",
    "Commissura anterior",
    ["AC"],
    "olfactory and temporal commissural limbs",
  ],
  [
    "L1_WM_POSTERIOR_COMMISSURE",
    "Posterior commissure",
    "Commissura posterior",
    ["PC"],
    "pupillary light reflex and pretectal commissural pathway",
  ],
  [
    "L1_WM_HIPPOCAMPAL_COMMISSURE",
    "Hippocampal commissure",
    "Commissura fornicis",
    ["psalterium"],
    "interhippocampal commissural fibers",
  ],
  [
    "L1_WM_INTERNAL_CAPSULE_ANTERIOR",
    "Internal capsule anterior limb",
    "Crus anterius capsulae internae",
    ["ALIC"],
    "frontopontine and thalamocortical association projections",
  ],
  [
    "L1_WM_INTERNAL_CAPSULE_GENU",
    "Internal capsule genu",
    "Genu capsulae internae",
    ["IC genu"],
    "corticobulbar projection fibers",
  ],
  [
    "L1_WM_INTERNAL_CAPSULE_POSTERIOR",
    "Internal capsule posterior limb",
    "Crus posterius capsulae internae",
    ["PLIC"],
    "corticospinal and somatosensory projection fibers",
  ],
  [
    "L1_WM_INTERNAL_CAPSULE_RETROLENTICULAR",
    "Retrolenticular internal capsule",
    "Pars retrolenticularis capsulae internae",
    ["RLIC"],
    "optic and posterior thalamic radiations",
  ],
  [
    "L1_WM_INTERNAL_CAPSULE_SUBLENTICULAR",
    "Sublenticular internal capsule",
    "Pars sublenticularis capsulae internae",
    ["SLIC"],
    "optic radiation and auditory radiation course",
  ],
  [
    "L1_WM_EXTERNAL_CAPSULE",
    "External capsule",
    "Capsula externa",
    ["ECap"],
    "association fibers lateral to putamen",
  ],
  [
    "L1_WM_EXTREME_CAPSULE",
    "Extreme capsule",
    "Capsula extrema",
    ["EmC"],
    "frontotemporal association pathway deep to insula",
  ],
  [
    "L1_WM_FORNIX",
    "Fornix",
    "Fornix",
    ["Fx"],
    "hippocampal output tract to septal and mammillary targets",
  ],
].map(([id, english, latin, abbreviations, role]) =>
  makeStructure({
    id,
    category: "white matter",
    english,
    latin,
    abbreviations,
    citations: citationSets.whiteMatter,
    role,
  }),
);

const structures = [
  ...lobes,
  ...gyri,
  ...sulci,
  ...basalGanglia,
  ...diencephalon,
  ...cerebellum,
  ...brainstem,
  ...ventricles,
  ...whiteMatter,
];

await rm(CONTENT_ROOT, { recursive: true, force: true });
await mkdir(CONTENT_ROOT, { recursive: true });
await mkdir(dirname(JSON_PATH), { recursive: true });

const data = structures.map((entry) => entry.data);
const ids = new Set(data.map((entry) => entry.structure_id));
if (ids.size !== data.length) {
  throw new Error("Duplicate structure_id detected in Phase 2 Level 1 data.");
}

for (const entry of structures) {
  const slug = slugify(entry.data.names.english);
  const filePath = join(CONTENT_ROOT, entry.folder, `${slug}.yaml`);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(
    filePath,
    YAML.stringify(entry.data, {
      lineWidth: 110,
      aliasDuplicateObjects: false,
    }),
    "utf8",
  );
}

await writeFile(JSON_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Generated ${data.length} Level 1 macroanatomy entries.`);
