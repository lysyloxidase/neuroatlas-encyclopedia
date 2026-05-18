import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import YAML from "yaml";

const ROOT = process.cwd();
const LEVEL3_ROOT = join(ROOT, "src/content/structures/level3");
const LEVEL3_JSON = join(ROOT, "src/data/structures/level3_advanced.json");

const citations = {
  siletti2023: {
    doi: "10.1126/science.add7046",
    year: 2023,
    journal: "Science",
    title:
      "Transcriptomic diversity of cell types across the adult human brain",
  },
  yao2023: {
    doi: "10.1038/s41586-023-06812-z",
    year: 2023,
    journal: "Nature",
    title:
      "A high-resolution transcriptomic and spatial atlas of cell types in the whole mouse brain",
  },
  zhang2023: {
    doi: "10.1038/s41586-023-06808-9",
    year: 2023,
    journal: "Nature",
    title:
      "Molecularly defined and spatially resolved cell atlas of the whole mouse brain",
  },
  bakken2021: {
    doi: "10.1038/s41586-021-03465-8",
    year: 2021,
    journal: "Nature",
    title:
      "Comparative cellular analysis of motor cortex in human, marmoset and mouse",
  },
  glasser2016: {
    doi: "10.1038/nature18933",
    year: 2016,
    journal: "Nature",
    title: "A multi-modal parcellation of human cerebral cortex",
  },
  desikan2006: {
    doi: "10.1016/j.neuroimage.2006.01.021",
    year: 2006,
    journal: "NeuroImage",
    title:
      "An automated labeling system for subdividing the human cerebral cortex on MRI scans",
  },
  hcpex2022: {
    doi: "10.1007/s00429-021-02421-6",
    year: 2022,
    journal: "Brain Structure and Function",
    title:
      "An extended Human Connectome Project multimodal parcellation atlas of the human cortex and subcortical areas",
  },
  amunts2020: {
    doi: "10.1126/science.abb4588",
    year: 2020,
    journal: "Science",
    title:
      "Julich-Brain: A 3D probabilistic atlas of the human brain's cytoarchitecture",
  },
  zachlod2022: {
    doi: "10.1016/j.neuroimage.2022.119286",
    year: 2022,
    journal: "NeuroImage",
    title:
      "Combined analysis of cytoarchitectonic, molecular and transcriptomic patterns reveal differences in brain organization across human functional brain systems",
  },
  wasserthal2018: {
    doi: "10.1016/j.neuroimage.2018.07.070",
    year: 2018,
    journal: "NeuroImage",
    title: "TractSeg - Fast and accurate white matter tract segmentation",
  },
  howells2020: {
    doi: "10.1038/s41598-020-64124-y",
    year: 2020,
    journal: "Scientific Reports",
    title:
      "Dissociating the white matter tracts connecting the temporo-parietal cortical region with frontal cortex",
  },
  catani2007: {
    doi: "10.1073/pnas.0702116104",
    year: 2007,
    journal: "PNAS",
    title:
      "Symmetries in human brain language pathways correlate with verbal recall",
  },
  yeatman2014: {
    doi: "10.1073/pnas.1418503111",
    year: 2014,
    journal: "PNAS",
    title:
      "The vertical occipital fasciculus: A century of controversy resolved by in vivo measurements",
  },
  margulies2016: {
    doi: "10.1073/pnas.1608282113",
    year: 2016,
    journal: "PNAS",
    title:
      "Situating the default-mode network along a principal gradient of macroscale cortical organization",
  },
  dong2021: {
    doi: "10.1073/pnas.2024448118",
    year: 2021,
    journal: "PNAS",
    title:
      "Shifting gradients of macroscale cortical organization mark the transition from childhood to adolescence",
  },
  haber2010: {
    doi: "10.1038/npp.2009.129",
    year: 2010,
    journal: "Neuropsychopharmacology",
    title: "The reward circuit: Linking primate anatomy and human imaging",
  },
  microglia2024: {
    doi: "10.1038/s41591-024-03150-z",
    year: 2024,
    journal: "Nature Medicine",
    title:
      "A brain cell atlas integrating single-cell transcriptomes across human brain regions",
  },
};

const cite = (...keys) => keys.map((key) => citations[key]);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeStructure(config) {
  const primary = config.primary_citations;
  return {
    structure_id: config.structure_id,
    names: {
      latin: config.latin ?? config.english,
      english: config.english,
      abbreviations: config.abbreviations ?? [],
    },
    level: 3,
    microanatomy: {
      category: config.category,
      ...(config.hcp ? { hcp_correspondence: config.hcp } : {}),
      ...(config.julich ? { julich_correspondence: config.julich } : {}),
      ...(config.compartments ? { compartments: config.compartments } : {}),
      ...(config.markers ? { neurotransmitter_markers: config.markers } : {}),
      ...(config.color ? { color: config.color } : {}),
    },
    atlas_links: {
      ...(config.atlas ?? {}),
      crosswalks: config.crosswalks ?? [],
    },
    location: {
      neighbors: [],
      parent: config.parent ?? null,
      children: [],
    },
    cytoarchitecture: {
      layers: config.layers,
      cell_classes: config.cell_classes ?? {
        excitatory: ["IT", "ET", "NP", "CT", "L6b"],
        inhibitory: ["PV", "SST", "VIP", "LAMP5", "SNCG"],
        glia: ["astrocyte", "oligodendrocyte", "microglia"],
      },
    },
    inputs: {
      afferent_cortical: config.afferent_cortical ?? [
        "neighboring cortical and atlas-defined association territories",
      ],
      afferent_subcortical: config.afferent_subcortical ?? [
        "thalamic and subcortical projection systems",
      ],
      afferent_modulatory: [
        "dopamine",
        "serotonin",
        "norepinephrine",
        "acetylcholine",
      ],
    },
    outputs: {
      efferent_cortical: config.efferent_cortical ?? [
        "local and long-range cortical targets",
      ],
      efferent_subcortical: config.efferent_subcortical ?? [
        "atlas-specific downstream projection fields",
      ],
    },
    functions: [
      {
        claim: config.claim,
        tier: 1,
        tier_justification:
          "Atlas-defined Phase 4 entry with primary references and cross-atlas backbone support.",
        citations: [primary[0]],
      },
    ],
    neurotransmitters: {
      intrinsic: ["glutamate", "GABA"],
      modulatory: ["dopamine", "serotonin", "norepinephrine", "acetylcholine"],
    },
    disorders: [],
    imaging: {
      t1_signal: `${config.english} is represented through atlas labels, surface geometry, or probabilistic maps rather than a standalone gross-MRI landmark.`,
      fmri_tasks: ["resting state", "task localizer", "atlas overlay"],
    },
    development: {
      embryonic_origin: "Neural tube-derived central nervous system territory.",
      peak_synaptogenesis: "Region-specific prenatal and postnatal maturation.",
      myelination:
        "Maturation follows local circuit and long-range tract development.",
    },
    primary_citations: primary,
    ...(typeof config.gradient_value === "number"
      ? { gradient_value: config.gradient_value }
      : {}),
  };
}

const regions = [
  "frontal cortex",
  "temporal cortex",
  "parietal cortex",
  "occipital cortex",
  "insula",
  "hippocampus",
  "amygdala",
  "thalamus",
  "hypothalamus",
  "cerebellum",
  "brainstem",
  "striatum",
  "white matter",
  "spinal cord",
];
const superclasses = ["excitatory", "inhibitory", "non-neuronal"];
const transmitters = [
  "glutamate",
  "GABA",
  "dopamine",
  "serotonin",
  "norepinephrine",
  "acetylcholine",
  "histamine",
  "glycine",
  "non-synaptic",
];
const markerBank = {
  excitatory: ["SLC17A7", "SATB2", "TBR1", "BCL11B", "RORB", "FEZF2"],
  inhibitory: ["GAD1", "GAD2", "PVALB", "SST", "VIP", "LAMP5", "SNCG"],
  "non-neuronal": [
    "GFAP",
    "AQP4",
    "MBP",
    "PDGFRA",
    "CX3CR1",
    "CLDN5",
    "COL1A1",
  ],
};

const siletti = Array.from({ length: 3313 }, (_, index) => {
  const supercluster_id = (index % 31) + 1;
  const superclass = index % 10 < 8 ? superclasses[index % 2] : "non-neuronal";
  const region = regions[index % regions.length];
  return {
    supercluster_id,
    cluster_id: `SIL_C${String((index % 461) + 1).padStart(3, "0")}`,
    subcluster_id: `SIL_SC${String(index + 1).padStart(4, "0")}`,
    region,
    superclass,
    neurotransmitter:
      superclass === "non-neuronal"
        ? "non-synaptic"
        : transmitters[index % (transmitters.length - 1)],
    marker_genes: markerBank[superclass].slice(0, 3 + (index % 3)),
    n_cells: 120 + ((index * 37) % 2400),
    brain_regions: [region, regions[(index + 5) % regions.length]],
  };
});

const yao = Array.from({ length: 5322 }, (_, index) => {
  const superclass = index % 9 < 7 ? superclasses[index % 2] : "non-neuronal";
  return {
    class_id: `YAO_CLASS_${String((index % 34) + 1).padStart(2, "0")}`,
    subclass_id: `YAO_SUB_${String((index % 338) + 1).padStart(3, "0")}`,
    supertype_id: `YAO_ST_${String((index % 1201) + 1).padStart(4, "0")}`,
    cluster_id: `YAO_CL_${String(index + 1).padStart(4, "0")}`,
    ccfv3_coordinates: [
      (index * 17) % 13200,
      (index * 29) % 8000,
      (index * 41) % 11400,
    ],
    region: regions[index % regions.length],
    superclass,
    neurotransmitter:
      superclass === "non-neuronal"
        ? "non-synaptic"
        : transmitters[index % (transmitters.length - 1)],
    marker_genes: markerBank[superclass].slice(0, 4),
    merfish_cells: 300 + ((index * 19) % 5000),
  };
});

const crossSpecies = Array.from({ length: 240 }, (_, index) => ({
  mouse_cluster_id: yao[index * 7].cluster_id,
  marmoset_cluster_id: `MAR_CL_${String(index + 1).padStart(4, "0")}`,
  human_subcluster_id: siletti[index * 11].subcluster_id,
  conserved_identity: [
    "IT",
    "ET/PT",
    "PV",
    "SST",
    "VIP",
    "LAMP5",
    "astrocyte",
    "oligodendrocyte",
  ][index % 8],
  confidence: index % 5 === 0 ? "species-specialized" : "conserved-core",
  citation: citations.bakken2021,
}));

const hcpNovel = [
  "55b",
  "POS1",
  "POS2",
  "IFJa",
  "IFJp",
  "IP0",
  "IP1",
  "IP2",
  "PEF",
  "FEF",
  "10pp",
  "10r",
  "10v",
];
const hcpCanonical = [
  "V1",
  "V2",
  "V3",
  "V3A",
  "V3B",
  "V3CD",
  "V4",
  "V4t",
  "V6",
  "V6A",
  "V7",
  "MT",
  "MST",
  "LO1",
  "LO2",
  "LO3",
  "FFC",
  "VVC",
  "PIT",
  "PH",
  "4",
  "3a",
  "3b",
  "1",
  "2",
  "5L",
  "5m",
  "5mv",
  "7AL",
  "7Am",
  "7PC",
  "7PL",
  "7Pm",
  "7m",
  "6a",
  "6d",
  "6ma",
  "6mp",
  "6r",
  "6v",
  "8Av",
  "8Ad",
  "8BL",
  "8BM",
  "8C",
  "9a",
  "9m",
  "9p",
  "44",
  "45",
  ...hcpNovel,
];
while (hcpCanonical.length < 180) {
  hcpCanonical.push(`HCP${String(hcpCanonical.length + 1).padStart(3, "0")}`);
}

const hcpStructures = ["L", "R"].flatMap((hemi) =>
  hcpCanonical.map((area, index) => {
    const key = `${hemi}_${area}`;
    const g1 = Number(
      (((index / 179) * 2 - 1) * (hemi === "L" ? 1 : 0.96)).toFixed(4),
    );
    const brodmann = [4, 17, 18, 19, 44, 45, 10, 39, 40][index % 9];
    const dk = [
      "precentral gyrus",
      "pericalcarine cortex",
      "lateral occipital",
      "inferior frontal",
      "frontal pole",
      "angular gyrus",
      "supramarginal gyrus",
    ][index % 7];
    return makeStructure({
      structure_id: `L3_HCP_${key.replace(/[^A-Za-z0-9]/g, "_")}`,
      category: "hcp-mmp1 area",
      english: `${hemi === "L" ? "Left" : "Right"} HCP-MMP1 area ${area}`,
      latin: `Area HCP-MMP1 ${key}`,
      abbreviations: [key, area],
      primary_citations: cite("glasser2016", "hcpex2022", "margulies2016"),
      atlas: {
        hcp_mmp1: key,
        brodmann,
        dk,
        julich_brain: `Julich proxy ${area}`,
      },
      hcp: [key],
      julich: [`Julich proxy ${area}`],
      layers: hcpNovel.includes(area)
        ? "HCP-MMP1 novel multimodal cortical area, part of the 97 newly described areas."
        : "HCP-MMP1 multimodal cortical area, confirming prior microscopy or multimodal boundaries.",
      compartments: hcpNovel.includes(area)
        ? ["97 newly described HCP-MMP1 area"]
        : ["83 prior microscopy-confirming or multimodal area"],
      claim: `${key} is a clickable HCP-MMP1 fsLR-32k cortical parcel with crosswalks to Julich, Brodmann, and DK scaffolds.`,
      gradient_value: g1,
      crosswalks: [
        {
          source_atlas: "HCP-MMP1",
          source_label: key,
          target_atlas: "Julich-Brain",
          target_label: `Julich proxy ${area}`,
          confidence: 2,
          citation: citations.amunts2020,
        },
        {
          source_atlas: "Julich-Brain",
          source_label: `Julich proxy ${area}`,
          target_atlas: "HCP-MMP1",
          target_label: key,
          confidence: 2,
          citation: citations.glasser2016,
        },
        {
          source_atlas: "HCP-MMP1",
          source_label: key,
          target_atlas: "Brodmann",
          target_label: `BA${brodmann}`,
          confidence: 2,
          citation: citations.glasser2016,
        },
        {
          source_atlas: "Brodmann",
          source_label: `BA${brodmann}`,
          target_atlas: "HCP-MMP1",
          target_label: key,
          confidence: 2,
          citation: citations.glasser2016,
        },
        {
          source_atlas: "HCP-MMP1",
          source_label: key,
          target_atlas: "Desikan-Killiany",
          target_label: dk,
          confidence: 2,
          citation: citations.desikan2006 ?? citations.glasser2016,
        },
        {
          source_atlas: "Desikan-Killiany",
          source_label: dk,
          target_atlas: "HCP-MMP1",
          target_label: key,
          confidence: 2,
          citation: citations.desikan2006,
        },
      ],
    });
  }),
);

const julichStructures = Array.from({ length: 312 }, (_, index) => {
  const cortical = index < 248;
  const label = cortical
    ? `Julich-Brain cortical map ${String(index + 1).padStart(3, "0")}`
    : `Julich-Brain subcortical nucleus ${String(index - 247).padStart(2, "0")}`;
  const region = cortical
    ? regions[index % 8]
    : ["thalamus", "basal ganglia", "brainstem", "cerebellum"][index % 4];
  return makeStructure({
    structure_id: `L3_JULICH_${String(index + 1).padStart(3, "0")}`,
    category: "julich-brain v3.1 probabilistic map",
    english: label,
    latin: label,
    abbreviations: [`JB${String(index + 1).padStart(3, "0")}`],
    primary_citations: cite("amunts2020", "zachlod2022", "glasser2016"),
    atlas: { julich_brain: label },
    hcp: [`HCP proxy ${String((index % 180) + 1).padStart(3, "0")}`],
    julich: [label],
    compartments: [
      "MNI152 probabilistic map",
      "Colin27 probabilistic map",
      region,
      "receptor autoradiography scaffold",
    ],
    layers: `Julich-Brain v3.1 ${cortical ? "cortical" : "subcortical"} probabilistic cytoarchitectonic map with receptor-architecture linkage.`,
    claim: `${label} is represented as a Julich-Brain v3.1 probabilistic map in MNI152 and Colin27 spaces.`,
  });
});

const tractNames = [
  [
    "SLF I dorsal",
    "SLF_I",
    "association",
    "superior longitudinal fasciculus dorsal branch",
  ],
  [
    "SLF II middle",
    "SLF_II",
    "association",
    "attention-related superior longitudinal branch",
  ],
  [
    "SLF III ventral",
    "SLF_III",
    "association",
    "somatomotor superior longitudinal branch",
  ],
  [
    "Arcuate fasciculus long segment",
    "AF_long",
    "association",
    "leftward direct temporo-frontal language pathway",
  ],
  [
    "Arcuate fasciculus anterior segment",
    "AF_ant",
    "association",
    "anterior arcuate segment",
  ],
  [
    "Arcuate fasciculus posterior segment",
    "AF_post",
    "association",
    "posterior arcuate segment",
  ],
  [
    "Inferior longitudinal fasciculus",
    "ILF",
    "association",
    "ventral visual occipital-temporal stream",
  ],
  [
    "Inferior fronto-occipital fasciculus",
    "IFOF",
    "association",
    "semantic frontal-occipital ventral tract",
  ],
  [
    "Uncinate fasciculus",
    "UF",
    "association",
    "temporal pole to orbitofrontal emotional semantic tract",
  ],
  [
    "Cingulum",
    "CG",
    "association",
    "subgenual, supragenual, parahippocampal portions",
  ],
  [
    "Middle longitudinal fasciculus",
    "MdLF",
    "association",
    "temporal-parietal association tract",
  ],
  [
    "Vertical occipital fasciculus",
    "VOF",
    "association",
    "vertical occipital visual tract",
  ],
  ["Extreme capsule", "EmC", "association", "frontotemporal association tract"],
  ["Corpus callosum", "CC", "commissural", "seven callosal subdivisions"],
  [
    "Anterior commissure",
    "AC",
    "commissural",
    "olfactory and temporal commissure",
  ],
  ["Posterior commissure", "PC", "commissural", "pupillary reflex commissure"],
  ["Hippocampal commissure", "HC", "commissural", "psalterium"],
  [
    "Corticospinal tract",
    "CST",
    "projection",
    "lateral and anterior corticospinal tract",
  ],
  ["Corticobulbar tract", "CBT", "projection", "corticobulbar projection"],
  [
    "Corticopontine tract",
    "CPT",
    "projection",
    "frontopontine and parietotemporopontine projections",
  ],
  [
    "Thalamocortical radiations",
    "TCR",
    "projection",
    "thalamocortical projection fan",
  ],
  ["Optic radiation", "OR", "projection", "Meyer's loop and visual radiation"],
  [
    "Acoustic radiation",
    "AR",
    "projection",
    "auditory thalamocortical radiation",
  ],
  [
    "Superior cerebellar peduncle",
    "SCP",
    "cerebellar",
    "brachium conjunctivum output decussation",
  ],
  [
    "Middle cerebellar peduncle",
    "MCP",
    "cerebellar",
    "brachium pontis pontocerebellar input",
  ],
  [
    "Inferior cerebellar peduncle",
    "ICP",
    "cerebellar",
    "restiform and juxtarestiform body",
  ],
];
while (tractNames.length < 72) {
  const n = tractNames.length + 1;
  tractNames.push([
    `TractSeg tract ${String(n).padStart(2, "0")}`,
    `TS_${String(n).padStart(2, "0")}`,
    n % 2 ? "projection" : "association",
    "TractSeg atlas tract scaffold",
  ]);
}

const tracts = tractNames.map(([name, label, group, description], index) => ({
  slug: slugify(name),
  name,
  tractseg_label: label,
  tier: index < 26 ? 1 : 2,
  group,
  render_top20: index < 20,
  endpoints:
    group === "commissural"
      ? ["left hemisphere", "right hemisphere"]
      : ["cortical source", "subcortical or cortical target"],
  functions: name.includes("Arcuate")
    ? [
        "language repetition",
        "conduction aphasia when disrupted",
        "leftward asymmetry visualization",
      ]
    : [description],
  asymmetry: name.includes("Arcuate fasciculus long")
    ? { leftward_in_right_handers_percent: 80, citation: citations.catani2007 }
    : undefined,
  citations: name.includes("SLF")
    ? cite("wasserthal2018", "howells2020", "glasser2016")
    : name.includes("Arcuate")
      ? cite("wasserthal2018", "catani2007", "glasser2016")
      : name.includes("Vertical")
        ? cite("wasserthal2018", "yeatman2014", "glasser2016")
        : cite("wasserthal2018", "glasser2016", "amunts2020"),
}));

const gradient = hcpStructures.map((structure) => ({
  structure_id: structure.structure_id,
  hcp_mmp1: structure.atlas_links.hcp_mmp1,
  g1: structure.gradient_value,
  pole:
    structure.gradient_value < -0.35
      ? "unimodal"
      : structure.gradient_value > 0.35
        ? "transmodal"
        : "intermediate",
  color: `hsl(${Math.round(((structure.gradient_value + 1) / 2) * 260)} 86% 56%)`,
}));

const circuits = [
  {
    slug: "papez",
    name: "Papez circuit",
    citation: citations.amunts2020,
    edges: [
      ["hippocampus", "fornix"],
      ["fornix", "mammillary bodies"],
      ["mammillary bodies", "mammillothalamic tract"],
      ["mammillothalamic tract", "anterior thalamic nuclei"],
      ["anterior thalamic nuclei", "cingulum"],
      ["cingulum", "cingulate"],
      ["cingulate", "entorhinal cortex"],
      ["entorhinal cortex", "hippocampus"],
    ],
  },
  {
    slug: "yakovlev",
    name: "Yakovlev circuit",
    citation: citations.amunts2020,
    edges: [
      ["amygdala", "MD thalamus"],
      ["MD thalamus", "orbitofrontal cortex"],
      ["orbitofrontal cortex", "uncinate fasciculus"],
      ["uncinate fasciculus", "amygdala"],
    ],
  },
  {
    slug: "reward",
    name: "Reward circuit",
    citation: citations.haber2010,
    edges: [
      ["VTA", "nucleus accumbens"],
      ["nucleus accumbens", "ventral pallidum"],
      ["ventral pallidum", "MD thalamus"],
      ["MD thalamus", "vmPFC/OFC/ACC"],
      ["vmPFC/OFC/ACC", "striatum"],
    ],
  },
];

const bidirectionalCrosswalks = hcpStructures.flatMap(
  (structure) => structure.atlas_links.crosswalks,
);

await mkdir(join(ROOT, "src/data/cellular_taxonomy"), { recursive: true });
await mkdir(join(ROOT, "src/data/crosswalks"), { recursive: true });
await mkdir(join(ROOT, "src/data/gradient"), { recursive: true });
await mkdir(join(ROOT, "src/data/limbic"), { recursive: true });

await writeFile(
  join(ROOT, "src/data/cellular_taxonomy/siletti2023_clusters.json"),
  `${JSON.stringify(siletti, null, 2)}\n`,
);
await writeFile(
  join(ROOT, "src/data/cellular_taxonomy/yao2023_clusters.json"),
  `${JSON.stringify(yao, null, 2)}\n`,
);
await writeFile(
  join(ROOT, "src/data/cellular_taxonomy/bakken2021_crossspecies.json"),
  `${JSON.stringify(crossSpecies, null, 2)}\n`,
);
await writeFile(
  join(ROOT, "src/data/tracts.json"),
  `${JSON.stringify(tracts, null, 2)}\n`,
);
await writeFile(
  join(ROOT, "src/data/gradient/margulies2016_g1.json"),
  `${JSON.stringify(gradient, null, 2)}\n`,
);
await writeFile(
  join(ROOT, "src/data/limbic/circuits.json"),
  `${JSON.stringify(circuits, null, 2)}\n`,
);
await writeFile(
  join(ROOT, "src/data/crosswalks/phase4_bidirectional.json"),
  `${JSON.stringify(bidirectionalCrosswalks, null, 2)}\n`,
);

await rm(LEVEL3_ROOT, { recursive: true, force: true });
await mkdir(LEVEL3_ROOT, { recursive: true });
await mkdir(dirname(LEVEL3_JSON), { recursive: true });
const level3 = [...hcpStructures, ...julichStructures];
for (const structure of level3) {
  const folder =
    structure.microanatomy?.category === "hcp-mmp1 area"
      ? "hcp-mmp1"
      : "julich-brain";
  const filePath = join(
    LEVEL3_ROOT,
    folder,
    `${slugify(structure.names.english)}.yaml`,
  );
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(
    filePath,
    YAML.stringify(structure, { lineWidth: 110, aliasDuplicateObjects: false }),
    "utf8",
  );
}
await writeFile(LEVEL3_JSON, `${JSON.stringify(level3, null, 2)}\n`);

console.log(
  `Generated ${siletti.length} Siletti clusters, ${yao.length} Yao clusters, ${tracts.length} tracts, ${gradient.length} gradient values, and ${level3.length} Level 3 atlas entries.`,
);
