"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, useTransition } from "react";
import { deleteSOSAlertAction } from "@/app/(app)/sos/delete-actions";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { cn } from "@/lib/utils/cn";

const IncidentReportDownload = dynamic(
  () =>
    import("@/components/dashboard/IncidentReportDownload").then(
      (mod) => mod.IncidentReportDownload,
    ),
  {
    loading: () => (
      <span className="inline-flex min-h-11 min-w-[7rem] animate-pulse rounded-md border border-border bg-surface" />
    ),
  },
);

const ConfirmDialog = dynamic(
  () => import("@/components/ui/ConfirmDialog").then((mod) => mod.ConfirmDialog),
  { ssr: false },
);

type SOSAlertActionsProps = {
  alertId: string;
  mapsUrl?: string | null;
  layout?: "inline" | "stacked";
  onDeleted?: (alertId: string) => void;
  className?: string;
};

export function SOSAlertActions({
  alertId,
  mapsUrl,
  layout = "inline",
  onDeleted,
  className,
}: SOSAlertActionsProps) {
  const { success, error } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const containerClass =
    layout === "stacked"
      ? "flex flex-col gap-2"
      : "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center";

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      const result = await deleteSOSAlertAction(alertId);
      setConfirmOpen(false);

      if (result.success) {
        success(result.message ?? "SOS alert deleted successfully.");
        onDeleted?.(alertId);
        return;
      }

      error(result.error ?? "Failed to delete SOS alert. Please try again.");
    });
  }, [alertId, error, onDeleted, success]);

  const handleCancel = useCallback(() => {
    if (!isPending) {
      setConfirmOpen(false);
    }
  }, [isPending]);

  return (
    <>
      <div className={cn(containerClass, className)}>
        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25"
          >
            View
          </a>
        ) : (
          <span
            className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-md border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted"
            aria-disabled="true"
            title="No map location for this alert"
          >
            View
          </span>
        )}
        <IncidentReportDownload alertId={alertId} label="Download PDF" />
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={isPending}
          aria-label="Delete SOS alert"
          className="inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300/50 disabled:opacity-60 dark:hover:bg-red-950/30"
        >
          Delete
        </button>
      </div>

      {confirmOpen ? (
        <ConfirmDialog
          open={confirmOpen}
          title="Delete SOS Alert?"
          description="This action cannot be undone."
          confirmLabel="Delete Alert"
          cancelLabel="Cancel"
          loading={isPending}
          onConfirm={handleDelete}
          onCancel={handleCancel}
        />
      ) : null}
    </>
  );
}
