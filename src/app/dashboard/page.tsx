import type { Metadata } from "next";

import { TimesheetsDashboard } from "@/components/timesheets/timesheets-dashboard";

export const metadata: Metadata = {
  title: "Timesheets | ticktock",
};

export default function DashboardPage() {
  return <TimesheetsDashboard />;
}
