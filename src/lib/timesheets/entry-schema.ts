import { z } from "zod";

import {
  PROJECT_OPTIONS,
  WORK_TYPE_OPTIONS,
} from "@/lib/timesheets/entry-modal-options";

const projectValues = PROJECT_OPTIONS as unknown as string[];
const workTypeValues = WORK_TYPE_OPTIONS as unknown as string[];

/** Shared validation for create/update bodies (client forms + API routes). */
export function createTimesheetEntryBodySchema(
  weekStartDate: string,
  weekEndDate: string,
) {
  return z
    .object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date."),
      description: z
        .string()
        .trim()
        .min(1, "Description is required.")
        .max(500, "Description is too long."),
      hours: z
        .number()
        .min(0.25, "Minimum 15 minutes (0.25h).")
        .max(24, "Cannot exceed 24 hours per row."),
      projectName: z
        .string()
        .trim()
        .refine((v) => projectValues.includes(v), {
          message: "Select a project.",
        }),
      workType: z
        .string()
        .trim()
        .refine((v) => workTypeValues.includes(v), {
          message: "Select a type of work.",
        }),
    })
    .refine(
      (data) => data.date >= weekStartDate && data.date <= weekEndDate,
      {
        message: "Pick a date inside this week.",
        path: ["date"],
      },
    );
}

export type TimesheetEntryBodyInput = z.infer<
  ReturnType<typeof createTimesheetEntryBodySchema>
>;
