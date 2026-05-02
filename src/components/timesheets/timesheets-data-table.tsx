"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type OnChangeFn,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { createTimesheetListColumns } from "@/components/timesheets/timesheet-list-columns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TimesheetListRow } from "@/types/timesheet";

type TimesheetsDataTableProps = {
  data: TimesheetListRow[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  isLoading?: boolean;
};

export function TimesheetsDataTable({
  data,
  sorting,
  onSortingChange,
  isLoading,
}: TimesheetsDataTableProps) {
  const columns = useMemo(() => createTimesheetListColumns(), []);

  /* eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table's useReactTable is not React Compiler–safe; this is the supported integration pattern. */
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
                className="h-11 bg-timesheet-table-surface px-4 text-left text-[11px] font-semibold tracking-wide text-timesheet-cell-text"
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
        {isLoading ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-sm text-neutral-500"
            >
              Loading timesheets…
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="border-neutral-200 bg-white hover:bg-neutral-50/40"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={[
                    "px-4 py-4 align-middle",
                    cell.column.id === "actions"
                      ? "text-right"
                      : "text-left text-timesheet-cell-text",
                    cell.column.id === "weekNumber"
                      ? "bg-timesheet-table-surface"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-sm text-neutral-500"
            >
              No timesheets match your filters.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
