"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

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

/** Figma-style filled circle with white “i” (not outline Lucide icon). */
function InfoHintIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-[18px] shrink-0 items-center justify-center rounded-full bg-slate-400 text-[11px] font-semibold leading-none tracking-tight text-white",
        className,
      )}
      aria-hidden
    >
      i
    </span>
  );
}

function FieldLabel({
  htmlFor,
  required,
  tooltip,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  /** Static helper shown on hover / focus (desktop). */
  tooltip: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label
        htmlFor={htmlFor}
        className="text-sm font-medium text-neutral-700"
      >
        {children}
        {required ? (
          <span className="text-neutral-900" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </Label>
      <Tooltip>
        <TooltipTrigger
          type="button"
          aria-label={tooltip}
          className="inline-flex shrink-0 rounded-full border-0 bg-transparent p-0 hover:opacity-90"
        >
          <InfoHintIcon />
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
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
        className="max-w-[480px] gap-0 overflow-hidden border-0 bg-white p-0 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.25)] ring-1 ring-neutral-200/90 sm:max-w-[480px]"
        showCloseButton={!busy}
      >
        <DialogHeader className="space-y-0 border-b border-neutral-200 px-8 pb-4 pt-8 pr-14">
          <DialogTitle className="text-left text-xl font-semibold tracking-tight text-neutral-900">
            {title}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 px-8 py-6"
          noValidate
        >
          <input type="hidden" {...form.register("date")} />

          <div className="space-y-2.5">
            <FieldLabel
              required
              tooltip="Pick the project or product area this time entry belongs to."
            >
              Select Project
            </FieldLabel>
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
                    className="h-11 w-full rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 shadow-none data-placeholder:text-timesheet-cell-text"
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

          <div className="space-y-2.5">
            <FieldLabel
              required
              tooltip="Choose how this time should be categorized (e.g. bugs, features, or meetings)."
            >
              Type of Work
            </FieldLabel>
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
                    className="h-11 w-full rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 shadow-none"
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

          <div className="space-y-2.5">
            <Label
              htmlFor="entry-description"
              className="text-sm font-medium text-neutral-700"
            >
              Task description{" "}
              <span className="text-neutral-900" aria-hidden>
                *
              </span>
            </Label>
            <Textarea
              id="entry-description"
              rows={5}
              disabled={busy}
              placeholder="Write text here ..."
              className="min-h-[140px] resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-timesheet-cell-text"
              {...form.register("description")}
            />
            <p className="text-xs leading-relaxed text-timesheet-cell-text">
              A note for extra info
            </p>
            {form.formState.errors.description?.message ? (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="entry-hours-stepper"
              className="text-sm font-medium text-neutral-700"
            >
              Hours{" "}
              <span className="text-neutral-900" aria-hidden>
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

          <div className="grid grid-cols-2 gap-4 border-t border-neutral-200 pt-6">
            <Button
              type="submit"
              disabled={busy}
              className="h-11 w-full min-w-0 rounded-lg bg-timesheet-action text-sm font-medium text-white shadow-sm hover:bg-timesheet-action/90"
            >
              {submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              className="h-11 w-full min-w-0 rounded-lg border-neutral-300 bg-white text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50"
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
