"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import type { TimesheetEntryDto } from "@/types/timesheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RowActionsProps = {
  entry: TimesheetEntryDto;
  onEdit: (entry: TimesheetEntryDto) => void;
  onDelete: (entry: TimesheetEntryDto) => void;
};

function RowActionsMenu({ entry, onEdit, onDelete }: RowActionsProps) {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md text-timesheet-cell-text outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-timesheet-action/30"
          aria-label={`Actions for ${entry.description}`}
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={6}>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => onEdit(entry)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(entry)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export type TaskColumnHandlers = {
  onEdit: (entry: TimesheetEntryDto) => void;
  onDelete: (entry: TimesheetEntryDto) => void;
};

const HEADER =
  "text-[11px] font-semibold uppercase tracking-wide text-timesheet-cell-text";

/** Columns for per-day task tables on the week detail screen (Figma alignment). */
export function createTaskEntryColumns(
  handlers: TaskColumnHandlers,
): ColumnDef<TimesheetEntryDto>[] {
  const { onEdit, onDelete } = handlers;
  return [
    {
      id: "description",
      accessorKey: "description",
      header: () => <span className={HEADER}>Task</span>,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-normal text-neutral-900">
            {row.original.description}
          </span>
          <span className="block text-xs text-timesheet-cell-text">
            {row.original.workType}
          </span>
        </div>
      ),
    },
    {
      id: "hours",
      accessorKey: "hours",
      header: () => (
        <span className={`${HEADER} block w-full text-right`}>Hours</span>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <span className="tabular-nums text-timesheet-cell-text">
            {row.original.hours % 1 === 0
              ? row.original.hours
              : row.original.hours.toFixed(1)}{" "}
            hrs
          </span>
        </div>
      ),
    },
    {
      id: "projectName",
      accessorKey: "projectName",
      header: () => (
        <span className={`${HEADER} block w-full text-right`}>Project</span>
      ),
      cell: ({ row }) => (
        <div className="flex justify-end">
          <span className="inline-flex max-w-full rounded-full bg-timesheet-project-pill-bg px-3 py-1 text-sm font-medium text-timesheet-action">
            {row.original.projectName}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <span className={`${HEADER} block w-full text-right`}>Actions</span>
      ),
      cell: ({ row }) => (
        <RowActionsMenu
          entry={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
      enableSorting: false,
    },
  ];
}
