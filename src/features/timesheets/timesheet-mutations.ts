"use client";

import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import { weekDetailQueryKey } from "@/features/timesheets/timesheet-queries";
import type { TimesheetEntryBodyInput } from "@/lib/timesheets/entry-schema";
import type { TimesheetEntryDto } from "@/types/timesheet";

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function postTimesheetEntry(
  weekId: string,
  body: TimesheetEntryBodyInput,
): Promise<TimesheetEntryDto> {
  const res = await fetch(`/api/timesheets/${weekId}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await readError(res));
  const data = (await res.json()) as { entry: TimesheetEntryDto };
  return data.entry;
}

export async function putTimesheetEntry(
  weekId: string,
  entryId: string,
  body: TimesheetEntryBodyInput,
): Promise<TimesheetEntryDto> {
  const res = await fetch(
    `/api/timesheets/${weekId}/entries/${entryId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) throw new Error(await readError(res));
  const data = (await res.json()) as { entry: TimesheetEntryDto };
  return data.entry;
}

export async function deleteTimesheetEntryApi(
  weekId: string,
  entryId: string,
): Promise<void> {
  const res = await fetch(
    `/api/timesheets/${weekId}/entries/${entryId}`,
    { method: "DELETE" },
  );
  if (!res.ok) throw new Error(await readError(res));
}

function invalidateTimesheets(qc: QueryClient) {
  void qc.invalidateQueries({ queryKey: ["timesheets"] });
}

export function useCreateTimesheetEntry(weekId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: TimesheetEntryBodyInput) =>
      postTimesheetEntry(weekId, body),
    onSuccess: () => {
      invalidateTimesheets(qc);
      void qc.invalidateQueries({ queryKey: weekDetailQueryKey(weekId) });
    },
  });
}

export function useUpdateTimesheetEntry(weekId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      entryId,
      body,
    }: {
      entryId: string;
      body: TimesheetEntryBodyInput;
    }) => putTimesheetEntry(weekId, entryId, body),
    onSuccess: () => {
      invalidateTimesheets(qc);
      void qc.invalidateQueries({ queryKey: weekDetailQueryKey(weekId) });
    },
  });
}

export function useDeleteTimesheetEntry(weekId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entryId: string) =>
      deleteTimesheetEntryApi(weekId, entryId),
    onSuccess: () => {
      invalidateTimesheets(qc);
      void qc.invalidateQueries({ queryKey: weekDetailQueryKey(weekId) });
    },
  });
}
