"use client";

type IncidentReportDownloadProps = {
  alertId: string;
  label?: string;
};

export function IncidentReportDownload({
  alertId,
  label = "Download incident PDF",
}: IncidentReportDownloadProps) {
  const href = `/api/incidents/${alertId}/pdf`;

  return (
    <a
      href={href}
      download
      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/25"
    >
      {label}
    </a>
  );
}
