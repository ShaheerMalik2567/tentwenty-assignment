import { cn } from "@/lib/utils";
import type { TimesheetUiStatus } from "@/lib/timesheets/timesheet-utils";

const LABEL: Record<TimesheetUiStatus, string> = {
  completed: "COMPLETED",
  incomplete: "INCOMPLETE",
  missing: "MISSING",
};

/** Figma hex pairs: fg on tinted bg (no ring — matches design pills). */
const STYLES: Record<TimesheetUiStatus, string> = {
  completed:
    "bg-timesheet-status-complete-bg text-timesheet-status-complete-fg",
  incomplete:
    "bg-timesheet-status-warn-bg text-timesheet-status-warn-fg",
  missing:
    "bg-timesheet-status-miss-bg text-timesheet-status-miss-fg",
};

export function TimesheetStatusBadge({
  status,
  className,
}: {
  status: TimesheetUiStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase",
        STYLES[status],
        className,
      )}
    >
      {LABEL[status]}
    </span>
  );
}
