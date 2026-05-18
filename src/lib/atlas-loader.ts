export type AtlasKey = "hcp_mmp1" | "julich_brain_v31" | "allen_ccf_v3" | "desikan_killiany";

export interface AtlasFile {
  key: AtlasKey;
  label: string;
  shortLabel: string;
  file: string;
  publicPath: string;
  citation: string;
  license: string;
  n_areas?: number;
  n_structures?: number;
  modality: "CIFTI dlabel" | "NIfTI volume" | "FreeSurfer annotation";
  color: string;
}

export const CIFTI_FILES: Record<AtlasKey, AtlasFile> = {
  hcp_mmp1: {
    key: "hcp_mmp1",
    label: "HCP-MMP1",
    shortLabel: "HCP",
    file: "Glasser_360_dlabel.nii",
    publicPath: "/volumes/HCP-MMP1.nii.gz",
    citation: "Glasser 2016 Nature 536:171 DOI:10.1038/nature18933",
    license: "CC-BY",
    n_areas: 360,
    modality: "CIFTI dlabel",
    color: "#06b6d4",
  },
  julich_brain_v31: {
    key: "julich_brain_v31",
    label: "Julich-Brain v3.1",
    shortLabel: "Julich",
    file: "Julich-Brain_v3.1_MPM.nii.gz",
    publicPath: "/volumes/julich-brain-v3.1.nii.gz",
    citation: "Amunts 2020 Science 369:988 DOI:10.1126/science.abb4588",
    license: "CC-BY",
    n_areas: 248,
    n_structures: 64,
    modality: "NIfTI volume",
    color: "#8b5cf6",
  },
  allen_ccf_v3: {
    key: "allen_ccf_v3",
    label: "Allen CCFv3",
    shortLabel: "Allen",
    file: "average_template_25.nii.gz",
    publicPath: "/volumes/allen-ccf-v3.nii.gz",
    citation: "Wang 2020 Cell 181:936 DOI:10.1016/j.cell.2020.04.007",
    license: "CC-BY",
    n_structures: 800,
    modality: "NIfTI volume",
    color: "#f97316",
  },
  desikan_killiany: {
    key: "desikan_killiany",
    label: "Desikan-Killiany",
    shortLabel: "DK",
    file: "aparc.DKTatlas.annot",
    publicPath: "/volumes/aparc.DKTatlas.annot",
    citation: "Desikan 2006 NeuroImage 31:968 DOI:10.1016/j.neuroimage.2006.01.021",
    license: "free",
    n_areas: 68,
    modality: "FreeSurfer annotation",
    color: "#10b981",
  },
};

export function listAtlases(): AtlasFile[] {
  return Object.values(CIFTI_FILES);
}

export function getAtlas(key: AtlasKey): AtlasFile {
  return CIFTI_FILES[key];
}

export interface AtlasRenderLayer {
  atlas: AtlasFile;
  textureUniform: string;
  labelMapPath: string;
  renderMode: "surface-labels" | "volume-slices" | "annotation";
}

export function createAtlasRenderLayer(key: AtlasKey): AtlasRenderLayer {
  const atlas = getAtlas(key);
  const renderMode =
    atlas.modality === "FreeSurfer annotation"
      ? "annotation"
      : atlas.modality === "NIfTI volume"
        ? "volume-slices"
        : "surface-labels";

  return {
    atlas,
    textureUniform: `u_${key}_labels`,
    labelMapPath: atlas.publicPath,
    renderMode,
  };
}

export function assertFourAtlasBackbone(): void {
  const keys = Object.keys(CIFTI_FILES);
  if (keys.length !== 4) {
    throw new Error(`Expected 4 atlas backbones, found ${keys.length}.`);
  }
}
