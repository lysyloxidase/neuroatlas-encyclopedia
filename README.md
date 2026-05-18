# NeuroAtlas Encyclopedia

v1.0.0 production release of a Next.js 15 encyclopedia with a four-atlas reference backbone, tiered functional claims, cellular taxonomy, network/tract/disorder overlays, developmental timeline, explainers, quizzes, search, and accessibility-first viewer controls.

## Backbone

- HCP-MMP1: 360 cortical areas
- Julich-Brain v3.1: 248 cortical plus 64 subcortical cytoarchitectonic labels
- Allen CCFv3: mouse ontology scaffold
- Desikan-Killiany: 68 gyral parcels

Large atlas volumes and meshes are CDN-oriented assets. Keep production binaries in Cloudflare R2 or equivalent object storage and serve them through immutable CDN cache headers; the app keeps deterministic lightweight stand-ins so CI builds stay fast.

## Commands

```bash
npm install
npm run tier:audit
npm run typecheck
npm run lint
npm test
npm run verify:dois
npm run build
```

## v1.0 Surfaces

- Final Three.js viewer: parcellations, Yeo overlays, ENIGMA heatmaps, tracts, gradient, cross-sections, BigBrain inset, subcortical peeling, and keyboard navigation.
- Development: BrainSpan and PsychENCODE timeline from 8 PCW to 40 years.
- Connectome: HCP 360-node structural graph with Yeo communities and rich-club markers.
- Explain: 12 Distill-style narratives with interactive widgets and DOI trails.
- Learn: tier-aware quizzes with local progress.
- Quality: deterministic tier audit report, DOI verification, CI scaffold, licensing, caveats, and acknowledgments.

## Tier System

- 🟢 Robust: at least five independent replications or consensus.
- 🟡 Plausible: two to four studies, mechanism debated.
- 🔴 Speculative: single study, computational-only, or unsettled claim.

Plausible and speculative functional claims require contradicting citations in the schema.
