import type { TimesheetEntryDto } from "@/types/timesheet";

/** Groups entries under their ISO `date` key (sorted chronologically). */
export function groupEntriesByDate(
  entries: TimesheetEntryDto[],
): Array<[string, TimesheetEntryDto[]]> {
  const map = new Map<string, TimesheetEntryDto[]>();
  for (const entry of entries) {
    const bucket = map.get(entry.date) ?? [];
    bucket.push(entry);
    map.set(entry.date, bucket);
  }

  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}
