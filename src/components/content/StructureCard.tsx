import type { Structure } from "@/lib/types";
import { AtlasCrosswalk } from "./AtlasCrosswalk";
import { Citation } from "./Citation";
import { ConnectivityTable } from "./ConnectivityTable";
import { CytoarchitectureBox } from "./CytoarchitectureBox";
import { DevelopmentTrajectory } from "./DevelopmentTrajectory";
import { DisorderLink } from "./DisorderLink";
import { ImagingProfile } from "./ImagingProfile";
import { TierBadge } from "./TierBadge";

export function StructureCard({ structure }: { structure: Structure }) {
  return (
    <article className="list">
      <section className="card">
        <p className="eyebrow">Level {structure.level}</p>
        <h1>{structure.names.english}</h1>
        <p className="lead mono">{structure.names.latin}</p>
        <ul className="pill-list">
          {structure.names.abbreviations.map((abbr) => (
            <li key={abbr}>{abbr}</li>
          ))}
        </ul>
      </section>

      {structure.macroanatomy ? (
        <section className="card" id="macroanatomy">
          <div className="button-row">
            <h3>Macroanatomy</h3>
            {structure.macroanatomy.system_view_tier ? (
              <TierBadge
                tier={structure.macroanatomy.system_view_tier}
                justification="Displayed as a toggleable system view rather than a strict lobe boundary."
              />
            ) : null}
          </div>
          <p className="muted">{structure.macroanatomy.category}</p>
          {structure.macroanatomy.boundaries ? (
            <p>{structure.macroanatomy.boundaries}</p>
          ) : null}
          {structure.macroanatomy.subdivisions ? (
            <ul className="pill-list">
              {structure.macroanatomy.subdivisions.map((subdivision) => (
                <li key={subdivision}>{subdivision}</li>
              ))}
            </ul>
          ) : null}
          {structure.macroanatomy.note ? (
            <p className="muted">{structure.macroanatomy.note}</p>
          ) : null}
        </section>
      ) : null}

      {structure.microanatomy ? (
        <section className="card" id="microanatomy">
          <h3>Microanatomy</h3>
          <p className="muted">{structure.microanatomy.category}</p>
          {structure.microanatomy.laminar_profile ? (
            <p>{structure.microanatomy.laminar_profile}</p>
          ) : null}
          {structure.microanatomy.hcp_correspondence ? (
            <p>
              <strong>HCP-MMP1:</strong>{" "}
              {structure.microanatomy.hcp_correspondence.join(", ")}
            </p>
          ) : null}
          {structure.microanatomy.julich_correspondence ? (
            <p>
              <strong>Julich-Brain:</strong>{" "}
              {structure.microanatomy.julich_correspondence.join(", ")}
            </p>
          ) : null}
          {structure.microanatomy.compartments ? (
            <ul className="pill-list">
              {structure.microanatomy.compartments.map((compartment) => (
                <li key={compartment}>{compartment}</li>
              ))}
            </ul>
          ) : null}
          {structure.microanatomy.phase3_tags?.includes("NEW") ? (
            <span className="new-badge">NEW</span>
          ) : null}
        </section>
      ) : null}

      <AtlasCrosswalk structure={structure} />
      <CytoarchitectureBox structure={structure} />
      <ConnectivityTable structure={structure} />

      <section className="card" id="functions">
        <h3>Tiered Functional Claims</h3>
        <ul className="list">
          {structure.functions.map((claim) => (
            <li key={claim.claim}>
              <div className="button-row">
                {claim.claim.startsWith("NEW:") ? (
                  <span className="new-badge">NEW</span>
                ) : null}
                <TierBadge
                  tier={claim.tier}
                  justification={claim.tier_justification}
                />
                <strong>{claim.claim}</strong>
              </div>
              <p className="muted">{claim.tier_justification}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card" id="neurotransmitters">
        <h3>Neurotransmitters</h3>
        <p>
          <strong>Intrinsic:</strong>{" "}
          {structure.neurotransmitters.intrinsic.join(", ")}
        </p>
        <p>
          <strong>Modulatory:</strong>{" "}
          {structure.neurotransmitters.modulatory.join(", ")}
        </p>
      </section>

      <section className="card" id="disorders">
        <h3>Disorder Links</h3>
        <ul className="list">
          {structure.disorders.map((disorder) => (
            <DisorderLink key={disorder.disorder} disorder={disorder} />
          ))}
        </ul>
      </section>

      <ImagingProfile structure={structure} />
      <DevelopmentTrajectory structure={structure} />

      <section className="card" id="citations">
        <h3>Primary Citations</h3>
        <ul className="list">
          {structure.primary_citations.map((citation) => (
            <li key={citation.doi}>
              <Citation citation={citation} />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
