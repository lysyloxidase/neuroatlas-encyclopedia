"use client";

export const PAG_COLUMNS = [
  { column: "dmPAG", assignment: "escape" },
  { column: "dlPAG", assignment: "escape" },
  { column: "lPAG", assignment: "freezing" },
  { column: "vlPAG", assignment: "freezing" },
] as const;

export function PagColumns() {
  return (
    <section className="card" data-testid="pag-columns">
      <h3>PAG Columns</h3>
      <div className="grid">
        {PAG_COLUMNS.map((column) => (
          <article className="micro-tile" key={column.column}>
            <h3>{column.column}</h3>
            <p className="muted">{column.assignment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
