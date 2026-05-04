import type { TimesheetUiStatus } from "@/lib/timesheets/timesheet-utils";

/** Sort fields supported by GET /api/timesheets (must stay in sync with the route handler). */
export type TimesheetListSortField = "week" | "date" | "status";

/** Row returned by GET /api/timesheets (list view). */
export type TimesheetListRow = {
  id: string;
  weekNumber: number;
  dateRangeLabel: string;
  status: TimesheetUiStatus;
  totalHours: number;
};

export type TimesheetListResponse = {
  items: TimesheetListRow[];
  total: number;
  page: number;
  pageSize: number;
};

/** Single entry in the week detail API. */
export type TimesheetEntryDto = {
  id: string;
  weekId: string;
  date: string;
  description: string;
  hours: number;
  projectName: string;
  workType: string;
};

export type TimesheetWeekDetailResponse = {
  week: {
    id: string;
    weekNumber: number;
    startDate: string;
    endDate: string;
    dateRangeLabel: string;
  };
  entries: TimesheetEntryDto[];
  totalHours: number;
  targetHours: number;
  progressPercent: number;
};
