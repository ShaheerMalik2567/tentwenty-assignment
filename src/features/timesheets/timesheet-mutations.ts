"use client";

import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

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

async function postTimesheetEntry(
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

async function putTimesheetEntry(
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

async function deleteTimesheetEntryApi(
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
      toast.success("Entry added");
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Could not add entry",
      );
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
      toast.success("Entry updated");
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Could not update entry",
      );
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
      toast.success("Entry deleted");
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Could not delete entry",
      );
    },
  });
}
