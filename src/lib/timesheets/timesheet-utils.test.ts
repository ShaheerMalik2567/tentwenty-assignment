import { describe, expect, it } from "vitest";

import {
  formatWeekDateRangeDisplay,
  getTimesheetUiStatus,
} from "@/lib/timesheets/timesheet-utils";

describe("formatWeekDateRangeDisplay", () => {
  it("formats a range within the same month", () => {
    const s = formatWeekDateRangeDisplay("2026-01-05", "2026-01-11");
    expect(s).toMatch(/5/);
    expect(s).toMatch(/11/);
    expect(s).toMatch(/January/);
    expect(s).toMatch(/2026/);
  });
});

describe("getTimesheetUiStatus", () => {
  it("treats zero hours as missing", () => {
    expect(getTimesheetUiStatus(0)).toBe("missing");
  });

  it("treats partial hours as incomplete", () => {
    expect(getTimesheetUiStatus(12)).toBe("incomplete");
    expect(getTimesheetUiStatus(39.5)).toBe("incomplete");
  });

  it("treats full target as completed", () => {
    expect(getTimesheetUiStatus(40)).toBe("completed");
    expect(getTimesheetUiStatus(50)).toBe("completed");
  });
});
