"use client";

import { useDeleteTimesheetEntry } from "@/features/timesheets/apis/timesheet-mutations";
import type { TimesheetEntryDto } from "@/types/timesheet";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DeleteEntryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekId: string;
  entry: TimesheetEntryDto | null;
};

export function DeleteEntryDialog({
  open,
  onOpenChange,
  weekId,
  entry,
}: DeleteEntryDialogProps) {
  const deleteMutation = useDeleteTimesheetEntry(weekId);
  const busy = deleteMutation.isPending;

  async function confirmDelete() {
    if (!entry) return;
    try {
      await deleteMutation.mutateAsync(entry.id);
      onOpenChange(false);
    } catch {
      /* surfaced below */
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm" showCloseButton={!busy}>
        <DialogHeader>
          <DialogTitle>Delete task</DialogTitle>
          <DialogDescription>
            This removes the row from your timesheet. You can add it again later.
            {entry ? (
              <>
                {" "}
                <span className="font-medium text-foreground">
                  {entry.description}
                </span>
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        {deleteMutation.error ? (
          <p className="text-sm text-destructive">
            {deleteMutation.error.message}
          </p>
        ) : null}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={busy || !entry}
            onClick={() => void confirmDelete()}
          >
            {busy ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
