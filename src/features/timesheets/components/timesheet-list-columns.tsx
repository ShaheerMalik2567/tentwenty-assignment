"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Link from "next/link";

import { COLUMN_IDS } from "@/features/timesheets/utils/list-sort-mapping";
import type { TimesheetListRow } from "@/types/timesheet";

import { TimesheetStatusBadge } from "@/features/timesheets/components/timesheet-status-badge";

function SortGlyph({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "desc") return <ArrowDown className="size-4 shrink-0 opacity-70" />;
  if (sorted === "asc") return <ArrowUp className="size-4 shrink-0 opacity-70" />;
  return <ArrowUpDown className="size-4 shrink-0 opacity-40" />;
}

function SortableHeader({
  label,
  sorted,
  onToggle,
}: {
  label: string;
  sorted: false | "asc" | "desc";
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-1 font-semibold tracking-wide text-timesheet-cell-text uppercase hover:text-neutral-800"
    >
      {label}
      <SortGlyph sorted={sorted} />
    </button>
  );
}

/** Column definitions for the main timesheets list (TanStack Table). */
export function createTimesheetListColumns(): ColumnDef<TimesheetListRow>[] {
  return [
    {
      id: COLUMN_IDS.weekNumber,
      accessorKey: "weekNumber",
      header: ({ column }) => (
        <SortableHeader
          label="Week #"
          sorted={column.getIsSorted()}
          onToggle={() => column.toggleSorting()}
        />
      ),
      cell: ({ row }) => (
        <span className="font-medium tabular-nums text-timesheet-cell-text">
          {row.original.weekNumber}
        </span>
      ),
    },
    {
      id: COLUMN_IDS.dateRangeLabel,
      accessorKey: "dateRangeLabel",
      header: ({ column }) => (
        <SortableHeader
          label="Date"
          sorted={column.getIsSorted()}
          onToggle={() => column.toggleSorting()}
        />
      ),
      cell: ({ row }) => (
        <span className="text-timesheet-cell-text">
          {row.original.dateRangeLabel}
        </span>
      ),
    },
    {
      id: COLUMN_IDS.status,
      accessorKey: "status",
      header: ({ column }) => (
        <SortableHeader
          label="Status"
          sorted={column.getIsSorted()}
          onToggle={() => column.toggleSorting()}
        />
      ),
      cell: ({ row }) => (
        <TimesheetStatusBadge status={row.original.status} />
      ),
    },
    {
      id: "actions",
      header: () => (
        <span className="font-semibold tracking-wide text-timesheet-cell-text uppercase">
          Actions
        </span>
      ),
      cell: ({ row }) => {
        const href = `/dashboard/week/${row.original.id}`;
        const label =
          row.original.status === "completed"
            ? "View"
            : row.original.status === "incomplete"
              ? "Update"
              : "Create";
        return (
          <Link
            href={href}
            className="text-sm font-medium text-timesheet-action hover:opacity-90"
          >
            {label}
          </Link>
        );
      },
      enableSorting: false,
    },
  ];
}
