import type { Metadata } from "next";

import { TimesheetsDashboard } from "@/features/timesheets/components/timesheets-dashboard";

export const metadata: Metadata = {
  title: "Timesheets | ticktock",
};

export default function DashboardPage() {
  return <TimesheetsDashboard />;
}
