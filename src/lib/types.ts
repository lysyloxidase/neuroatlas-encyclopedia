import type { Tier } from "./tier";

export interface Citation {
  doi: string;
  year: number;
  journal: string;
  title?: string;
}

export interface AtlasCrosswalk {
  source_atlas: string;
  source_label: string;
  target_atlas: string;
  target_label: string;
  confidence: Tier;
  citation: Citation;
}

export interface TierFlag {
  tier: Tier;
  tier_justification: string;
  citations: Citation[];
}

export interface FunctionalClaim {
  claim: string;
  tier: Tier;
  tier_justification: string;
  citations: Citation[];
  contradicting?: Citation[];
}

export interface DisorderAssociation {
  disorder: string;
  association: string;
  effect_size?: number;
  tier: Tier;
  citations: Citation[];
}

export interface Structure {
  structure_id: string;
  names: {
    latin: string;
    english: string;
    abbreviations: string[];
  };
  level: 1 | 2 | 3;
  atlas_links: {
    hcp_mmp1?: string;
    julich_brain?: string;
    brodmann?: number;
    von_economo?: string;
    dk?: string;
    aal3?: string;
    allen_ccf?: string;
    crosswalks: AtlasCrosswalk[];
  };
  location: {
    mni_centroid_left?: [number, number, number];
    mni_centroid_right?: [number, number, number];
    ccf_centroid?: [number, number, number];
    neighbors: string[];
    parent: string | null;
    children: string[];
  };
  cytoarchitecture: {
    layers?: string;
    cell_classes: {
      excitatory: string[];
      inhibitory: string[];
      glia?: string[];
    };
    siletti_clusters?: string[];
    yao_clusters?: string[];
  };
  inputs: {
    afferent_cortical: string[];
    afferent_subcortical: string[];
    afferent_modulatory: string[];
  };
  outputs: {
    efferent_cortical: string[];
    efferent_subcortical: string[];
  };
  functions: FunctionalClaim[];
  neurotransmitters: {
    intrinsic: string[];
    modulatory: string[];
  };
  disorders: DisorderAssociation[];
  imaging: {
    t1_signal: string;
    t2_signal?: string;
    fmri_tasks: string[];
    pet_tracers?: string[];
  };
  development: {
    embryonic_origin: string;
    peak_synaptogenesis: string;
    myelination: string;
    adult_neurogenesis?: TierFlag;
  };
  primary_citations: Citation[];
  gradient_value?: number;
}

export interface Network {
  slug: string;
  name: string;
  system: string;
  color: string;
  tier: Tier;
  description: string;
  key_regions: string[];
  citations: Citation[];
}

export interface Tract {
  slug: string;
  name: string;
  tractseg_label: string;
  tier: Tier;
  endpoints: string[];
  functions: string[];
  citations: Citation[];
}

export interface Disorder {
  slug: string;
  name: string;
  enigma_overlay: string;
  tier: Tier;
  affected_structures: string[];
  summary: string;
  citations: Citation[];
}

export interface Neuromodulator {
  slug: string;
  name: string;
  abbreviation: string;
  nuclei: string[];
  tier: Tier;
  projections: string[];
  citations: Citation[];
}
