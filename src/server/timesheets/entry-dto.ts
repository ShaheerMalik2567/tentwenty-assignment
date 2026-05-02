import type { TimesheetEntry } from "@/server/mock/types";
import type { TimesheetEntryDto } from "@/types/timesheet";

export function toTimesheetEntryDto(entry: TimesheetEntry): TimesheetEntryDto {
  return {
    id: entry.id,
    weekId: entry.weekId,
    date: entry.date,
    description: entry.description,
    hours: entry.hours,
    projectName: entry.projectName,
    workType: entry.workType,
  };
}
