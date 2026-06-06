"use client";

import { coerceToDate } from "@/lib/datetime/coerce-date";
import {
  formatSosDate,
  formatSosDateTime,
  formatSosTime,
  getBrowserTimeZone,
  type DateTimeInput,
} from "@/lib/datetime/format-datetime";
import { useMemo } from "react";

type LocalDateTimeProps = {
  value: DateTimeInput;
  mode?: "datetime" | "date" | "time";
  className?: string;
  title?: boolean;
};

export function LocalDateTime({
  value,
  mode = "datetime",
  className,
  title = true,
}: LocalDateTimeProps) {
  const instant = coerceToDate(value);
  const timeZone = useMemo(() => getBrowserTimeZone(), []);

  if (!instant) {
    return null;
  }

  const formatted =
    mode === "date"
      ? formatSosDate(instant, timeZone)
      : mode === "time"
        ? formatSosTime(instant, timeZone)
        : formatSosDateTime(instant, timeZone);

  return (
    <time className={className} dateTime={instant.toISOString()} title={title ? timeZone : undefined}>
      {formatted}
    </time>
  );
}
