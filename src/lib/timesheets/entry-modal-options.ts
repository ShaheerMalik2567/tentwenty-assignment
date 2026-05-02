/** Dropdown values aligned with seeded projects + Figma “Type of Work”. */

export const PROJECT_OPTIONS = [
  "Marketing Site",
  "Core Platform",
  "Internal",
  "Analytics",
] as const;

export type ProjectOption = (typeof PROJECT_OPTIONS)[number];

export const WORK_TYPE_OPTIONS = [
  "Bug fixes",
  "Feature development",
  "Design",
  "Meetings",
  "Documentation",
  "QA & testing",
] as const;

export type WorkTypeOption = (typeof WORK_TYPE_OPTIONS)[number];
