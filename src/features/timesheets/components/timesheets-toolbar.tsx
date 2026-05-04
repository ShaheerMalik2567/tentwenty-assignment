"use client";

import {
  DATE_RANGE_PRESETS,
  type DateRangePresetValue,
} from "@/features/timesheets/utils/date-range-presets";
import type { TimesheetUiStatus } from "@/lib/timesheets/timesheet-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS: Array<{
  value: TimesheetUiStatus | "all";
  label: string;
}> = [
  { value: "all", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "incomplete", label: "Incomplete" },
  { value: "missing", label: "Missing" },
];

type TimesheetsToolbarProps = {
  datePreset: DateRangePresetValue;
  onDatePresetChange: (value: DateRangePresetValue) => void;
  status: TimesheetUiStatus | "all";
  onStatusChange: (value: TimesheetUiStatus | "all") => void;
};

export function TimesheetsToolbar({
  datePreset,
  onDatePresetChange,
  status,
  onStatusChange,
}: TimesheetsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
      <Select
        value={datePreset}
        onValueChange={(v) => onDatePresetChange(v as DateRangePresetValue)}
      >
        <SelectTrigger className="h-9 w-full min-w-[180px] border-neutral-200 bg-white sm:w-[180px]">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          {DATE_RANGE_PRESETS.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(v) => onStatusChange(v as TimesheetUiStatus | "all")}
      >
        <SelectTrigger className="h-9 w-full min-w-[160px] border-neutral-200 bg-white sm:w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
