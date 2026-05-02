import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { createTimesheetEntryBodySchema } from "@/lib/timesheets/entry-schema";
import { authOptions } from "@/server/auth";
import { toTimesheetEntryDto } from "@/server/timesheets/entry-dto";
import { createTimesheetEntry } from "@/server/timesheets/entry-mutations";
import { getStore } from "@/server/mock/store";

type RouteContext = { params: Promise<{ weekId: string }> };

export async function POST(req: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { weekId } = await context.params;
  const week = getStore().weeks.find((w) => w.id === weekId);
  if (!week) {
    return NextResponse.json({ error: "Week not found" }, { status: 404 });
  }

  const json: unknown = await req.json().catch(() => null);
  if (!json || typeof json !== "object") {
    return NextResponse.json({ error: "Expected JSON body" }, { status: 400 });
  }

  const schema = createTimesheetEntryBodySchema(week.startDate, week.endDate);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Validation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const result = createTimesheetEntry({
    weekId,
    ...parsed.data,
  });

  if (typeof result !== "object") {
    if (result === "week_not_found") {
      return NextResponse.json({ error: "Week not found" }, { status: 404 });
    }
    if (result === "date_outside_week") {
      return NextResponse.json(
        { error: "Date outside week range" },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Could not create entry" }, { status: 400 });
  }

  return NextResponse.json(
    { entry: toTimesheetEntryDto(result) },
    { status: 201 },
  );
}
