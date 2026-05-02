"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useMemo } from "react";

import {
  createTaskEntryColumns,
  type TaskColumnHandlers,
} from "@/components/timesheets/task-entry-columns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TimesheetEntryDto } from "@/types/timesheet";

type TaskEntriesTableProps = {
  entries: TimesheetEntryDto[];
  dayIso: string;
  onAddTaskClick?: (dayIso: string) => void;
} & TaskColumnHandlers;

export function TaskEntriesTable({
  entries,
  dayIso,
  onAddTaskClick,
  onEdit,
  onDelete,
}: TaskEntriesTableProps) {
  const columns = useMemo(
    () => createTaskEntryColumns({ onEdit, onDelete }),
    [onEdit, onDelete],
  );

  /* eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table (see list table). */
  const table = useReactTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-0">
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-neutral-200 bg-timesheet-table-surface hover:bg-timesheet-table-surface"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-4 text-left align-middle"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-neutral-200 border-b last:border-b-0 hover:bg-neutral-50/60"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3.5 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-8 text-center text-sm text-timesheet-cell-text"
                >
                  No tasks for this day yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Figma: dashed neutral border default; blue dashed + tint on hover */}
      <button
        type="button"
        onClick={() => onAddTaskClick?.(dayIso)}
        className="group mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-white py-3.5 text-sm font-medium text-timesheet-action transition-colors hover:border-timesheet-action hover:bg-brand-600/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-timesheet-action/35"
      >
        <Plus
          className="size-4 shrink-0 text-timesheet-action group-hover:text-timesheet-action"
          aria-hidden
        />
        Add new task
      </button>
    </div>
  );
}
