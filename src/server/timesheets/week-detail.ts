import { TARGET_WEEK_HOURS } from "@/lib/timesheets/constants";
import { formatWeekDateRangeDisplay } from "@/lib/timesheets/timesheet-utils";
import type { TimesheetWeek } from "@/server/mock/types";
import { getStore } from "@/server/mock/store";
import type { TimesheetWeekDetailResponse } from "@/types/timesheet";

export function getWeekDetailOrNull(
  weekId: string,
): TimesheetWeekDetailResponse | null {
  const store = getStore();
  const week: TimesheetWeek | undefined = store.weeks.find((w) => w.id === weekId);
  if (!week) return null;

  const entries = store.entries
    .filter((e) => e.weekId === weekId)
    .slice()
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.description.localeCompare(b.description),
    );

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  const progressPercent = Math.min(
    100,
    Math.round((totalHours / TARGET_WEEK_HOURS) * 100),
  );

  return {
    week: {
      id: week.id,
      weekNumber: week.weekNumber,
      startDate: week.startDate,
      endDate: week.endDate,
      dateRangeLabel: formatWeekDateRangeDisplay(week.startDate, week.endDate),
    },
    entries: entries.map((e) => ({
      id: e.id,
      weekId: e.weekId,
      date: e.date,
      description: e.description,
      hours: e.hours,
      projectName: e.projectName,
      workType: e.workType,
    })),
    totalHours,
    targetHours: TARGET_WEEK_HOURS,
    progressPercent,
  };
}
