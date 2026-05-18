import { PrincipalGradientExplorer } from "@/components/interactive/PrincipalGradientExplorer";

export default function GradientPage() {
  return (
    <section className="container section">
      <p className="eyebrow">Margulies G1</p>
      <h1>Principal Gradient</h1>
      <p className="lead">
        Sensorimotor to transmodal organization scaffolded at the structure
        level.
      </p>
      <PrincipalGradientExplorer />
    </section>
  );
}
