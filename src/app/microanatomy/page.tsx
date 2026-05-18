import { AmygdalaExplorer } from "@/components/microanatomy/AmygdalaExplorer";
import { BiccnInhibitoryBrowser } from "@/components/microanatomy/BiccnInhibitoryBrowser";
import { BrodmannMappingExplorer } from "@/components/microanatomy/BrodmannMappingExplorer";
import { CorticalLaminationViewer } from "@/components/microanatomy/CorticalLaminationViewer";
import { HippocampalSubfieldViewer } from "@/components/microanatomy/HippocampalSubfieldViewer";
import { LocusCoeruleusCard } from "@/components/microanatomy/LocusCoeruleusCard";
import { PagColumns } from "@/components/microanatomy/PagColumns";
import { StriosomePathwayCard } from "@/components/microanatomy/StriosomePathwayCard";
import { ThalamicNucleiOverlay } from "@/components/microanatomy/ThalamicNucleiOverlay";
import { structures } from "@/lib/structures";

export default function MicroanatomyPage() {
  const level2Count = structures.filter((structure) => structure.level === 2).length;

  return (
    <section className="container section">
      <p className="eyebrow">Level 2</p>
      <h1>Microanatomy</h1>
      <p className="lead">{level2Count} Level 2 entries across lamination, Brodmann, von Economo, hippocampus, amygdala, thalamus, hypothalamus, brainstem, cerebellar microcircuits, and basal ganglia compartments.</p>
      <div className="grid" style={{ marginTop: "1rem" }}>
        <CorticalLaminationViewer />
        <BiccnInhibitoryBrowser />
        <BrodmannMappingExplorer />
        <HippocampalSubfieldViewer />
        <AmygdalaExplorer />
        <ThalamicNucleiOverlay />
        <PagColumns />
        <LocusCoeruleusCard />
        <StriosomePathwayCard />
      </div>
    </section>
  );
}
