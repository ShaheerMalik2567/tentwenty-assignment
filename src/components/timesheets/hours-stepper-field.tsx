"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type HoursStepperFieldProps = {
  value: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
};

function clampStep(value: number, step: number, min: number, max: number) {
  const snapped = Math.round(value / step) * step;
  const rounded = Math.round(snapped * 100) / 100;
  return Math.min(max, Math.max(min, rounded));
}

/** Segmented stepper matching the Figma hours control (− / value / +). */
export function HoursStepperField({
  value,
  onChange,
  disabled,
  min = 0.25,
  max = 24,
  step = 0.25,
}: HoursStepperFieldProps) {
  const label =
    Math.abs(value - Math.round(value)) < 1e-6
      ? String(Math.round(value))
      : String(value);

  return (
    <div
      className={cn(
        "inline-flex w-fit max-w-full items-stretch overflow-hidden rounded-lg border border-neutral-300 bg-white",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(clampStep(value - step, step, min, max))}
        className="flex w-10 shrink-0 items-center justify-center bg-neutral-100 text-lg font-medium text-neutral-700 transition-colors hover:bg-neutral-200 disabled:opacity-40"
        aria-label="Decrease hours"
      >
        <Minus className="size-4" strokeWidth={2} aria-hidden />
      </button>
      <div className="flex min-h-11 min-w-14 items-center justify-center border-x border-neutral-300 px-2.5 text-center text-sm font-semibold tabular-nums text-neutral-900">
        {label}
      </div>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(clampStep(value + step, step, min, max))}
        className="flex w-10 shrink-0 items-center justify-center bg-neutral-100 text-lg font-medium text-neutral-700 transition-colors hover:bg-neutral-200 disabled:opacity-40"
        aria-label="Increase hours"
      >
        <Plus className="size-4" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
