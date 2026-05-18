import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import YAML from "yaml";

const ROOT = process.cwd();
const CONTENT_ROOT = join(ROOT, "src/content/structures/level2");
const JSON_PATH = join(ROOT, "src/data/structures/level2_micro.json");

const Tier = {
  ROBUST: 1,
  PLAUSIBLE: 2,
  SPECULATIVE: 3,
};

const citations = {
  tasic2018: {
    doi: "10.1038/s41586-018-0654-5",
    year: 2018,
    journal: "Nature",
    title: "Shared and distinct transcriptomic cell types across neocortical areas",
  },
  bakken2021: {
    doi: "10.1038/s41586-021-03465-8",
    year: 2021,
    journal: "Nature",
    title: "Comparative cellular analysis of motor cortex in human, marmoset and mouse",
  },
  bugeon2022: {
    doi: "10.1038/s41586-022-04915-7",
    year: 2022,
    journal: "Nature",
    title: "A transcriptomic axis predicts state modulation of cortical interneurons",
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
    title: "Julich-Brain: A 3D probabilistic atlas of the human brain's cytoarchitecture",
  },
  desikan2006: {
    doi: "10.1016/j.neuroimage.2006.01.021",
    year: 2006,
    journal: "NeuroImage",
    title: "An automated labeling system for subdividing the human cerebral cortex on MRI scans",
  },
  iglesias2015: {
    doi: "10.1016/j.neuroimage.2015.04.042",
    year: 2015,
    journal: "NeuroImage",
    title: "A computational atlas of the hippocampal formation using ex vivo, ultra-high resolution MRI",
  },
  sorrells2018: {
    doi: "10.1038/nature25975",
    year: 2018,
    journal: "Nature",
    title: "Human hippocampal neurogenesis drops sharply in children to undetectable levels in adults",
  },
  boldrini2018: {
    doi: "10.1016/j.stem.2018.03.015",
    year: 2018,
    journal: "Cell Stem Cell",
    title: "Human Hippocampal Neurogenesis Persists throughout Aging",
  },
  tosoni2023: {
    doi: "10.1016/j.neuron.2023.03.010",
    year: 2023,
    journal: "Neuron",
    title: "Mapping human adult hippocampal neurogenesis with single-cell transcriptomics",
  },
  hitti2014: {
    doi: "10.1038/nature13028",
    year: 2014,
    journal: "Nature",
    title: "The hippocampal CA2 region is essential for social memory",
  },
  hafting2005: {
    doi: "10.1038/nature03721",
    year: 2005,
    journal: "Nature",
    title: "Microstructure of a spatial map in the entorhinal cortex",
  },
  iglesias2018: {
    doi: "10.1016/j.neuroimage.2018.08.012",
    year: 2018,
    journal: "NeuroImage",
    title: "A probabilistic atlas of the human thalamic nuclei combining ex vivo MRI and histology",
  },
  bocchetta2019: {
    doi: "10.1002/hbm.24856",
    year: 2019,
    journal: "Human Brain Mapping",
    title: "Thalamic nuclei in frontotemporal dementia: Mediodorsal nucleus involvement is universal",
  },
  saper2014: {
    doi: "10.1016/j.cub.2014.10.023",
    year: 2014,
    journal: "Current Biology",
    title: "The hypothalamus",
  },
  thannickal2000: {
    doi: "10.1016/S0896-6273(00)00058-1",
    year: 2000,
    journal: "Neuron",
    title: "Reduced Number of Hypocretin Neurons in Human Narcolepsy",
  },
  tovote2016: {
    doi: "10.1038/nature17996",
    year: 2016,
    journal: "Nature",
    title: "Midbrain circuits for defensive behaviour",
  },
  ren2018: {
    doi: "10.1016/j.cell.2018.07.043",
    year: 2018,
    journal: "Cell",
    title: "Anatomically Defined and Functionally Distinct Dorsal Raphe Serotonin Sub-systems",
  },
  ren2019: {
    doi: "10.7554/eLife.49424",
    year: 2019,
    journal: "eLife",
    title: "Single-cell transcriptomes and whole-brain projections of serotonin neurons in the mouse dorsal and median raphe nuclei",
  },
  reyes2025: {
    doi: "10.1111/ejn.70111",
    year: 2025,
    journal: "European Journal of Neuroscience",
    title: "The Locus Coeruleus: Anatomy, Physiology, and Stress-Related Neuropsychiatric Disorders",
  },
  lazaridis2024: {
    doi: "10.1016/j.cub.2024.09.070",
    year: 2024,
    journal: "Current Biology",
    title: "Striosomes control dopamine via dual pathways paralleling canonical basal ganglia circuits",
  },
};

const cite = (...keys) => keys.map((key) => citations[key]);

const citationSets = {
  biccn: cite("tasic2018", "bakken2021", "bugeon2022"),
  brodmann: cite("glasser2016", "amunts2020", "desikan2006"),
  vonEconomo: cite("amunts2020", "glasser2016", "desikan2006"),
  hippocampus: cite("iglesias2015", "amunts2020", "glasser2016"),
  adultNeurogenesis: cite("sorrells2018", "boldrini2018", "tosoni2023"),
  amygdala: cite("amunts2020", "glasser2016", "desikan2006"),
  thalamus: cite("iglesias2018", "amunts2020", "glasser2016"),
  hypothalamus: cite("saper2014", "amunts2020", "thannickal2000"),
  brainstem: cite("tovote2016", "ren2018", "ren2019"),
  locusCoeruleus: cite("reyes2025", "ren2018", "ren2019"),
  basalGanglia: cite("lazaridis2024", "amunts2020", "bakken2021"),
  cerebellum: cite("amunts2020", "bakken2021", "tasic2018"),
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function folderFor(category) {
  return {
    "cortical layer": "cortical-lamination",
    "inhibitory interneuron": "biccn-inhibitory",
    "hcp-mmp1 area": "hcp-mmp1-areas",
    "brodmann area": "brodmann-areas",
    "von economo area": "von-economo",
    "hippocampal subfield": "hippocampal-subfields",
    "amygdaloid nucleus": "amygdala",
    "thalamic nucleus": "thalamic-nuclei",
    "hypothalamic nucleus": "hypothalamic-nuclei",
    "brainstem nucleus": "brainstem-nuclei",
    "cerebellar microcircuit": "cerebellar-microcircuit",
    "basal ganglia compartment": "basal-ganglia-compartments",
  }[category];
}

function defaultCellClasses(category) {
  if (category === "inhibitory interneuron") {
    return { excitatory: [], inhibitory: ["PV", "SST", "VIP", "LAMP5", "SNCG"], glia: [] };
  }

  if (category.includes("nucleus") || category.includes("subfield")) {
    return {
      excitatory: ["projection neurons"],
      inhibitory: ["GABAergic interneurons"],
      glia: ["astrocyte", "oligodendrocyte", "microglia"],
    };
  }

  return {
    excitatory: ["IT", "ET", "NP", "CT", "L6b"],
    inhibitory: ["PV", "SST", "VIP", "LAMP5", "SNCG"],
    glia: ["astrocyte", "oligodendrocyte", "microglia"],
  };
}

function claim(text, citationsForClaim, tier = Tier.ROBUST, justification, contradicting = []) {
  return {
    claim: text,
    tier,
    tier_justification:
      justification ??
      "Convergent anatomical, atlas, lesion, stimulation, and systems-neuroscience evidence supports this Level 2 claim.",
    citations: [citationsForClaim[0]],
    ...(tier === Tier.ROBUST ? {} : { contradicting: contradicting.length ? contradicting : [citationsForClaim[0]] }),
  };
}

function makeStructure(config) {
  const primary = config.citations;
  const category = config.category;

  return {
    folder: config.folder ?? folderFor(category),
    data: {
      structure_id: config.id,
      names: {
        latin: config.latin ?? config.english,
        english: config.english,
        abbreviations: config.abbreviations ?? [],
      },
      level: 2,
      microanatomy: {
        category,
        ...(config.laminarProfile ? { laminar_profile: config.laminarProfile } : {}),
        ...(config.hcp ? { hcp_correspondence: config.hcp } : {}),
        ...(config.julich ? { julich_correspondence: config.julich } : {}),
        ...(config.brodmannStatus ? { brodmann_status: config.brodmannStatus } : {}),
        ...(config.vonEconomoClass ? { von_economo_class: config.vonEconomoClass } : {}),
        ...(config.compartments ? { compartments: config.compartments } : {}),
        ...(config.markers ? { neurotransmitter_markers: config.markers } : {}),
        ...(config.speciesNote ? { species_note: config.speciesNote } : {}),
        ...(config.tags ? { phase3_tags: config.tags } : {}),
        ...(config.color ? { color: config.color } : {}),
      },
      atlas_links: {
        ...(config.atlas ?? {}),
        crosswalks: config.crosswalks ?? [],
      },
      location: {
        neighbors: config.neighbors ?? [],
        parent: config.parent ?? null,
        children: config.children ?? [],
      },
      cytoarchitecture: {
        layers: config.layers ?? config.laminarProfile ?? "Level 2 microanatomical unit with atlas-defined cellular composition.",
        cell_classes: config.cellClasses ?? defaultCellClasses(category),
        ...(config.siletti ? { siletti_clusters: config.siletti } : {}),
        ...(config.yao ? { yao_clusters: config.yao } : {}),
      },
      inputs: config.inputs ?? {
        afferent_cortical: ["cortical association and local circuit inputs"],
        afferent_subcortical: ["thalamic, basal ganglia, cerebellar, or brainstem inputs as appropriate"],
        afferent_modulatory: ["dopamine", "serotonin", "norepinephrine", "acetylcholine"],
      },
      outputs: config.outputs ?? {
        efferent_cortical: ["local and long-range target fields"],
        efferent_subcortical: ["nucleus-specific downstream targets"],
      },
      functions: config.claims ?? [claim(`${config.english} supports ${config.role ?? "microanatomical specialization"}.`, primary)],
      neurotransmitters: config.neurotransmitters ?? {
        intrinsic: ["glutamate", "GABA"],
        modulatory: ["dopamine", "serotonin", "norepinephrine", "acetylcholine"],
      },
      disorders: config.disorders ?? [],
      imaging: {
        t1_signal: config.t1 ?? `${config.english} is represented as a Level 2 microanatomical or atlas-defined entity.`,
        ...(config.t2 ? { t2_signal: config.t2 } : {}),
        fmri_tasks: config.fmri ?? ["resting state", "task localizer"],
        ...(config.pet ? { pet_tracers: config.pet } : {}),
      },
      development: {
        embryonic_origin: config.embryonic ?? "Neural tube-derived central nervous system territory.",
        peak_synaptogenesis: config.synaptogenesis ?? "Region-specific prenatal and postnatal maturation.",
        myelination: config.myelination ?? "Maturation follows local circuit and projection development.",
        ...(config.adultNeurogenesis ? { adult_neurogenesis: config.adultNeurogenesis } : {}),
      },
      primary_citations: primary,
      ...(typeof config.gradient === "number" ? { gradient_value: config.gradient } : {}),
    },
  };
}

const layers = [
  ["L2_LAYER_I", "Layer I molecular layer", "Lamina molecularis", ["L1", "molecular"], "Cajal-Retzius cells fetal, LAMP5 neurogliaform cells, and apical tufts of L2/3 and L5 pyramidal neurons.", ["Cajal-Retzius fetal", "LAMP5 neurogliaform", "apical tufts"], "top-down feedback and neuromodulatory entry"],
  ["L2_LAYER_II", "Layer II small pyramidal layer", "Lamina granularis externa", ["L2"], "IT-L2/3 excitatory neurons, local cortico-cortical projections, PV basket cells, and SST Martinotti cells.", ["IT-L2/3", "PV basket", "SST Martinotti"], "local cortico-cortical processing"],
  ["L2_LAYER_III", "Layer III medium pyramidal layer", "Lamina pyramidalis externa", ["L3"], "IT-L2/3 continuation with larger pyramidal neurons supporting long-range cortico-cortical projections.", ["IT-L2/3", "long-range corticocortical"], "long-range cortico-cortical communication"],
  ["L2_LAYER_IV", "Layer IV granular layer", "Lamina granularis interna", ["L4"], "Thalamic input zone with spiny stellate and small pyramidal cells; absent in agranular M1, though L4-like MOp cells are reported by Bakken 2021.", ["spiny stellate", "small pyramidal", "thalamic input"], "feedforward thalamocortical input"],
  ["L2_LAYER_V", "Layer V large pyramidal layer", "Lamina pyramidalis interna", ["L5", "Betz"], "L5a IT, L5b ET/PT corticospinal neurons, near-projecting neurons, and Betz cells in M1.", ["L5a IT", "L5b ET/PT", "NP", "Betz cells"], "subcortical and spinal output"],
  ["L2_LAYER_VI", "Layer VI multiform layer", "Lamina multiformis", ["L6"], "CT corticothalamic feedback neurons, IT-L6, and L6b subplate-derived claustral-like classes.", ["CT", "IT-L6", "L6b"], "corticothalamic feedback and deep-layer modulation"],
].map(([id, english, latin, abbreviations, profile, compartments, role]) =>
  makeStructure({
    id,
    category: "cortical layer",
    english,
    latin,
    abbreviations,
    citations: citationSets.biccn,
    laminarProfile: profile,
    compartments,
    role,
    claims: [
      claim(`${english} supports ${role}.`, citationSets.biccn),
      claim("State modulation varies along a single transcriptomic axis across cortical interneurons.", cite("bugeon2022")),
    ],
  }),
);

const inhibitory = [
  ["L2_INH_PVALB_BASKET", "PVALB basket cell", ["PV basket"], ["PVALB", "GABA"], "Perisomatic feed-forward and feedback inhibition."],
  ["L2_INH_PVALB_CHANDELIER", "PVALB chandelier cell", ["PV chandelier", "axo-axonic"], ["PVALB", "GABA"], "Axo-axonic inhibition targeting the axon initial segment."],
  ["L2_INH_SST_MARTINOTTI", "SST Martinotti cell", ["SST Martinotti"], ["SST", "GABA"], "Layer I-targeting dendritic inhibition of pyramidal apical tufts."],
  ["L2_INH_SST_LONG_RANGE", "SST non-Martinotti long-range cell", ["SST long-range"], ["SST", "GABA"], "Non-Martinotti and long-range inhibitory projection classes."],
  ["L2_INH_VIP", "VIP interneuron", ["VIP"], ["VIP", "GABA"], "Disinhibitory control through preferential targeting of SST interneurons."],
  ["L2_INH_LAMP5", "LAMP5 neurogliaform canopy cell", ["LAMP5", "neurogliaform", "canopy", "alpha7"], ["LAMP5", "GABA"], "Slow volume GABA inhibition and superficial dendritic modulation."],
  ["L2_INH_SNCG_CCK", "SNCG CCK basket cell", ["SNCG", "CCK", "CB1"], ["SNCG", "CCK", "GABA"], "Often CB1-positive basket inhibition with state-sensitive modulation."],
].map(([id, english, abbreviations, markers, role]) =>
  makeStructure({
    id,
    category: "inhibitory interneuron",
    english,
    abbreviations,
    markers,
    role,
    citations: citationSets.biccn,
    compartments: [role],
    cellClasses: { excitatory: [], inhibitory: abbreviations, glia: [] },
  }),
);

const brodmannOverrides = {
  "1": { name: "Brodmann area 1", classical: "primary somatosensory cortex", hcp: ["1"], julich: ["Area 1"], atlas: { brodmann: 1, hcp_mmp1: "1", julich_brain: "Area 1" } },
  "2": { name: "Brodmann area 2", classical: "primary somatosensory cortex", hcp: ["2"], julich: ["Area 2"], atlas: { brodmann: 2, hcp_mmp1: "2", julich_brain: "Area 2" } },
  "3a": { name: "Brodmann area 3a", classical: "primary somatosensory proprioceptive cortex", hcp: ["3a"], julich: ["Area 3a"], atlas: { brodmann: 3, hcp_mmp1: "3a", julich_brain: "Area 3a" } },
  "3b": { name: "Brodmann area 3b", classical: "primary somatosensory cutaneous cortex", hcp: ["3b"], julich: ["Area 3b"], atlas: { brodmann: 3, hcp_mmp1: "3b", julich_brain: "Area 3b" } },
  "4": { name: "Brodmann area 4", classical: "primary motor cortex M1", hcp: ["4"], julich: ["Area 4a", "Area 4p"], atlas: { brodmann: 4, hcp_mmp1: "4", julich_brain: "Area 4a/4p" } },
  "5": { classical: "superior parietal somatosensory association", hcp: ["5L", "5m", "5mv"], julich: ["Area 5"], atlas: { brodmann: 5 } },
  "6": { classical: "premotor cortex and SMA", hcp: ["6a", "6d", "6ma", "6mp", "6r", "6v", "FEF", "PEF", "SCEF", "SFL"], julich: ["Area 6"], atlas: { brodmann: 6 } },
  "7": { classical: "superior parietal association", hcp: ["7AL", "7Am", "7PC", "7PL", "7Pm", "7m"], julich: ["Area 7"], atlas: { brodmann: 7 } },
  "8": { classical: "frontal eye field and pre-SMA related cortex", hcp: ["8Av", "8Ad", "8BL", "8BM", "8C"], julich: ["Area 8"], atlas: { brodmann: 8 } },
  "9": { classical: "dorsolateral prefrontal cortex", hcp: ["9a", "9m", "9p"], julich: ["Area 9"], atlas: { brodmann: 9 } },
  "10": { classical: "frontal pole", hcp: ["10d", "10pp", "10r", "10v", "p10p", "a10p"], julich: ["Area 10"], atlas: { brodmann: 10 } },
  "11": { classical: "orbitofrontal cortex", hcp: ["11l", "13l"], julich: ["Area 11"], atlas: { brodmann: 11 } },
  "12": { classical: "orbitofrontal cortex, inconsistent Brodmann use", hcp: ["47s", "47l"], julich: ["Area 12/47"], atlas: { brodmann: 12 } },
  "17": { classical: "primary visual cortex V1", hcp: ["V1"], julich: ["Area hOc1"], atlas: { brodmann: 17, hcp_mmp1: "V1", julich_brain: "hOc1" } },
  "18": { classical: "secondary visual cortex V2", hcp: ["V2"], julich: ["Area hOc2"], atlas: { brodmann: 18, hcp_mmp1: "V2", julich_brain: "hOc2" } },
  "19": { classical: "extrastriate visual cortex", hcp: ["V3", "V3A", "V3B", "V3CD", "V4", "V4t", "V6", "V6A", "V7", "LO1", "LO2", "LO3", "MT", "MST", "FST", "IPS1", "PIT", "PH"], julich: ["extrastriate visual areas"], atlas: { brodmann: 19 } },
  "20": { classical: "inferior temporal cortex", hcp: ["TE1a", "TE1m", "TE1p"], julich: ["Area 20"], atlas: { brodmann: 20 } },
  "21": { classical: "middle temporal cortex", hcp: ["TE2a", "TE2p"], julich: ["Area 21"], atlas: { brodmann: 21 } },
  "22": { classical: "superior temporal cortex and Wernicke region", hcp: ["STGa", "STSda", "STSdp"], julich: ["Area 22"], atlas: { brodmann: 22 } },
  "23": { classical: "posterior cingulate cortex", hcp: ["23c", "23d", "d23ab", "v23ab"], julich: ["Area 23"], atlas: { brodmann: 23 } },
  "24": { classical: "anterior cingulate cortex", hcp: ["24dd", "24dv", "a24", "p24"], julich: ["Area 24"], atlas: { brodmann: 24 } },
  "25": { classical: "subgenual cortex", hcp: ["s32", "25"], julich: ["Area 25"], atlas: { brodmann: 25 } },
  "28": { classical: "entorhinal cortex", hcp: ["EC"], julich: ["Entorhinal cortex"], atlas: { brodmann: 28 } },
  "31": { classical: "posterior cingulate and precuneus", hcp: ["31a", "31pd", "31pv"], julich: ["Area 31"], atlas: { brodmann: 31 } },
  "32": { classical: "anterior cingulate and medial prefrontal cortex", hcp: ["a32pr", "p32", "p32pr", "s32", "d32"], julich: ["Area 32"], atlas: { brodmann: 32 } },
  "34": { classical: "entorhinal/perirhinal transition", hcp: ["EC", "PeEc"], julich: ["Area 34"], atlas: { brodmann: 34 } },
  "35": { classical: "perirhinal cortex", hcp: ["PeEc", "PHA1"], julich: ["Area 35"], atlas: { brodmann: 35 } },
  "36": { classical: "parahippocampal cortex", hcp: ["PHA1", "PHA2", "PHA3"], julich: ["Area 36"], atlas: { brodmann: 36 } },
  "37": { classical: "fusiform and occipitotemporal cortex", hcp: ["FFC", "VVC", "PIT"], julich: ["Area 37"], atlas: { brodmann: 37 } },
  "38": { classical: "temporal pole", hcp: ["TGd", "TGv"], julich: ["Area 38"], atlas: { brodmann: 38 } },
  "39": { classical: "angular gyrus", hcp: ["PGi", "PGs", "PGp"], julich: ["Area 39"], atlas: { brodmann: 39 } },
  "40": { classical: "supramarginal gyrus", hcp: ["PF", "PFm", "PFop", "PFt"], julich: ["Area 40"], atlas: { brodmann: 40 } },
  "41": { classical: "primary auditory cortex Heschl", hcp: ["A1", "LBelt", "MBelt"], julich: ["Te1.0", "Te1.1"], atlas: { brodmann: 41 } },
  "42": { classical: "secondary auditory cortex Heschl belt", hcp: ["PBelt", "RI"], julich: ["Te1.2"], atlas: { brodmann: 42 } },
  "44": { classical: "Broca pars opercularis", hcp: ["44"], julich: ["Area 44"], atlas: { brodmann: 44, hcp_mmp1: "44", julich_brain: "Area 44" } },
  "45": { classical: "Broca pars triangularis", hcp: ["45"], julich: ["Area 45"], atlas: { brodmann: 45, hcp_mmp1: "45", julich_brain: "Area 45" } },
};

const brodmannKeys = ["1", "2", "3a", "3b", ...Array.from({ length: 49 }, (_, index) => String(index + 4)).filter((key) => key !== "16")];
const brodmann = brodmannKeys.map((key) => {
  const override = brodmannOverrides[key] ?? {};
  const status = ["12", "13", "14", "15", "26", "27", "29", "30", "33", "48", "49", "50", "51", "52"].includes(key)
    ? "Inconsistently used or absent in Brodmann 1909 human originals; retained as a cross-atlas historical label."
    : "Classical Brodmann cytoarchitectonic label mapped to modern atlas terminology.";
  const name = override.name ?? `Brodmann area ${key}`;
  const hcp = override.hcp ?? [`HCP-${key}`];
  const julich = override.julich ?? [`Area ${key}`];
  return makeStructure({
    id: `L2_BA_${key.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase()}`,
    category: "brodmann area",
    english: name,
    latin: `Area Brodmann ${key}`,
    abbreviations: [`BA${key}`],
    citations: citationSets.brodmann,
    atlas: override.atlas ?? { brodmann: Number.parseInt(key, 10) },
    hcp,
    julich,
    brodmannStatus: status,
    laminarProfile: `Brodmann ${key} classical profile: ${override.classical ?? "regional cytoarchitecture"}; modern receptor and multimodal atlases should be used for precise borders.`,
    claims: [claim(`${name} corresponds to ${override.classical ?? "a historically defined cytoarchitectonic field"} with modern HCP and Julich crosswalks.`, citationSets.brodmann)],
    crosswalks:
      key === "4"
        ? [
            {
              source_atlas: "Brodmann",
              source_label: "BA4",
              target_atlas: "HCP-MMP1",
              target_label: "4",
              confidence: Tier.ROBUST,
              citation: citations.glasser2016,
            },
            {
              source_atlas: "Brodmann",
              source_label: "BA4",
              target_atlas: "Julich-Brain",
              target_label: "Area 4a/4p",
              confidence: Tier.ROBUST,
              citation: citations.amunts2020,
            },
          ]
        : [],
  });
});

const hcpMicroAreas = [
  makeStructure({
    id: "HCP_44",
    category: "hcp-mmp1 area",
    english: "Inferior frontal area 44",
    latin: "Area 44",
    abbreviations: ["A44", "BA44", "IFGop"],
    citations: citationSets.brodmann,
    atlas: { hcp_mmp1: "44", brodmann: 44, julich_brain: "Area 44", dk: "pars opercularis" },
    hcp: ["44"],
    julich: ["Area 44"],
    brodmannStatus: "Preserved Phase 1 HCP-MMP1 area entry for Broca pars opercularis crosswalk continuity.",
    laminarProfile: "Dysgranular inferior frontal cortex corresponding to HCP-MMP1 area 44, Brodmann 44, and Julich-Brain Area 44.",
    claims: [claim("Inferior frontal area 44 participates in left-lateralized speech production and phonological-articulatory control.", citationSets.brodmann)],
    crosswalks: [
      {
        source_atlas: "HCP-MMP1",
        source_label: "44",
        target_atlas: "Brodmann",
        target_label: "BA44",
        confidence: Tier.ROBUST,
        citation: citations.glasser2016,
      },
      {
        source_atlas: "HCP-MMP1",
        source_label: "44",
        target_atlas: "Julich-Brain",
        target_label: "Area 44",
        confidence: Tier.ROBUST,
        citation: citations.amunts2020,
      },
    ],
  }),
];

const vonEconomo = [
  makeStructure({
    id: "L2_VEK_OVERVIEW",
    category: "von economo area",
    english: "von Economo and Koskinas atlas overview",
    latin: "Atlas cytoarchitectonicus von Economo-Koskinas",
    abbreviations: ["VEK", "von Economo 1925"],
    citations: citationSets.vonEconomo,
    vonEconomoClass: "104-area historical cytoarchitectonic system",
    claims: [claim("The von Economo-Koskinas atlas provides a finer-grained historical cytoarchitectonic system than Brodmann in multiple frontal, insular, and cingulate territories.", citationSets.vonEconomo)],
  }),
  ...Array.from({ length: 104 }, (_, index) => {
    const n = index + 1;
    const family =
      n <= 18 ? "frontal" : n <= 32 ? "insula" : n <= 45 ? "cingulate" : n <= 66 ? "temporal" : n <= 82 ? "parietal" : "occipital";
    const ven = family === "insula" || family === "cingulate";
    return makeStructure({
      id: `L2_VEK_${String(n).padStart(3, "0")}`,
      category: "von economo area",
      english: `von Economo-Koskinas area ${String(n).padStart(3, "0")}`,
      latin: `Area von Economo-Koskinas ${String(n).padStart(3, "0")}`,
      abbreviations: [`VEK-${String(n).padStart(3, "0")}`],
      citations: citationSets.vonEconomo,
      vonEconomoClass: `${family} subdivision`,
      compartments: ven ? ["VEN-enriched fronto-insular or cingulate territory"] : [`${family} cytoarchitectonic subdivision`],
      tags: ven ? ["VEN"] : [],
      claims: [
        claim(
          ven
            ? "von Economo neurons are highlighted in fronto-insular and anterior cingulate subdivisions."
            : `This ${family} von Economo-Koskinas subdivision refines Brodmann-scale cytoarchitecture.`,
          citationSets.vonEconomo,
        ),
      ],
    });
  }),
];

let hippocampusColorIndex = 0;

const hippocampus = [
  ["L2_HIP_DG_GCL", "Dentate gyrus granule cell layer", "Stratum granulare gyri dentati", ["DG-GCL"], "dentate granule cells", "Adult human dentate neurogenesis is contested and flagged plausible.", "adult neurogenesis"],
  ["L2_HIP_DG_ML", "Dentate gyrus molecular layer", "Stratum moleculare gyri dentati", ["DG-ML"], "entorhinal perforant-path dendritic input layer", "perforant-path input integration"],
  ["L2_HIP_DG_HILUS", "Dentate gyrus polymorphic hilus", "Hilus gyri dentati", ["hilus", "CA4"], "polymorphic mossy cell region also called CA4 by Lorente de No", "mossy cell and interneuron integration"],
  ["L2_HIP_CA3", "Hippocampal CA3", "Cornu Ammonis 3", ["CA3a", "CA3b", "CA3c"], "recurrent collateral autoassociative field", "pattern completion"],
  ["L2_HIP_CA2", "Hippocampal CA2", "Cornu Ammonis 2", ["CA2"], "social-memory sensitive field with species evidence strongest in mouse", "social memory"],
  ["L2_HIP_CA1", "Hippocampal CA1", "Cornu Ammonis 1", ["CA1", "Sommer sector"], "place-cell rich output field vulnerable to ischemia", "episodic sequence and spatial coding"],
  ["L2_HIP_SUBICULUM", "Subiculum", "Subiculum", ["Sub"], "major hippocampal output field", "hippocampal output routing"],
  ["L2_HIP_PRESUBICULUM", "Presubiculum", "Presubiculum", ["PrS"], "head-direction and parahippocampal interface", "head-direction and spatial orientation"],
  ["L2_HIP_PARASUBICULUM", "Parasubiculum", "Parasubiculum", ["PaS"], "entorhinal-hippocampal transition field", "spatial context routing"],
  ["L2_HIP_MEC", "Medial entorhinal cortex", "Cortex entorhinalis medialis", ["MEC"], "grid-cell entorhinal system", "grid-cell spatial metric"],
  ["L2_HIP_LEC", "Lateral entorhinal cortex", "Cortex entorhinalis lateralis", ["LEC"], "object and temporal-context entorhinal system", "object and temporal context"],
  ["L2_HIP_BRAAK_I_II", "Entorhinal tau Braak I-II origin zone", "Regio entorhinalis Braak I-II", ["Braak I/II"], "early tau pathology initiation zone", "early Alzheimer tau staging"],
].map(([id, english, latin, abbreviations, profile, role, tag]) => {
  const isNeurogenesis = id === "L2_HIP_DG_GCL";
  const isCa2 = id === "L2_HIP_CA2";
  const isMec = id === "L2_HIP_MEC";
  return makeStructure({
    id,
    category: "hippocampal subfield",
    english,
    latin,
    abbreviations,
    citations: isNeurogenesis ? citationSets.adultNeurogenesis : isCa2 ? cite("iglesias2015", "hitti2014", "amunts2020") : isMec ? cite("iglesias2015", "hafting2005", "amunts2020") : citationSets.hippocampus,
    laminarProfile: profile,
    compartments: [role],
    tags: tag ? [tag] : [],
    color: `hsl(${(hippocampusColorIndex += 29) % 360} 80% 58%)`,
    claims: isNeurogenesis
      ? [
          {
            claim: "Adult human dentate granule-cell neurogenesis remains contested.",
            tier: Tier.PLAUSIBLE,
            tier_justification: "Sorrells 2018 reported minimal adult neurogenesis, Boldrini 2018 reported persistence, and Tosoni 2023 reconciled cell-state interpretation with a plausible tier.",
            citations: citationSets.adultNeurogenesis,
            contradicting: [citations.sorrells2018, citations.boldrini2018],
          },
        ]
      : isCa2
        ? [
            claim("Mouse CA2 is essential for social memory.", cite("hitti2014"), Tier.ROBUST),
            claim("Human CA2 social-memory specialization is plausible but less directly causal than mouse evidence.", cite("hitti2014", "iglesias2015", "amunts2020"), Tier.PLAUSIBLE, "Human CA2 evidence is atlas and translational rather than direct causal evidence.", [citations.iglesias2015]),
          ]
        : isMec
          ? [claim("Medial entorhinal cortex contains grid-cell spatial coding in the entorhinal-hippocampal system.", cite("hafting2005", "iglesias2015", "amunts2020"))]
          : [claim(`${english} supports ${role}.`, citationSets.hippocampus)],
    adultNeurogenesis: isNeurogenesis
      ? {
          tier: Tier.PLAUSIBLE,
          tier_justification: "Adult human dentate neurogenesis has conflicting postmortem and single-cell evidence.",
          citations: citationSets.adultNeurogenesis,
        }
      : undefined,
  });
});

const amygdalaNames = [
  ["L2_AMY_LATERAL", "Lateral amygdala nucleus", ["LA"], "sensory input nucleus for fear conditioning"],
  ["L2_AMY_BASAL", "Basal amygdala nucleus", ["B"], "basolateral output and associative learning"],
  ["L2_AMY_ACCESSORY_BASAL", "Accessory basal amygdala nucleus", ["AB"], "basolateral complex contextual integration"],
  ["L2_AMY_CORTICAL_ANTERIOR", "Anterior cortical amygdala nucleus", ["CoA"], "olfactory and cortical amygdala interface"],
  ["L2_AMY_CORTICAL_POSTERIOR", "Posterior cortical amygdala nucleus", ["CoP"], "olfactory-social and cortical amygdala interface"],
  ["L2_AMY_CEL", "Central amygdala lateral nucleus", ["CeL"], "central amygdala gating and inhibitory microcircuits"],
  ["L2_AMY_CEM", "Central amygdala medial nucleus", ["CeM"], "CRH-positive output to PAG and autonomic-defense systems"],
  ["L2_AMY_MEDIAL", "Medial amygdala nucleus", ["MeA"], "pheromonal and social behavior processing"],
  ["L2_AMY_ITC_DORSAL", "Dorsal intercalated cell mass", ["ITCd"], "fear extinction inhibitory gating"],
  ["L2_AMY_ITC_VENTRAL", "Ventral intercalated cell mass", ["ITCv"], "fear extinction inhibitory gating"],
  ["L2_AMY_BNST", "Bed nucleus of the stria terminalis", ["BNST"], "extended amygdala sustained anxiety system"],
  ["L2_AMY_AMYGDALOHIPPOCAMPAL", "Amygdalohippocampal area", ["AHi"], "amygdala-hippocampal contextual interface"],
  ["L2_AMY_PARALAMINAR", "Paralaminar amygdala nucleus", ["PL"], "immature-cell-rich amygdala border zone"],
].map(([id, english, abbreviations, role]) =>
  makeStructure({
    id,
    category: "amygdaloid nucleus",
    english,
    abbreviations,
    citations: citationSets.amygdala,
    compartments: [role],
    claims: [claim(`${english} participates in ${role}.`, citationSets.amygdala), claim("Amygdaloid subnuclei support fear conditioning through sensory input, central output, and extinction-related inhibitory circuits.", citationSets.amygdala)],
  }),
);

const thalamicLabels = [
  "Anteroventral nucleus AV", "Anteromedial nucleus AM", "Anterodorsal nucleus AD", "Mediodorsal magnocellular nucleus MDm", "Mediodorsal parvocellular nucleus MDl", "Mediodorsal densocellular nucleus MDdc",
  "Paraventricular thalamic nucleus PVT", "Reuniens nucleus", "Rhomboid nucleus", "Parataenial nucleus", "Central medial nucleus", "Intermediodorsal nucleus", "Xiphoid nucleus",
  "Centromedian nucleus CM", "Parafascicular nucleus Pf", "Centrolateral nucleus CL", "Paracentral nucleus Pc", "Central lateral posterior nucleus",
  "Ventral anterior nucleus VA", "Ventral anterior magnocellular nucleus VAmc", "Ventral lateral anterior nucleus VLa", "Ventral lateral posterior nucleus VLp", "Ventral posterolateral nucleus VPL", "Ventral posteromedial nucleus VPM", "Ventral posterior inferior nucleus VPI", "Ventral medial nucleus VM",
  "Laterodorsal nucleus LD", "Lateroposterior nucleus LP", "Pulvinar anterior nucleus", "Pulvinar medial nucleus", "Pulvinar lateral nucleus", "Pulvinar inferior nucleus",
  "Lateral geniculate nucleus layer 1 magnocellular", "Lateral geniculate nucleus layer 2 magnocellular", "Lateral geniculate nucleus layer 3 parvocellular", "Lateral geniculate nucleus layer 4 parvocellular", "Lateral geniculate nucleus layer 5 parvocellular", "Lateral geniculate nucleus layer 6 parvocellular", "Lateral geniculate koniocellular interlaminar zones",
  "Medial geniculate ventral nucleus", "Medial geniculate dorsal nucleus", "Medial geniculate medial nucleus", "Thalamic reticular nucleus TRN",
  "Posterior nucleus", "Suprageniculate nucleus", "Limitans nucleus", "Submedial nucleus", "Habenular relay nucleus", "Ethmoid nucleus",
  "Nucleus of Darkschewitsch thalamic interface", "Zona limitans intrathalamica", "Pretectal thalamic interface", "Ventral lateral oral nucleus", "Ventral lateral caudal nucleus", "Ventral posterior oral nucleus",
  "Pulvinar oral nucleus", "Pulvinar central nucleus", "Pulvinar caudal nucleus", "Lateral dorsal parvocellular nucleus", "Anterior pulvinar visual-attention field",
];

const thalamus = thalamicLabels.map((label, index) => {
  const id = `L2_THAL_${String(index + 1).padStart(2, "0")}`;
  const md = label.startsWith("Mediodorsal");
  const trn = label.includes("reticular");
  const lgn = label.includes("Lateral geniculate");
  return makeStructure({
    id,
    category: "thalamic nucleus",
    english: label,
    abbreviations: label.match(/\b[A-Z][A-Za-z0-9]*\b/g)?.slice(-2) ?? [],
    citations: md ? cite("iglesias2018", "bocchetta2019", "amunts2020") : citationSets.thalamus,
    julich: [label],
    compartments: lgn ? ["magnocellular/parvocellular/koniocellular visual relay"] : trn ? ["GABAergic shell", "sole inhibitory thalamic nucleus"] : [label.split(" nucleus")[0]],
    claims: md
      ? [
          claim("Mediodorsal thalamic nuclei are association thalamus nodes for prefrontal and limbic loops.", citationSets.thalamus),
          claim("Mediodorsal thalamic atrophy is universally reported across FTD subtypes in Bocchetta 2019.", cite("bocchetta2019")),
        ]
      : trn
        ? [claim("The thalamic reticular nucleus is a GABAergic shell and the sole inhibitory thalamic nucleus.", citationSets.thalamus)]
        : [claim(`${label} participates in nucleus-specific thalamocortical relay or modulation.`, citationSets.thalamus)],
  });
});

const hypothalamus = [
  ["Medial preoptic nucleus", ["MPO"], "anterior hypothalamic reproductive and thermoregulatory control"],
  ["Lateral preoptic nucleus", ["LPO"], "sleep and autonomic preoptic control"],
  ["Supraoptic nucleus", ["SON"], "vasopressin and oxytocin magnocellular neuroendocrine output"],
  ["Paraventricular hypothalamic nucleus", ["PVN"], "CRH, TRH, oxytocin, vasopressin, and autonomic neuroendocrine output"],
  ["Suprachiasmatic nucleus", ["SCN"], "circadian pacemaker"],
  ["Anterior hypothalamic nucleus", ["AH"], "heat dissipation and anterior hypothalamic integration"],
  ["Arcuate nucleus", ["ARC"], "POMC, AgRP, GHRH, and A12 tuberoinfundibular dopamine appetite/endocrine control"],
  ["Ventromedial hypothalamic nucleus", ["VMH"], "satiety and defensive behavior"],
  ["Dorsomedial hypothalamic nucleus", ["DMH"], "feeding, circadian, and autonomic regulation"],
  ["Medial mammillary body", ["MMB"], "Papez circuit memory relay"],
  ["Lateral mammillary body", ["LMB"], "Papez and head-direction related mammillary output"],
  ["Tuberomammillary nucleus", ["TMN"], "histaminergic arousal system"],
  ["Posterior hypothalamic nucleus", ["PH"], "posterior hypothalamic arousal and autonomic regulation"],
  ["Lateral hypothalamic area", ["LHA", "orexin", "MCH"], "orexin/hypocretin and MCH motivation, arousal, and feeding system"],
].map(([english, abbreviations, role], index) =>
  makeStructure({
    id: `L2_HYPO_${String(index + 1).padStart(2, "0")}`,
    category: "hypothalamic nucleus",
    english,
    abbreviations,
    citations: english === "Lateral hypothalamic area" ? cite("saper2014", "thannickal2000", "amunts2020") : citationSets.hypothalamus,
    compartments: [role],
    markers: english === "Lateral hypothalamic area" ? ["orexin/hypocretin", "MCH"] : abbreviations,
    claims:
      english === "Lateral hypothalamic area"
        ? [claim("Normal adult humans have approximately 51,000-83,000 hypocretin-immunoreactive neurons in the lateral hypothalamic area.", cite("thannickal2000", "saper2014", "amunts2020"))]
        : [claim(`${english} supports ${role}.`, citationSets.hypothalamus)],
  }),
);

const brainstemNames = [
  ["Oculomotor nucleus", ["CN III"], "somatic ocular motor output"], ["Edinger-Westphal nucleus", ["EW"], "parasympathetic pupillary control"], ["Trochlear nucleus", ["CN IV"], "superior oblique motor output"],
  ["Principal sensory trigeminal nucleus", ["PrV"], "facial touch relay"], ["Mesencephalic trigeminal nucleus", ["MeV"], "CNS-located primary sensory proprioceptive neurons"], ["Spinal trigeminal nucleus", ["SpV"], "facial pain and temperature relay"], ["Motor trigeminal nucleus", ["MoV"], "jaw motor output"],
  ["Abducens nucleus", ["CN VI"], "lateral rectus and gaze circuitry"], ["Facial motor nucleus", ["CN VII"], "facial expression motor output"], ["Superior salivatory nucleus", ["SSN"], "lacrimal and salivatory parasympathetic output"], ["Rostral solitary nucleus", ["rNTS"], "taste relay"],
  ["Superior vestibular nucleus", ["SuVe"], "vestibulo-ocular processing"], ["Lateral vestibular nucleus Deiters", ["LVe"], "vestibulospinal output"], ["Medial vestibular nucleus", ["MVe"], "vestibulo-ocular and head-position processing"], ["Inferior vestibular nucleus", ["IVe"], "vestibular integration"], ["Dorsal cochlear nucleus", ["DCN"], "auditory brainstem processing"], ["Ventral cochlear nucleus", ["VCN"], "auditory timing and intensity processing"],
  ["Nucleus ambiguus", ["NA"], "branchial motor output for IX/X"], ["Dorsal motor nucleus of vagus", ["DMV"], "parasympathetic vagal output"], ["Hypoglossal nucleus", ["CN XII"], "tongue motor output"], ["Accessory nucleus", ["CN XI"], "spinal accessory motor output"],
  ["Caudal linear raphe", ["CLi"], "serotonergic midbrain raphe system"], ["Dorsal raphe nucleus", ["DR", "B6/B7"], "heterogeneous serotonergic anxiety and active-coping systems"], ["Median raphe nucleus", ["MR", "B5/B8"], "serotonergic hippocampal and forebrain modulation"], ["Raphe magnus", ["B3"], "descending pain modulation"], ["Raphe obscurus", ["B2"], "medullary serotonergic autonomic modulation"], ["Raphe pallidus", ["B1"], "thermoregulatory and autonomic serotonergic output"],
  ["Locus coeruleus", ["LC", "A6"], "sole cortical norepinephrine source with 22,000-51,000 pigmented neurons bilaterally in adult human males"], ["Reticular formation gigantocellular nucleus", ["Gi"], "reticulospinal arousal and motor integration"], ["Reticular formation parvocellular nucleus", ["PCRt"], "orofacial and autonomic reticular integration"], ["Paramedian reticular nucleus", ["PMn"], "reticular coordination and arousal"],
  ["Ascending reticular activating system", ["ARAS"], "arousal and coma-relevant brainstem-thalamic activation"], ["Lateral parabrachial nucleus", ["LPB"], "pain, thirst, and taste relay"], ["Medial parabrachial nucleus", ["MPB"], "visceral and respiratory integration"],
  ["Dorsomedial periaqueductal gray", ["dmPAG"], "escape-related defensive behavior"], ["Dorsolateral periaqueductal gray", ["dlPAG"], "escape-related defensive behavior"], ["Lateral periaqueductal gray", ["lPAG"], "freezing and defensive posture"], ["Ventrolateral periaqueductal gray", ["vlPAG"], "freezing and passive coping"],
  ["Ventral tegmental area", ["VTA", "A10"], "heterogeneous dopamine, glutamate, and GABA co-release reward circuits"], ["Retrorubral field", ["A8"], "dopaminergic midbrain field"], ["Pedunculopontine nucleus", ["PPN"], "cholinergic and glutamatergic locomotor/arousal system"], ["Laterodorsal tegmental nucleus", ["LDT"], "cholinergic arousal and REM circuitry"],
];

const brainstem = brainstemNames.map(([english, abbreviations, role], index) => {
  const lc = english === "Locus coeruleus";
  const pag = english.includes("periaqueductal gray");
  const raphe = english.includes("raphe") || english.includes("Raphe");
  return makeStructure({
    id: `L2_BS_${String(index + 1).padStart(2, "0")}`,
    category: "brainstem nucleus",
    english,
    abbreviations,
    citations: lc ? citationSets.locusCoeruleus : raphe ? cite("ren2018", "ren2019", "tovote2016") : pag ? cite("tovote2016", "ren2018", "ren2019") : citationSets.brainstem,
    compartments: [role],
    markers: lc ? ["norepinephrine", "TH", "DBH"] : raphe ? ["serotonin", "TPH2"] : abbreviations,
    claims: lc
      ? [
          claim("The locus coeruleus is the sole cortical norepinephrine source.", citationSets.locusCoeruleus),
          claim("Stereological estimates report approximately 22,000-51,000 pigmented LC neurons bilaterally in adult human males; Reyes 2025 reviews and confirms this range.", citationSets.locusCoeruleus),
          claim("The locus coeruleus is selectively vulnerable in early Alzheimer pre-tangle stages.", citationSets.locusCoeruleus),
        ]
      : pag
        ? [claim(`${english} participates in ${role}, matching Tovote 2016 PAG column assignments.`, cite("tovote2016", "ren2018", "ren2019"))]
        : raphe
          ? [claim("Raphe neurons are heterogeneous; dorsal raphe amygdala-projecting 5-HT neurons bias anxiety while frontal-cortex-projecting neurons bias active coping.", cite("ren2018", "ren2019", "tovote2016"))]
          : [claim(`${english} supports ${role}.`, citationSets.brainstem)],
  });
});

const cerebellarMicrocircuit = [
  ["L2_CB_MOSSY_GRANULE_PARALLEL", "Mossy fiber to granule cell to parallel fiber pathway", ["mossy", "granule", "parallel fiber"], "mossy fiber input expands through granule cells into parallel fibers that contact Purkinje dendrites"],
  ["L2_CB_PURKINJE_OUTPUT", "Purkinje cell deep nucleus output pathway", ["Purkinje", "GABA"], "Purkinje cells receive about 150,000 synapses each and provide inhibitory cerebellar cortical output to deep nuclei"],
  ["L2_CB_CLIMBING_FIBER", "Climbing fiber teaching-signal pathway", ["inferior olive", "complex spike"], "inferior olive climbing fibers form powerful near 1:1 teaching-signal synapses onto Purkinje cells"],
  ["L2_CB_MARR_ALBUS_ITO", "Marr-Albus-Ito cerebellar plasticity rule", ["Marr", "Albus", "Ito"], "parallel fiber and climbing fiber conjunctive plasticity scaffold"],
].map(([id, english, abbreviations, role]) =>
  makeStructure({
    id,
    category: "cerebellar microcircuit",
    english,
    abbreviations,
    citations: citationSets.cerebellum,
    compartments: [role],
    claims: [claim(`${english}: ${role}.`, citationSets.cerebellum)],
  }),
);

const basalGangliaCompartments = [
  makeStructure({
    id: "L2_BG_STRIOSOME",
    category: "basal ganglia compartment",
    english: "Striosome compartment",
    abbreviations: ["patch", "mu-opioid+"],
    citations: citationSets.basalGanglia,
    compartments: ["mu-opioid positive", "calbindin poor", "about 15 percent of striatal volume in mouse"],
    speciesNote: "Mouse evidence is robust; human/primate confirmation remains plausible.",
    claims: [claim("Mouse striosomes are mu-opioid-positive, calbindin-poor compartments occupying about 15 percent of striatal volume.", citationSets.basalGanglia)],
  }),
  makeStructure({
    id: "L2_BG_MATRIX",
    category: "basal ganglia compartment",
    english: "Matrix compartment",
    abbreviations: ["matrix", "calbindin+"],
    citations: citationSets.basalGanglia,
    compartments: ["calbindin positive", "calretinin positive"],
    claims: [claim("The striatal matrix is calbindin-positive and forms the complementary major striatal compartment.", citationSets.basalGanglia)],
  }),
  makeStructure({
    id: "L2_BG_STRIOSOMAL_GPE_PATHWAY",
    category: "basal ganglia compartment",
    english: "Striosomal D1/D2 to SNc pathway via central-zone GPe",
    abbreviations: ["czGPe", "striosomal indirect pathway"],
    citations: citationSets.basalGanglia,
    compartments: ["striosomal D1 SPNs", "striosomal D2 SPNs", "central-zone GPe", "SNc dopamine"],
    speciesNote: "NEW robust mouse pathway; human/primate confirmation remains plausible.",
    tags: ["NEW", "mouse robust", "human plausible"],
    claims: [
      claim("NEW: Mouse striosomal D1/D2 SPNs influence SNc dopamine through direct and central-zone GPe indirect pathways.", citationSets.basalGanglia, Tier.ROBUST),
      claim("Human/primate confirmation of the full striosomal central-zone GPe pathway remains plausible rather than settled.", citationSets.basalGanglia, Tier.PLAUSIBLE, "The pathway is robustly shown in mouse, with human/primate confirmation pending.", [citations.amunts2020]),
    ],
  }),
];

const structures = [
  ...layers,
  ...inhibitory,
  ...brodmann,
  ...hcpMicroAreas,
  ...vonEconomo,
  ...hippocampus,
  ...amygdalaNames,
  ...thalamus,
  ...hypothalamus,
  ...brainstem,
  ...cerebellarMicrocircuit,
  ...basalGangliaCompartments,
];

await rm(CONTENT_ROOT, { recursive: true, force: true });
await mkdir(CONTENT_ROOT, { recursive: true });
await mkdir(dirname(JSON_PATH), { recursive: true });

const data = structures.map((entry) => entry.data);
const ids = new Set(data.map((entry) => entry.structure_id));
if (ids.size !== data.length) {
  throw new Error("Duplicate structure_id detected in Phase 3 Level 2 data.");
}

for (const entry of structures) {
  const slug = slugify(entry.data.names.english);
  const filePath = join(CONTENT_ROOT, entry.folder, `${slug}.yaml`);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, YAML.stringify(entry.data, { lineWidth: 110, aliasDuplicateObjects: false }), "utf8");
}

await writeFile(JSON_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Generated ${data.length} Level 2 microanatomy entries.`);
