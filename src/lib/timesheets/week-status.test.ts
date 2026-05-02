import { describe, expect, it } from "vitest";

import { getTimesheetUiStatus } from "@/lib/timesheets/week-status";

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
