# NeuroAtlas Encyclopedia

Phase 1 scaffold for a Next.js 15 encyclopedia with a four-atlas reference backbone, tiered functional claims, and a YAML-compatible per-structure schema.

## Backbone

- HCP-MMP1: 360 cortical areas
- Julich-Brain v3.1: 248 cortical plus 64 subcortical cytoarchitectonic labels
- Allen CCFv3: mouse ontology scaffold
- Desikan-Killiany: 68 gyral parcels

Large atlas volumes are represented by `public/volumes/manifest.json` in Phase 1 so the app can build without committing multi-GB binaries. Drop the real files into `public/volumes/` using the manifest filenames to connect the viewer to production assets.

## Commands

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Tier System

- 🟢 Robust: at least five independent replications or consensus.
- 🟡 Plausible: two to four studies, mechanism debated.
- 🔴 Speculative: single study, computational-only, or unsettled claim.

Plausible and speculative functional claims require contradicting citations in the schema.
