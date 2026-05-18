interface TOCItem {
  href: string;
  label: string;
}

export function TOC({ items }: { items: TOCItem[] }) {
  return (
    <aside className="card toc">
      <h3>Contents</h3>
      <ul className="list">
        {items.map((item) => (
          <li key={item.href}>
            <a className="muted" href={item.href}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
