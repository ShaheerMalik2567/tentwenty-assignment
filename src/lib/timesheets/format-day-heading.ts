/** Short heading like "21 Jan" / "Jan 21" for grouping rows by ISO date. */
export function formatDayHeading(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
  }).format(d);
}
