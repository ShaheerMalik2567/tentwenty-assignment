import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/server/auth";
import { getWeekDetailOrNull } from "@/server/timesheets/week-detail";

type RouteContext = { params: Promise<{ weekId: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { weekId } = await context.params;
  const detail = getWeekDetailOrNull(weekId);

  if (!detail) {
    return NextResponse.json({ error: "Timesheet week not found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}
