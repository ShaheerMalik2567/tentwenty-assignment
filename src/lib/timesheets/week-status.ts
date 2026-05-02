import { TARGET_WEEK_HOURS } from "@/lib/timesheets/constants";

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
