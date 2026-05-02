import { seedEntries, seedUsers, seedWeeks } from "./seed";
import type { MockUser, TimesheetEntry, TimesheetWeek } from "./types";

type Store = {
  users: MockUser[];
  weeks: TimesheetWeek[];
  entries: TimesheetEntry[];
};

declare global {
  var __mockStore: Store | undefined;
}

const now = () => new Date().toISOString();

function initStore(): Store {
  return {
    users: structuredClone(seedUsers),
    weeks: structuredClone(seedWeeks),
    entries: structuredClone(seedEntries),
  };
}

export function getStore() {
  if (!globalThis.__mockStore) globalThis.__mockStore = initStore();
  return globalThis.__mockStore;
}

export function touchWeek(weekId: string) {
  const store = getStore();
  const week = store.weeks.find((w) => w.id === weekId);
  if (week) week.updatedAt = now();
}

