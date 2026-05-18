const caveats = [
  "≈533-entry first release is defensible; do not mix atlas bases.",
  "Brodmann 1909 is essential pedagogically but not ground truth.",
  "Functional-network labels are coarse; individual topology is idiosyncratic.",
  "Cell-type taxonomies are still consolidating across Siletti, Yao, and Bakken granularity.",
  "Disorder mappings are statistical, NOT deterministic.",
  "Mirror neurons in humans remain 🟡 because direct single-unit evidence is limited.",
  "DBS targets are indication-specific and not routine for treatment-resistant depression.",
  "Adult human hippocampal neurogenesis remains contested.",
  "Pseudoscience is excluded: left/right-brain personality, 10% of brain, and limbic-as-emotion-centre claims.",
  "fMRI replication base is uneven; task fMRI individual reliability can be low.",
  "Brodmann gaps are acknowledged, not fabricated.",
  "Hemispheric asymmetry is presented as population statistics, not individual rules.",
];

export default function CaveatsPage() {
  return (
    <section className="container section">
      <p className="eyebrow">Non-negotiable limitations</p>
      <h1>Caveats</h1>
      <ol className="caveat-list">
        {caveats.map((caveat) => (
          <li key={caveat}>{caveat}</li>
        ))}
      </ol>
    </section>
  );
}
