export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function levelPath(level: 1 | 2 | 3): string {
  return `level-${level}`;
}
