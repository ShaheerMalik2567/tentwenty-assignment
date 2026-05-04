import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import type { TimesheetUiStatus } from "@/lib/timesheets/timesheet-utils";
import { authOptions } from "@/server/auth";
import {
  queryTimesheetList,
  type ListQueryParams,
} from "@/server/timesheets/list-query";
import type { TimesheetListSortField } from "@/types/timesheet";
import type { TimesheetListResponse } from "@/types/timesheet";

function parseStatus(value: string | null): TimesheetUiStatus | "all" {
  if (!value || value === "all") return "all";
  if (value === "completed" || value === "incomplete" || value === "missing") {
    return value;
  }
  return "all";
}

function parseSortField(value: string | null): TimesheetListSortField {
  if (value === "week" || value === "date" || value === "status") return value;
  return "week";
}

function parseSortDir(value: string | null): "asc" | "desc" {
  return value === "asc" ? "asc" : "desc";
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1) || 1);
  const pageSizeRaw = Number(url.searchParams.get("pageSize") || 5) || 5;
  const pageSize = Math.min(50, Math.max(5, pageSizeRaw));

  const params: ListQueryParams = {
    status: parseStatus(url.searchParams.get("status")),
    dateFrom: url.searchParams.get("from"),
    dateTo: url.searchParams.get("to"),
    sortBy: parseSortField(url.searchParams.get("sortBy")),
    sortDir: parseSortDir(url.searchParams.get("sortDir")),
    page,
    pageSize,
  };

  const { items, total } = queryTimesheetList(params);

  const body: TimesheetListResponse = {
    items,
    total,
    page,
    pageSize,
  };

  return NextResponse.json(body);
}
