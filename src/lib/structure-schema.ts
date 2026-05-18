import { z } from "zod";
import { Tier } from "./tier";

const citationSchema = z.object({
  doi: z.string().min(4),
  year: z.number().int().min(1800).max(2100),
  journal: z.string().min(1),
  title: z.string().optional(),
});

const tierSchema = z.nativeEnum(Tier);

const crosswalkSchema = z.object({
  source_atlas: z.string(),
  source_label: z.string(),
  target_atlas: z.string(),
  target_label: z.string(),
  confidence: tierSchema,
  citation: citationSchema,
});

const functionalClaimSchema = z
  .object({
    claim: z.string().min(1),
    tier: tierSchema,
    tier_justification: z.string().min(1),
    citations: z.array(citationSchema).min(1),
    contradicting: z.array(citationSchema).optional(),
  })
  .superRefine((claim, context) => {
    if (claim.tier !== Tier.ROBUST && (!claim.contradicting || claim.contradicting.length === 0)) {
      context.addIssue({
        code: "custom",
        message: "Plausible and speculative claims require contradicting citations.",
        path: ["contradicting"],
      });
    }
  });

export const structureSchema = z.object({
  structure_id: z.string().min(1),
  names: z.object({
    latin: z.string(),
    english: z.string(),
    abbreviations: z.array(z.string()),
  }),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  atlas_links: z.object({
    hcp_mmp1: z.string().optional(),
    julich_brain: z.string().optional(),
    brodmann: z.number().int().optional(),
    von_economo: z.string().optional(),
    dk: z.string().optional(),
    aal3: z.string().optional(),
    allen_ccf: z.string().optional(),
    crosswalks: z.array(crosswalkSchema),
  }),
  location: z.object({
    mni_centroid_left: z.tuple([z.number(), z.number(), z.number()]).optional(),
    mni_centroid_right: z.tuple([z.number(), z.number(), z.number()]).optional(),
    ccf_centroid: z.tuple([z.number(), z.number(), z.number()]).optional(),
    neighbors: z.array(z.string()),
    parent: z.string().nullable(),
    children: z.array(z.string()),
  }),
  cytoarchitecture: z.object({
    layers: z.string().optional(),
    cell_classes: z.object({
      excitatory: z.array(z.string()),
      inhibitory: z.array(z.string()),
      glia: z.array(z.string()).optional(),
    }),
    siletti_clusters: z.array(z.string()).optional(),
    yao_clusters: z.array(z.string()).optional(),
  }),
  inputs: z.object({
    afferent_cortical: z.array(z.string()),
    afferent_subcortical: z.array(z.string()),
    afferent_modulatory: z.array(z.string()),
  }),
  outputs: z.object({
    efferent_cortical: z.array(z.string()),
    efferent_subcortical: z.array(z.string()),
  }),
  functions: z.array(functionalClaimSchema).min(1),
  neurotransmitters: z.object({
    intrinsic: z.array(z.string()),
    modulatory: z.array(z.string()),
  }),
  disorders: z.array(
    z.object({
      disorder: z.string(),
      association: z.string(),
      effect_size: z.number().optional(),
      tier: tierSchema,
      citations: z.array(citationSchema).min(1),
    }),
  ),
  imaging: z.object({
    t1_signal: z.string(),
    t2_signal: z.string().optional(),
    fmri_tasks: z.array(z.string()),
    pet_tracers: z.array(z.string()).optional(),
  }),
  development: z.object({
    embryonic_origin: z.string(),
    peak_synaptogenesis: z.string(),
    myelination: z.string(),
    adult_neurogenesis: z
      .object({
        tier: tierSchema,
        tier_justification: z.string(),
        citations: z.array(citationSchema).min(1),
      })
      .optional(),
  }),
  primary_citations: z.array(citationSchema).min(3),
  gradient_value: z.number().optional(),
});

export const structuresSchema = z.array(structureSchema);
