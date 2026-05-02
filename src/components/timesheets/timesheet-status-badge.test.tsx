import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TimesheetStatusBadge } from "@/components/timesheets/timesheet-status-badge";

describe("TimesheetStatusBadge", () => {
  it("renders completed label", () => {
    render(<TimesheetStatusBadge status="completed" />);
    expect(screen.getByText("COMPLETED")).toBeInTheDocument();
  });
});
