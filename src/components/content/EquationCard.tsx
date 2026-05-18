interface EquationCardProps {
  title: string;
  equation: string;
  description: string;
}

export function EquationCard({ title, equation, description }: EquationCardProps) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <p className="mono">{equation}</p>
      <p className="muted">{description}</p>
    </section>
  );
}
