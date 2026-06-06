"use client";

import { coerceToDate } from "@/lib/datetime/coerce-date";
import {
  formatRelativeTime,
  formatSosDateTime,
  getBrowserTimeZone,
  type DateTimeInput,
} from "@/lib/datetime/format-datetime";
import { useMemo } from "react";

type LocalRelativeTimeProps = {
  value: DateTimeInput;
  className?: string;
};

export function LocalRelativeTime({ value, className }: LocalRelativeTimeProps) {
  const instant = coerceToDate(value);
  const timeZone = useMemo(() => getBrowserTimeZone(), []);

  if (!instant) {
    return null;
  }

  const relative = formatRelativeTime(instant, new Date(), timeZone);
  const absolute = formatSosDateTime(instant, timeZone);

  return (
    <time className={className} dateTime={instant.toISOString()} title={absolute}>
      {relative}
    </time>
  );
}
