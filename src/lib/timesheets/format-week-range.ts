/**
 * Formats an ISO week span like the Figma example: "1 - 5 January, 2024".
 * Falls back gracefully across month boundaries.
 */
export function formatWeekDateRangeDisplay(startIso: string, endIso: string): string {
  const start = new Date(`${startIso}T12:00:00`);
  const end = new Date(`${endIso}T12:00:00`);

  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();

  const monthYearFormatter = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  });

  const dayFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric" });

  if (sameMonth) {
    const monthYear = monthYearFormatter.format(start);
    return `${dayFormatter.format(start)} - ${dayFormatter.format(end)} ${monthYear}`;
  }

  const fullFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${fullFormatter.format(start)} - ${fullFormatter.format(end)}`;
}
