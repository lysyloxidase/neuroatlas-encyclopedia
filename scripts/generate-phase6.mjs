import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();

const citations = {
  lariviere2021: {
    doi: "10.1038/s41592-021-01186-4",
    year: 2021,
    journal: "Nature Methods",
    title: "The ENIGMA Toolbox: multiscale neural contextualization of multisite neuroimaging datasets",
  },
  therriault2022: {
    doi: "10.1038/s43587-022-00204-0",
    year: 2022,
    journal: "Nature Aging",
    title: "Biomarker modeling of Alzheimer's disease using PET-based Braak staging",
  },
  garritsen2023: {
    doi: "10.1038/s41583-022-00669-3",
    year: 2023,
    journal: "Nature Reviews Neuroscience",
    title: "Development, wiring and function of dopamine neuron subtypes",
  },
  huntington1993: {
    doi: "10.1016/0092-8674(93)90585-E",
    year: 1993,
    journal: "Cell",
    title: "A novel gene containing a trinucleotide repeat that is expanded and unstable on Huntington's disease chromosomes",
  },
  thompson2018: {
    doi: "10.1161/STR.0000000000000158",
    year: 2018,
    journal: "Stroke",
    title: "2018 Guidelines for the early management of patients with acute ischemic stroke",
  },
  thompsonMs2018: {
    doi: "10.1016/S1474-4422(17)30470-2",
    year: 2018,
    journal: "Lancet Neurology",
    title: "Diagnosis of multiple sclerosis: 2017 revisions of the McDonald criteria",
  },
  schmaal2017: {
    doi: "10.1038/mp.2016.60",
    year: 2017,
    journal: "Molecular Psychiatry",
    title: "Cortical abnormalities in adults and adolescents with major depression based on brain scans from 20 cohorts worldwide",
  },
  mayberg2005: {
    doi: "10.1016/j.neuron.2005.02.014",
    year: 2005,
    journal: "Neuron",
    title: "Deep brain stimulation for treatment-resistant depression",
  },
  alagapan2023: {
    doi: "10.1038/s41586-023-06541-3",
    year: 2023,
    journal: "Nature",
    title: "Cingulate dynamics track depression recovery with deep brain stimulation",
  },
  gutman2022: {
    doi: "10.1002/hbm.25625",
    year: 2022,
    journal: "Human Brain Mapping",
    title: "A meta-analysis of deep brain structural shape and asymmetry abnormalities in 2,833 individuals with schizophrenia compared with 3,929 healthy volunteers via the ENIGMA Consortium",
  },
  woodward2012: {
    doi: "10.1176/appi.ajp.2012.12010056",
    year: 2012,
    journal: "American Journal of Psychiatry",
    title: "Thalamocortical dysconnectivity in schizophrenia",
  },
  hong2019: {
    doi: "10.1038/s41467-019-08944-1",
    year: 2019,
    journal: "Nature Communications",
    title: "Atypical functional connectome hierarchy in autism",
  },
  adhd2017: {
    doi: "10.1016/S2215-0366(17)30049-4",
    year: 2017,
    journal: "Lancet Psychiatry",
    title: "Subcortical brain volume differences in participants with attention deficit hyperactivity disorder in children and adults",
  },
  bocchetta2019: {
    doi: "10.1002/hbm.24856",
    year: 2020,
    journal: "Human Brain Mapping",
    title: "Thalamic nuclei in frontotemporal dementia: Mediodorsal nucleus involvement is universal but pulvinar atrophy is C9orf72-specific",
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
    journal: "Cerebellum",
    title: "The Cerebellar Cognitive Affective/Schmahmann Syndrome Scale in spinocerebellar ataxias",
  },
};

const cite = (...keys) => keys.map((key) => citations[key]);

function disorder(config) {
  return {
    enigma_overlay: `${config.name} ENIGMA structural map`,
    tier: 1,
    citations: cite("lariviere2021"),
    structural_map_regions: config.affected_structures,
    biomarkers: [],
    treatments: [],
    dbs_targets: [],
    mechanism_tier: config.tier ?? 1,
    ...config,
  };
}

const disorders = [
  disorder({
    slug: "alzheimers-disease",
    name: "Alzheimer's disease",
    affected_structures: ["transentorhinal cortex", "entorhinal cortex", "CA1 hippocampus", "inferior temporal cortex", "association cortex", "primary sensory cortex", "locus coeruleus"],
    summary: "Tau Braak staging, amyloid/tau biomarkers, DMN hyper-to-hypoconnectivity, hippocampal atrophy, and early locus coeruleus vulnerability.",
    braak_type: "ad_tau",
    biomarkers: ["Tau-PET MK-6240/flortaucipir", "amyloid-PET florbetapir/florbetaben/flutemetamol", "CSF Abeta42/40 ratio", "CSF p-tau181 and p-tau217", "plasma p-tau217", "hippocampal volume MRI"],
    treatments: ["AChE inhibitors targeting basal forebrain cholinergic deficit", "memantine NMDA antagonist", "lecanemab 2023 FDA traditional approval", "donanemab 2024 FDA approval"],
    citations: cite("therriault2022", "lariviere2021"),
  }),
  disorder({
    slug: "parkinsons-disease",
    name: "Parkinson's disease",
    affected_structures: ["SNc A9 Sox6+Aldh1a1 dopamine neurons", "dorsal motor vagus", "olfactory bulb", "STN", "GPi", "cortex"],
    summary: "Lewy pathology spread with SNc dopamine neuron loss, neuromelanin/DaT imaging biomarkers, and STN/GPi DBS treatment routes.",
    braak_type: "pd_lewy",
    biomarkers: ["neuromelanin-sensitive MRI", "DaT-SPECT ioflupane I-123", "alpha-synuclein RT-QuIC in CSF and skin biopsy"],
    treatments: ["L-DOPA plus carbidopa", "dopamine agonists pramipexole/ropinirole", "MAO-B inhibitors rasagiline/selegiline", "DBS STN best evidence", "DBS GPi"],
    dbs_targets: ["STN", "GPi"],
    citations: cite("garritsen2023", "lariviere2021"),
  }),
  disorder({
    slug: "huntingtons-disease",
    name: "Huntington's disease",
    affected_structures: ["caudate", "putamen", "indirect-pathway MSNs", "direct-pathway MSNs", "lateral ventricles"],
    summary: "Striatal degeneration beginning in caudate and indirect-pathway medium spiny neurons, followed by broader basal ganglia involvement.",
    braak_type: "hd_striatal",
    biomarkers: ["caudate atrophy and bicaudate ratio", "HTT CAG repeat expansion >=40 full penetrance", "T2 signal change in caudate/putamen", "boxcar ventricles"],
    citations: cite("huntington1993"),
  }),
  disorder({
    slug: "multiple-sclerosis",
    name: "Multiple sclerosis",
    affected_structures: ["periventricular white matter", "juxtacortical white matter", "infratentorial white matter", "optic nerve", "spinal cord"],
    summary: "Disseminated CNS demyelination mapped across periventricular, juxtacortical, infratentorial, optic nerve, and spinal cord territories.",
    biomarkers: ["T2/FLAIR lesions", "T1 black holes", "OCT retinal nerve fiber layer thinning", "CSF oligoclonal bands", "plasma neurofilament light"],
    citations: cite("thompsonMs2018"),
  }),
  disorder({
    slug: "stroke-territories",
    name: "Stroke territories",
    affected_structures: ["MCA lateral cortex", "ACA medial cortex", "PCA occipital and medial temporal cortex", "vertebrobasilar brainstem/cerebellum", "lacunar deep perforators", "watershed borders"],
    summary: "Vascular-territory structural map for cortical, deep perforator, posterior circulation, and watershed syndromes.",
    map_type: "vascular",
    biomarkers: ["DWI/ADC hyperacute mismatch", "CT perfusion core/penumbra", "vascular-territory clinical syndrome"],
    citations: cite("thompson2018"),
  }),
  disorder({
    slug: "mesial-temporal-lobe-epilepsy",
    name: "Mesial temporal lobe epilepsy",
    affected_structures: ["hippocampus", "CA1", "CA4/hilus", "dentate gyrus", "CA2 preserved", "focal cortical dysplasia"],
    summary: "Hippocampal sclerosis pattern with CA1+CA4+DG loss and relative CA2 preservation, plus temporal PET/EEG/MEG localization.",
    map_type: "hippocampal_sclerosis",
    biomarkers: ["T2/FLAIR hippocampal atrophy and signal", "FDG-PET interictal hypometabolism", "MEG/EEG spike localization"],
    citations: cite("lariviere2021"),
  }),
  disorder({
    slug: "schizophrenia",
    name: "Schizophrenia",
    affected_structures: ["dlPFC", "striatum", "mediodorsal thalamus", "CA1/subiculum", "hippocampus", "amygdala", "accumbens"],
    summary: "Structural ENIGMA shape effects, thalamocortical dysconnectivity, hippocampal hyperactivity, and dopaminergic mechanism hypotheses.",
    tier: 1,
    mechanism_tier: 2,
    biomarkers: ["subtle cortical thinning", "ventricular enlargement", "striatal D2 receptor occupancy PET", "ENIGMA subcortical shape"],
    citations: cite("gutman2022", "woodward2012", "lariviere2021"),
  }),
  disorder({
    slug: "major-depressive-disorder",
    name: "Major depressive disorder",
    affected_structures: ["sgACC BA25", "DMN", "hippocampus", "orbitofrontal cortex", "ACC/PCC", "insula", "temporal cortex", "lateral habenula"],
    summary: "ENIGMA cortical thinning, sgACC hyperactivity, hippocampal volume reduction, DMN hyperconnectivity, and DBS targets for treatment resistance.",
    biomarkers: ["sgACC FDG-PET", "hippocampal atrophy", "resting fMRI DMN connectivity", "ENIGMA cortical thinning Cohen's d -0.10 to -0.14"],
    dbs_targets: ["sgACC/SCC BA25", "ALIC", "MFB", "VC/VS"],
    treatments: ["sgACC DBS for treatment-resistant depression is investigational/not FDA approved"],
    citations: cite("schmaal2017", "mayberg2005", "alagapan2023", "lariviere2021"),
  }),
  disorder({
    slug: "anxiety-ptsd",
    name: "Anxiety disorders + PTSD",
    affected_structures: ["BLA amygdala", "anterior insula", "vmPFC", "hippocampus"],
    summary: "Fear/salience circuit map emphasizing amygdala and insula hyperactivity, vmPFC extinction failure, and reduced hippocampal volume in PTSD.",
    biomarkers: ["amygdala reactivity", "insula salience activation", "vmPFC extinction signal", "hippocampal volume"],
    citations: cite("lariviere2021"),
  }),
  disorder({
    slug: "obsessive-compulsive-disorder",
    name: "Obsessive-compulsive disorder",
    affected_structures: ["OFC BA11", "caudate head", "ACC", "mediodorsal thalamus", "ALIC", "NAcc", "BNST", "STN"],
    summary: "Cortico-striato-thalamo-cortical loop disorder with DBS targets in STN, ALIC, NAcc, and BNST.",
    biomarkers: ["CSTC loop hyperactivity", "cortical and subcortical ENIGMA maps"],
    dbs_targets: ["STN", "ALIC", "NAcc", "BNST"],
    citations: cite("lariviere2021"),
  }),
  disorder({
    slug: "autism-spectrum",
    name: "Autism spectrum",
    tier: 2,
    affected_structures: ["DMN hierarchy", "long-range connectivity", "local connectivity", "cerebellar Crus I/II", "cortical/subcortical ENIGMA maps"],
    summary: "Heterogeneous, contested connectivity and structural patterns including atypical DMN hierarchy and cerebellar Crus I/II findings.",
    biomarkers: ["heterogeneous; no single biomarker", "atypical functional connectome hierarchy"],
    citations: cite("hong2019", "lariviere2021"),
  }),
  disorder({
    slug: "adhd",
    name: "ADHD",
    tier: 1,
    mechanism_tier: 2,
    affected_structures: ["striatum", "frontostriatal circuits", "cerebellar vermis VIII-IX", "cortical maturation maps"],
    summary: "Robust structural signal in subcortical volumes with debated mechanisms involving frontostriatal hypoactivity and delayed cortical maturation.",
    biomarkers: ["ENIGMA subcortical volume reductions", "delayed cortical maturation", "frontostriatal hypoactivity"],
    citations: cite("adhd2017", "lariviere2021"),
  }),
  disorder({
    slug: "tourettes-syndrome",
    name: "Tourette's syndrome",
    tier: 2,
    affected_structures: ["basal ganglia matrix/striosome compartments", "frontostriatal circuit", "SMA", "CM thalamus", "GPi"],
    summary: "Tic network map centered on basal ganglia/frontostriatal circuits and SMA, with off-label DBS targets in CM thalamus and GPi.",
    dbs_targets: ["CM thalamus", "GPi"],
    biomarkers: ["clinical tic phenomenology", "frontostriatal circuit imaging"],
    citations: cite("lariviere2021"),
  }),
  disorder({
    slug: "aphasias",
    name: "Aphasias",
    affected_structures: ["BA44/45", "posterior BA22", "arcuate fasciculus", "large MCA territory", "BA6 MCA-ACA watershed", "MCA-PCA watershed", "temporal lobe"],
    summary: "Language syndrome map spanning Broca, Wernicke, conduction, global, transcortical, and anomic aphasias.",
    map_type: "aphasia",
    biomarkers: ["lesion localization", "language phenotype", "arcuate tract integrity"],
    citations: cite("lariviere2021"),
  }),
  disorder({
    slug: "cerebellar-ataxia",
    name: "Cerebellar ataxia",
    affected_structures: ["dentate nucleus", "vermis", "Purkinje cell layer", "cerebellar hemispheres"],
    summary: "Ataxia map for SCA1-48+, Friedreich's ataxia, and MSA-C, linked to cerebellar atrophy and CCAS-S assessment.",
    biomarkers: ["genetic testing", "cerebellar atrophy on MRI", "CCAS-S scale"],
    citations: cite("hoche2018", "selvadurai2023"),
  }),
  disorder({
    slug: "locked-in-syndrome",
    name: "Locked-in syndrome",
    affected_structures: ["ventral pons", "basilar artery territory", "corticospinal tracts", "corticobulbar tracts", "tectum/RAS spared"],
    summary: "Ventral pontine syndrome with preserved consciousness because tectum and ascending reticular activating system are spared.",
    biomarkers: ["pontine T2 hyperintensity", "preserved vertical eye movements and blinking", "consciousness preserved"],
    citations: cite("thompson2018"),
  }),
  disorder({
    slug: "coma-disorders-consciousness",
    name: "Coma / disorders of consciousness",
    affected_structures: ["bilateral intralaminar thalamus", "mesopontine tegmentum ARAS", "bilateral hemispheres"],
    summary: "Consciousness-disorder map distinguishing coma, unresponsive wakefulness, minimally conscious state, and locked-in syndrome.",
    biomarkers: ["brainstem ARAS lesion", "bilateral thalamic injury", "bilateral hemispheric dysfunction"],
    citations: cite("lariviere2021"),
  }),
  disorder({
    slug: "frontotemporal-dementia",
    name: "Frontotemporal dementia",
    affected_structures: ["frontal cortex", "anterior temporal cortex", "mediodorsal thalamus", "pulvinar", "insula"],
    summary: "bvFTD/PPA atrophy map with universal mediodorsal thalamic involvement and C9orf72-specific pulvinar atrophy.",
    biomarkers: ["bvFTD/svPPA/nfvPPA atrophy patterns", "CSF/plasma neurofilament light", "MAPT/GRN/C9orf72 genetics", "C9orf72-specific pulvinar atrophy"],
    citations: cite("bocchetta2019", "lariviere2021"),
  }),
  disorder({
    slug: "lewy-body-dementia",
    name: "Lewy body dementia",
    affected_structures: ["diffuse cortex", "NBM cholinergic system", "PPN", "dopaminergic striatum"],
    summary: "Diffuse cortical alpha-synuclein disease with prominent cholinergic vulnerability, fluctuating cognition, and REM sleep behavior disorder route.",
    biomarkers: ["abnormal DaT-SPECT", "MIBG cardiac scintigraphy", "alpha-synuclein RT-QuIC"],
    citations: cite("garritsen2023", "lariviere2021"),
  }),
];

const enigmaDisorders = [
  ["alzheimers-disease", "entorhinal", "thickness", -0.62, 900, 1200, citations.lariviere2021],
  ["alzheimers-disease", "hippocampus", "volume", -0.7, 900, 1200, citations.lariviere2021],
  ["schizophrenia", "hippocampus", "volume", -0.22, 2833, 3929, citations.gutman2022],
  ["schizophrenia", "amygdala", "volume", -0.18, 2833, 3929, citations.gutman2022],
  ["schizophrenia", "accumbens", "volume", -0.16, 2833, 3929, citations.gutman2022],
  ["schizophrenia", "thalamus", "volume", -0.19, 2833, 3929, citations.gutman2022],
  ["major-depressive-disorder", "orbitofrontal", "thickness", -0.14, 2148, 7957, citations.schmaal2017],
  ["major-depressive-disorder", "anterior-cingulate", "thickness", -0.12, 2148, 7957, citations.schmaal2017],
  ["major-depressive-disorder", "posterior-cingulate", "thickness", -0.1, 2148, 7957, citations.schmaal2017],
  ["major-depressive-disorder", "insula", "thickness", -0.13, 2148, 7957, citations.schmaal2017],
  ["major-depressive-disorder", "temporal", "thickness", -0.11, 2148, 7957, citations.schmaal2017],
  ["bipolar-disorder", "frontal", "thickness", -0.12, 2447, 4056, citations.lariviere2021],
  ["obsessive-compulsive-disorder", "ofc", "thickness", -0.08, 1905, 1760, citations.lariviere2021],
  ["adhd", "accumbens", "volume", -0.15, 1713, 1529, citations.adhd2017],
  ["autism-spectrum", "temporal", "thickness", -0.09, 1500, 1600, citations.lariviere2021],
  ["parkinsons-disease", "substantia-nigra", "volume", -0.42, 620, 700, citations.lariviere2021],
  ["mesial-temporal-lobe-epilepsy", "hippocampus", "volume", -0.85, 1200, 1400, citations.lariviere2021],
  ["22q11-2-deletion-syndrome", "parietal", "surface_area", -0.18, 900, 1000, citations.lariviere2021],
];

const enigmaEffects = enigmaDisorders.map(([disorderName, region_id, measure, cohens_d, n_cases, n_controls, citation]) => ({
  disorder: disorderName,
  region_id,
  measure,
  cohens_d,
  n_cases,
  n_controls,
  citation: citation.doi,
}));

const dbsTargets = [
  ["PD motor", "STN, GPi", "FDA approval 2002 for STN/GPi advanced PD motor symptoms", 1],
  ["Essential tremor", "VIM thalamus", "FDA approval 1997", 1],
  ["Dystonia", "GPi", "2003 humanitarian device exemption", 1],
  ["Epilepsy refractory", "Anterior thalamus", "FDA approval 2018", 1],
  ["Epilepsy responsive", "RNS multi-target", "FDA approval 2013", 1],
  ["OCD refractory", "ALIC, STN, NAcc", "2009 humanitarian device exemption", 1],
  ["MDD refractory", "sgACC, ALIC, MFB, VC/VS", "Not FDA approved", 2],
  ["Tourette's", "CM thalamus, GPi", "Off-label", 2],
].map(([indication, target, fda_approval, evidence_tier]) => ({ indication, target, fda_approval, evidence_tier }));

const pathwaySpread = {
  ad_tau: [
    ["0", "No cortical tau-PET/Braak signal", []],
    ["I", "Transentorhinal cortex", ["transentorhinal cortex"]],
    ["II", "Entorhinal cortex + CA1 hippocampus", ["entorhinal cortex", "CA1 hippocampus"]],
    ["III", "Inferior temporal spread", ["inferior temporal cortex"]],
    ["IV", "Association cortex engagement", ["association cortex"]],
    ["V", "High association cortex burden", ["association cortex", "precuneus", "PCC"]],
    ["VI", "Primary sensory cortex involvement", ["primary sensory cortex"]],
  ],
  pd_lewy: [
    ["0", "No Lewy pathology stage rendered", []],
    ["I", "Dorsal motor vagus and olfactory bulb", ["dorsal motor vagus", "olfactory bulb"]],
    ["II", "Lower brainstem and raphe spread", ["raphe", "medulla"]],
    ["III", "Substantia nigra pars compacta", ["SNc"]],
    ["IV", "Mesocortex and limbic cortex", ["limbic cortex"]],
    ["V", "Association neocortex", ["association cortex"]],
    ["VI", "Primary neocortex", ["primary cortex"]],
  ],
  hd_striatal: [
    ["0", "Premanifest carrier risk", []],
    ["I", "Caudate head subtle atrophy", ["caudate"]],
    ["II", "Indirect-pathway MSN loss and chorea", ["indirect-pathway MSNs"]],
    ["III", "Putamen and broader striatum", ["putamen", "caudate"]],
    ["IV", "Direct-pathway involvement", ["direct-pathway MSNs"]],
    ["V", "Cortical and white matter spread", ["cortex", "white matter"]],
    ["VI", "Advanced rigid-akinetic network state", ["basal ganglia", "cortex"]],
  ],
  als_motor: [
    ["0", "No motor neuron spread rendered", []],
    ["I", "Corticospinal tract / motor cortex", ["M1", "corticospinal tract"]],
    ["II", "Brainstem motor nuclei", ["brainstem motor nuclei"]],
    ["III", "Spinal anterior horn", ["anterior horn"]],
    ["IV", "Frontotemporal network spread", ["frontal cortex", "temporal cortex"]],
    ["V", "Respiratory motor system", ["respiratory motor neurons"]],
    ["VI", "Advanced multisystem motor involvement", ["motor system"]],
  ],
};

await mkdir(join(ROOT, "src/data/disorders"), { recursive: true });
await writeFile(join(ROOT, "src/data/disorders.json"), `${JSON.stringify(disorders, null, 2)}\n`);
await writeFile(join(ROOT, "src/data/disorders/enigma_effects.json"), `${JSON.stringify(enigmaEffects, null, 2)}\n`);
await writeFile(join(ROOT, "src/data/disorders/dbs_targets.json"), `${JSON.stringify(dbsTargets, null, 2)}\n`);
await writeFile(join(ROOT, "src/data/disorders/pathway_spread.json"), `${JSON.stringify(pathwaySpread, null, 2)}\n`);

console.log(`Generated ${disorders.length} disorders, ${enigmaEffects.length} ENIGMA effects, ${dbsTargets.length} DBS rows, and ${Object.keys(pathwaySpread).length} pathway animations.`);
