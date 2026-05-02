import { describe, expect, it } from "vitest";

import { formatWeekDateRangeDisplay } from "@/lib/timesheets/format-week-range";

describe("formatWeekDateRangeDisplay", () => {
  it("formats a range within the same month", () => {
    const s = formatWeekDateRangeDisplay("2026-01-05", "2026-01-11");
    expect(s).toMatch(/5/);
    expect(s).toMatch(/11/);
    expect(s).toMatch(/January/);
    expect(s).toMatch(/2026/);
  });
});
