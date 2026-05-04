"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useCallback, useState } from "react";

import { DeleteEntryDialog } from "@/components/timesheets/delete-entry-dialog";
import { EntryFormDialog } from "@/components/timesheets/entry-form-dialog";
import { getWeekDetailQuery } from "@/features/timesheets/timesheet-queries";
import { formatDayHeading, groupEntriesByDate } from "@/lib/timesheets/timesheet-utils";
import type { TimesheetEntryDto } from "@/types/timesheet";

import { Button } from "@/components/ui/button";
import { TaskEntriesTable } from "@/components/timesheets/task-entries-table";

type WeekDetailViewProps = {
  weekId: string;
};

export function WeekDetailView({ weekId }: WeekDetailViewProps) {
  const { data, isLoading, isError, error } = useQuery(
    getWeekDetailQuery(weekId),
  );

  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [entryDialogMode, setEntryDialogMode] = useState<"create" | "edit">(
    "create",
  );
  const [defaultDayIso, setDefaultDayIso] = useState<string | undefined>();
  const [editingEntry, setEditingEntry] = useState<TimesheetEntryDto | null>(
    null,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TimesheetEntryDto | null>(
    null,
  );

  const openCreate = useCallback((dayIso?: string) => {
    setEntryDialogMode("create");
    setEditingEntry(null);
    setDefaultDayIso(dayIso);
    setEntryDialogOpen(true);
  }, []);

  const openEdit = useCallback((entry: TimesheetEntryDto) => {
    setEntryDialogMode("edit");
    setEditingEntry(entry);
    setEntryDialogOpen(true);
  }, []);

  const requestDelete = useCallback((entry: TimesheetEntryDto) => {
    setDeleteTarget(entry);
    setDeleteOpen(true);
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center text-sm text-neutral-500 sm:px-6 lg:px-8">
        Loading week…
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error instanceof Error ? error.message : "Could not load this week."}
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-600"
        >
          <ArrowLeft className="size-4" />
          Back to timesheets
        </Link>
      </div>
    );
  }

  const { week, entries, totalHours, targetHours, progressPercent } = data;
  const grouped = groupEntriesByDate(entries);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft className="size-4" />
        Timesheets
      </Link>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              This week&apos;s timesheet
            </h1>
            <p className="text-base text-timesheet-cell-text">
              {week.dateRangeLabel}
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-start lg:flex-col lg:items-end">
            <Button
              type="button"
              variant="outline"
              className="border-neutral-300"
              onClick={() => openCreate(week.startDate)}
            >
              Add task
            </Button>

            {/* Progress: hours in grey pill (Figma); % sits above the bar end */}
            <div className="flex w-full max-w-[280px] flex-col gap-2 lg:ml-auto">
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-lg bg-timesheet-table-surface px-3 py-2">
                  <p className="text-base font-semibold tabular-nums text-neutral-900">
                    {totalHours}/{targetHours} hrs
                  </p>
                </div>
                <p className="shrink-0 pt-1 text-sm font-medium tabular-nums text-timesheet-cell-text">
                  {progressPercent}%
                </p>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-orange-400 transition-[width]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {grouped.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50/80 px-4 py-8 text-center">
              <p className="text-sm text-neutral-600">
                No tasks logged for this week yet.
              </p>
              <Button
                type="button"
                className="mt-4 bg-brand-700 text-white hover:bg-brand-700/90"
                onClick={() => openCreate(week.startDate)}
              >
                Log your first task
              </Button>
            </div>
          ) : null}

          {grouped.map(([dayIso, dayEntries]) => (
            <section
              key={dayIso}
              aria-labelledby={`day-${dayIso}`}
              className="border-b border-neutral-100 pb-10 last:border-0 last:pb-0"
            >
              <div className="flex flex-col gap-6 md:flex-row md:gap-10">
                <h2
                  id={`day-${dayIso}`}
                  className="shrink-0 text-sm font-semibold text-timesheet-cell-text md:w-28"
                >
                  {formatDayHeading(dayIso)}
                </h2>
                <div className="min-w-0 flex-1">
                  <TaskEntriesTable
                    entries={dayEntries}
                    dayIso={dayIso}
                    onAddTaskClick={(d) => openCreate(d)}
                    onEdit={openEdit}
                    onDelete={requestDelete}
                  />
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <EntryFormDialog
        open={entryDialogOpen}
        onOpenChange={setEntryDialogOpen}
        weekId={week.id}
        weekStartDate={week.startDate}
        weekEndDate={week.endDate}
        mode={entryDialogMode}
        defaultDateIso={defaultDayIso}
        editingEntry={entryDialogMode === "edit" ? editingEntry : null}
      />

      <DeleteEntryDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        weekId={week.id}
        entry={deleteTarget}
      />
    </div>
  );
}
