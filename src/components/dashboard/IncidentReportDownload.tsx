"use client";

import { getBrowserTimeZone } from "@/lib/datetime/format-datetime";
import { IncidentReportDownloadLink } from "@/components/dashboard/IncidentReportDownloadLink";

type IncidentReportDownloadProps = {
  alertId: string;
  label?: string;
};

export function IncidentReportDownload({ alertId, label }: IncidentReportDownloadProps) {
  return (
    <IncidentReportDownloadLink
      alertId={alertId}
      label={label}
      timeZone={getBrowserTimeZone()}
    />
  );
}
