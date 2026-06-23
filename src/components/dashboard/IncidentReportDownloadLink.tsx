type IncidentReportDownloadLinkProps = {
  alertId: string;
  label?: string;
  timeZone: string;
};

const linkClassName =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/25";

export function IncidentReportDownloadLink({
  alertId,
  label = "Download incident PDF",
  timeZone,
}: IncidentReportDownloadLinkProps) {
  const href = `/api/incidents/${alertId}/pdf?tz=${encodeURIComponent(timeZone)}`;

  return (
    <a href={href} download className={linkClassName}>
      {label}
    </a>
  );
}

export { linkClassName as incidentReportDownloadLinkClassName };
