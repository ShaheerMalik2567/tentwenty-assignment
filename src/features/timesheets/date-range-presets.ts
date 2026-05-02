/** Month presets for the list filter (covers seeded demo data in 2026). */
export type DateRangePresetValue =
  | "all"
  | "2026-01"
  | "2026-02"
  | "2026-03"
  | "2026-04";

export type DateRangeBounds = { from: string | null; to: string | null };

export const DATE_RANGE_PRESETS: Array<{
  value: DateRangePresetValue;
  label: string;
  bounds: DateRangeBounds;
}> = [
  { value: "all", label: "All dates", bounds: { from: null, to: null } },
  {
    value: "2026-01",
    label: "January 2026",
    bounds: { from: "2026-01-01", to: "2026-01-31" },
  },
  {
    value: "2026-02",
    label: "February 2026",
    bounds: { from: "2026-02-01", to: "2026-02-29" },
  },
  {
    value: "2026-03",
    label: "March 2026",
    bounds: { from: "2026-03-01", to: "2026-03-31" },
  },
  {
    value: "2026-04",
    label: "April 2026",
    bounds: { from: "2026-04-01", to: "2026-04-30" },
  },
];

export function getPresetBounds(
  value: DateRangePresetValue,
): DateRangeBounds {
  const preset = DATE_RANGE_PRESETS.find((p) => p.value === value);
  return preset?.bounds ?? { from: null, to: null };
}
