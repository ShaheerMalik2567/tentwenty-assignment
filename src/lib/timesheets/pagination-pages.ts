/** Builds compact page number chunks with ellipses for long page counts. */
export function buildPaginationItems(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 1) return [1];
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (let p = currentPage - 2; p <= currentPage + 2; p++) {
    if (p > 1 && p < totalPages) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const out: Array<number | "ellipsis"> = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i]!;
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev > 1) out.push("ellipsis");
    out.push(p);
  }
  return out;
}
