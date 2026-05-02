export type TimesheetStatus = "draft" | "submitted" | "approved" | "rejected";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type TimesheetWeek = {
  id: string;
  weekNumber: number;
  startDate: string; // ISO yyyy-mm-dd
  endDate: string; // ISO yyyy-mm-dd
  status: TimesheetStatus;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
};

export type TimesheetEntry = {
  id: string;
  weekId: string;
  date: string; // ISO yyyy-mm-dd
  hours: number;
  description: string;
  /** Project label shown in the week detail table (design: blue tag). */
  projectName: string;
  /** “Type of Work” from the add/edit entry modal (Figma). */
  workType: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
};

