import { TARGET_WEEK_HOURS } from "@/lib/timesheets/constants";

/* ─── Week status (dashboard badges) ─────────────────────────────────────── */

/** Matches dashboard badges: COMPLETED / INCOMPLETE / MISSING */
export type TimesheetUiStatus = "completed" | "incomplete" | "missing";

/**
 * Derives UI status from total logged hours for a week.
 * — completed: at or above weekly target
 * — incomplete: some hours, but below target
 * — missing: no hours logged
 */
export function getTimesheetUiStatus(totalHours: number): TimesheetUiStatus {
  if (totalHours <= 0) return "missing";
  if (totalHours >= TARGET_WEEK_HOURS) return "completed";
  return "incomplete";
}

/* ─── Date / range formatting ───────────────────────────────────────────── */

/**
 * Formats an ISO week span like the Figma example: "1 - 5 January, 2024".
 * Falls back gracefully across month boundaries.
 */
export function formatWeekDateRangeDisplay(
  startIso: string,
  endIso: string,
): string {
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

/** Short heading like "21 Jan" / "Jan 21" for grouping rows by ISO date. */
export function formatDayHeading(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
  }).format(d);
}

/* ─── Entries grouping ────────────────────────────────────────────────────── */

/** Groups entries under their ISO `date` key (sorted chronologically). */
export function groupEntriesByDate<T extends { date: string }>(
  entries: T[],
): Array<[string, T[]]> {
  const map = new Map<string, T[]>();
  for (const entry of entries) {
    const bucket = map.get(entry.date) ?? [];
    bucket.push(entry);
    map.set(entry.date, bucket);
  }

  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

/* ─── Pagination UI ───────────────────────────────────────────────────────── */

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
