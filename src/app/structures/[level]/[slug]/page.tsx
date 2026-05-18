import { notFound } from "next/navigation";
import { StructureCard } from "@/components/content/StructureCard";
import { TOC } from "@/components/layout/TOC";
import { findStructure, getStructureRoutes } from "@/lib/structures";

export function generateStaticParams() {
  return getStructureRoutes().map(({ level, slug }) => ({ level, slug }));
}

export default async function StructurePage({ params }: { params: Promise<{ level: string; slug: string }> }) {
  const { level, slug } = await params;
  const structure = findStructure(level, slug);

  if (!structure) {
    notFound();
  }

  return (
    <section className="container section split">
      <StructureCard structure={structure} />
      <TOC
        items={[
          { href: "#macroanatomy", label: "Macroanatomy" },
          { href: "#microanatomy", label: "Microanatomy" },
          { href: "#atlas-crosswalk", label: "Atlas crosswalk" },
          { href: "#cytoarchitecture", label: "Cytoarchitecture" },
          { href: "#connectivity", label: "Connectivity" },
          { href: "#functions", label: "Functions" },
          { href: "#imaging", label: "Imaging" },
          { href: "#citations", label: "Citations" },
        ]}
      />
    </section>
  );
}
