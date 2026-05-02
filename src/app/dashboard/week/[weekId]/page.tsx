import type { Metadata } from "next";

import { WeekDetailView } from "@/components/timesheets/week-detail-view";

type PageProps = {
  params: Promise<{ weekId: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { weekId } = await props.params;
  return {
    title: `Week ${weekId} | ticktock`,
  };
}

export default async function WeekDetailPage(props: PageProps) {
  const { weekId } = await props.params;
  return <WeekDetailView weekId={weekId} />;
}
