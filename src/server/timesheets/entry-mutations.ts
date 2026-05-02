import type { TimesheetEntry } from "@/server/mock/types";
import { getStore, touchWeek } from "@/server/mock/store";

function nowIso() {
  return new Date().toISOString();
}

function newEntryId() {
  return `e_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

export type EntryMutationError =
  | "week_not_found"
  | "entry_not_found"
  | "wrong_week"
  | "date_outside_week";

export function createTimesheetEntry(input: {
  weekId: string;
  date: string;
  description: string;
  hours: number;
  projectName: string;
  workType: string;
}): TimesheetEntry | EntryMutationError {
  const store = getStore();
  const week = store.weeks.find((w) => w.id === input.weekId);
  if (!week) return "week_not_found";
  if (input.date < week.startDate || input.date > week.endDate) {
    return "date_outside_week";
  }

  const ts = nowIso();
  const entry: TimesheetEntry = {
    id: newEntryId(),
    weekId: input.weekId,
    date: input.date,
    description: input.description.trim(),
    hours: input.hours,
    projectName: input.projectName.trim(),
    workType: input.workType.trim(),
    createdAt: ts,
    updatedAt: ts,
  };
  store.entries.push(entry);
  touchWeek(input.weekId);
  return entry;
}

export function updateTimesheetEntry(input: {
  weekId: string;
  entryId: string;
  date: string;
  description: string;
  hours: number;
  projectName: string;
  workType: string;
}): TimesheetEntry | EntryMutationError {
  const store = getStore();
  const week = store.weeks.find((w) => w.id === input.weekId);
  if (!week) return "week_not_found";
  if (input.date < week.startDate || input.date > week.endDate) {
    return "date_outside_week";
  }

  const entry = store.entries.find((e) => e.id === input.entryId);
  if (!entry) return "entry_not_found";
  if (entry.weekId !== input.weekId) return "wrong_week";

  entry.date = input.date;
  entry.description = input.description.trim();
  entry.hours = input.hours;
  entry.projectName = input.projectName.trim();
  entry.workType = input.workType.trim();
  entry.updatedAt = nowIso();
  touchWeek(input.weekId);
  return entry;
}

export function deleteTimesheetEntry(
  weekId: string,
  entryId: string,
): true | EntryMutationError {
  const store = getStore();
  const idx = store.entries.findIndex((e) => e.id === entryId);
  if (idx === -1) return "entry_not_found";
  const entry = store.entries[idx]!;
  if (entry.weekId !== weekId) return "wrong_week";
  store.entries.splice(idx, 1);
  touchWeek(weekId);
  return true;
}
