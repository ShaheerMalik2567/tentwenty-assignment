import type { MockUser, TimesheetEntry, TimesheetWeek } from "./types";

const now = () => new Date().toISOString();

export const seedUsers: MockUser[] = [
  {
    id: "u_1",
    name: "John Doe",
    email: "candidate@tentwenty.com",
    password: "password123",
  },
];

/**
 * Demo weeks covering pagination (5 per page in design). Dates are ISO (yyyy-mm-dd).
 * Internal `status` mirrors workflow; UI badges derive from logged hours + target.
 */
export const seedWeeks: TimesheetWeek[] = [
  {
    id: "w_2026_01",
    weekNumber: 1,
    startDate: "2026-01-05",
    endDate: "2026-01-11",
    status: "approved",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_02",
    weekNumber: 2,
    startDate: "2026-01-12",
    endDate: "2026-01-18",
    status: "submitted",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_03",
    weekNumber: 3,
    startDate: "2026-01-19",
    endDate: "2026-01-25",
    status: "draft",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_04",
    weekNumber: 4,
    startDate: "2026-01-26",
    endDate: "2026-02-01",
    status: "draft",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_05",
    weekNumber: 5,
    startDate: "2026-02-02",
    endDate: "2026-02-08",
    status: "approved",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_06",
    weekNumber: 6,
    startDate: "2026-02-09",
    endDate: "2026-02-15",
    status: "submitted",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_07",
    weekNumber: 7,
    startDate: "2026-02-16",
    endDate: "2026-02-22",
    status: "draft",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_08",
    weekNumber: 8,
    startDate: "2026-02-23",
    endDate: "2026-02-29",
    status: "draft",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_09",
    weekNumber: 9,
    startDate: "2026-03-01",
    endDate: "2026-03-07",
    status: "approved",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_10",
    weekNumber: 10,
    startDate: "2026-03-08",
    endDate: "2026-03-14",
    status: "submitted",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_11",
    weekNumber: 11,
    startDate: "2026-03-15",
    endDate: "2026-03-21",
    status: "draft",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_12",
    weekNumber: 12,
    startDate: "2026-03-22",
    endDate: "2026-03-28",
    status: "draft",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_13",
    weekNumber: 13,
    startDate: "2026-03-29",
    endDate: "2026-04-04",
    status: "approved",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_14",
    weekNumber: 14,
    startDate: "2026-04-06",
    endDate: "2026-04-12",
    status: "submitted",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "w_2026_15",
    weekNumber: 15,
    startDate: "2026-04-13",
    endDate: "2026-04-19",
    status: "draft",
    createdAt: now(),
    updatedAt: now(),
  },
];

let entrySeq = 0;
function entry(
  partial: Omit<TimesheetEntry, "id" | "createdAt" | "updatedAt" | "workType"> & {
    workType?: string;
  },
): TimesheetEntry {
  entrySeq += 1;
  const ts = now();
  return {
    ...partial,
    workType: partial.workType ?? "Feature development",
    id: `e_${entrySeq}`,
    createdAt: ts,
    updatedAt: ts,
  };
}

/** Mix of full weeks (40h), partial weeks, and empty weeks for badge demos. */
export const seedEntries: TimesheetEntry[] = [
  // Week 1 — completed (40h)
  entry({
    weekId: "w_2026_01",
    date: "2026-01-05",
    hours: 8,
    description: "Homepage Development",
    projectName: "Marketing Site",
  }),
  entry({
    weekId: "w_2026_01",
    date: "2026-01-06",
    hours: 8,
    description: "API integration",
    projectName: "Core Platform",
  }),
  entry({
    weekId: "w_2026_01",
    date: "2026-01-07",
    hours: 8,
    description: "QA & fixes",
    projectName: "Core Platform",
  }),
  entry({
    weekId: "w_2026_01",
    date: "2026-01-08",
    hours: 8,
    description: "Design review",
    projectName: "Marketing Site",
  }),
  entry({
    weekId: "w_2026_01",
    date: "2026-01-09",
    hours: 8,
    description: "Sprint planning support",
    projectName: "Internal",
  }),
  // Week 2 — incomplete
  entry({
    weekId: "w_2026_02",
    date: "2026-01-13",
    hours: 7.5,
    description: "Dashboard charts",
    projectName: "Analytics",
  }),
  entry({
    weekId: "w_2026_02",
    date: "2026-01-15",
    hours: 6,
    description: "Accessibility audit",
    projectName: "Marketing Site",
  }),
  // Week 3 — missing (no rows)
  // Week 4 — incomplete
  entry({
    weekId: "w_2026_04",
    date: "2026-01-28",
    hours: 4,
    description: "Spike: TanStack Table",
    projectName: "Internal",
  }),
  // Week 5 — completed
  ...["2026-02-02", "2026-02-03", "2026-02-04", "2026-02-05", "2026-02-06"].map(
    (date, i) =>
      entry({
        weekId: "w_2026_05",
        date,
        hours: 8,
        description: `Delivery day ${i + 1}`,
        projectName: "Core Platform",
      }),
  ),
  // Week 6 — incomplete
  entry({
    weekId: "w_2026_06",
    date: "2026-02-10",
    hours: 12,
    description: "Timesheet filters",
    projectName: "Internal",
  }),
  // Week 7 — missing
  // Week 8 — incomplete
  entry({
    weekId: "w_2026_08",
    date: "2026-02-24",
    hours: 3.5,
    description: "Bug triage",
    projectName: "Core Platform",
    workType: "Bug fixes",
  }),
  // Week 9 — completed
  ...["2026-03-02", "2026-03-03", "2026-03-04", "2026-03-05", "2026-03-06"].map(
    (date, i) =>
      entry({
        weekId: "w_2026_09",
        date,
        hours: 8,
        description: `Feature rollout ${i + 1}`,
        projectName: "Marketing Site",
      }),
  ),
  // Week 10 — incomplete
  entry({
    weekId: "w_2026_10",
    date: "2026-03-09",
    hours: 10,
    description: "Navigation shell",
    projectName: "Internal",
  }),
  entry({
    weekId: "w_2026_10",
    date: "2026-03-11",
    hours: 5,
    description: "Dropdown polish",
    projectName: "Internal",
  }),
  // Week 11 — missing
  // Week 12 — incomplete
  entry({
    weekId: "w_2026_12",
    date: "2026-03-23",
    hours: 16,
    description: "End-to-end testing",
    projectName: "Core Platform",
  }),
  // Week 13 — completed (40h template)
  ...["2026-03-30", "2026-03-31", "2026-04-01", "2026-04-02", "2026-04-03"].map(
    (date, i) =>
      entry({
        weekId: "w_2026_13",
        date,
        hours: 8,
        description: `Launch prep ${i + 1}`,
        projectName: "Analytics",
      }),
  ),
  // Week 14 — incomplete (from earlier scaffold)
  entry({
    weekId: "w_2026_14",
    date: "2026-04-07",
    hours: 7.5,
    description: "UI polish",
    projectName: "Marketing Site",
  }),
  // Week 15 — missing
];
