"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { type ReactNode, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  useCreateTimesheetEntry,
  useUpdateTimesheetEntry,
} from "@/features/timesheets/timesheet-mutations";
import {
  PROJECT_OPTIONS,
  WORK_TYPE_OPTIONS,
} from "@/lib/timesheets/entry-modal-options";
import {
  createTimesheetEntryBodySchema,
  type TimesheetEntryBodyInput,
} from "@/lib/timesheets/entry-schema";
import type { TimesheetEntryDto } from "@/types/timesheet";

import { HoursStepperField } from "@/components/timesheets/hours-stepper-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type EntryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekId: string;
  weekStartDate: string;
  weekEndDate: string;
  mode: "create" | "edit";
  /** Used when creating from a specific day row or header (hidden date field). */
  defaultDateIso?: string;
  editingEntry?: TimesheetEntryDto | null;
};

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-sm font-medium text-neutral-700"
      >
        {children}
        {required ? (
          <span className="text-timesheet-cell-text" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </Label>
      <button
        type="button"
        className="rounded-full text-neutral-400 outline-none hover:text-neutral-600 focus-visible:ring-2 focus-visible:ring-timesheet-action/40"
        aria-label="More information"
      >
        <Info className="size-3.5 shrink-0" aria-hidden />
      </button>
    </div>
  );
}

export function EntryFormDialog({
  open,
  onOpenChange,
  weekId,
  weekStartDate,
  weekEndDate,
  mode,
  defaultDateIso,
  editingEntry,
}: EntryFormDialogProps) {
  const schema = useMemo(
    () => createTimesheetEntryBodySchema(weekStartDate, weekEndDate),
    [weekStartDate, weekEndDate],
  );

  const createMutation = useCreateTimesheetEntry(weekId);
  const updateMutation = useUpdateTimesheetEntry(weekId);

  const busy = createMutation.isPending || updateMutation.isPending;

  const form = useForm<TimesheetEntryBodyInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: weekStartDate,
      description: "",
      hours: 12,
      projectName: "",
      workType: "Bug fixes",
    },
  });

  useEffect(() => {
    if (!open) return;
    const date =
      mode === "edit" && editingEntry
        ? editingEntry.date
        : (defaultDateIso ?? weekStartDate);
    form.reset({
      date,
      description: editingEntry?.description ?? "",
      hours: editingEntry?.hours ?? 12,
      projectName: editingEntry?.projectName ?? "",
      workType: editingEntry?.workType ?? "Bug fixes",
    });
  }, [open, mode, editingEntry, defaultDateIso, weekStartDate, form]);

  async function onSubmit(values: TimesheetEntryBodyInput) {
    try {
      if (mode === "edit" && editingEntry) {
        await updateMutation.mutateAsync({
          entryId: editingEntry.id,
          body: values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }
      onOpenChange(false);
    } catch {
      /* surfaced via submitError */
    }
  }

  const submitError =
    createMutation.error ?? updateMutation.error ?? null;

  const title = mode === "edit" ? "Edit Entry" : "Add New Entry";
  const submitLabel =
    busy ? "Saving…" : mode === "edit" ? "Save changes" : "Add entry";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[480px] gap-0 overflow-hidden p-0 sm:max-w-[480px]"
        showCloseButton={!busy}
      >
        <DialogHeader className="space-y-0 border-b border-neutral-200 px-6 py-4 pr-14">
          <DialogTitle className="text-left text-lg font-semibold text-neutral-900">
            {title}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 px-6 py-5"
          noValidate
        >
          <input type="hidden" {...form.register("date")} />

          <div className="space-y-2">
            <FieldLabel required>Select Project</FieldLabel>
            <Controller
              name="projectName"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value ? field.value : null}
                  onValueChange={(v) => field.onChange(v ?? "")}
                  disabled={busy}
                >
                  <SelectTrigger
                    size="default"
                    className="h-11 w-full rounded-lg border-neutral-300 bg-white data-placeholder:text-timesheet-cell-text"
                    aria-invalid={!!form.formState.errors.projectName}
                  >
                    <SelectValue placeholder="Project Name" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_OPTIONS.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.projectName?.message ? (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.projectName.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <FieldLabel required>Type of Work</FieldLabel>
            <Controller
              name="workType"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={busy}
                >
                  <SelectTrigger
                    size="default"
                    className="h-11 w-full rounded-lg border-neutral-300 bg-white"
                    aria-invalid={!!form.formState.errors.workType}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_TYPE_OPTIONS.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.workType?.message ? (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.workType.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="entry-description"
              className="text-sm font-medium text-neutral-700"
            >
              Task description{" "}
              <span className="text-timesheet-cell-text" aria-hidden>
                *
              </span>
            </Label>
            <Textarea
              id="entry-description"
              rows={4}
              disabled={busy}
              placeholder="Write text here ..."
              className="min-h-[120px] resize-y rounded-lg border-neutral-300 bg-white text-neutral-900 placeholder:text-timesheet-cell-text"
              {...form.register("description")}
            />
            <p className="text-xs text-timesheet-cell-text">
              A note for extra info
            </p>
            {form.formState.errors.description?.message ? (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="entry-hours-stepper"
              className="text-sm font-medium text-neutral-700"
            >
              Hours{" "}
              <span className="text-timesheet-cell-text" aria-hidden>
                *
              </span>
            </Label>
            <Controller
              name="hours"
              control={form.control}
              render={({ field }) => (
                <div id="entry-hours-stepper">
                  <HoursStepperField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={busy}
                  />
                </div>
              )}
            />
            {form.formState.errors.hours?.message ? (
              <p className="text-sm text-destructive" role="alert">
                {String(form.formState.errors.hours.message)}
              </p>
            ) : null}
          </div>

          {submitError ? (
            <p className="text-sm text-destructive" role="alert">
              {submitError.message}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:justify-between">
            <Button
              type="submit"
              disabled={busy}
              className="h-11 flex-1 rounded-lg bg-timesheet-action text-white hover:bg-timesheet-action/90 sm:flex-none sm:min-w-[140px]"
            >
              {submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              className="h-11 flex-1 rounded-lg border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 sm:flex-none sm:min-w-[140px]"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
