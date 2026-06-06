import { coerceToDate } from "./coerce-date";

const DEFAULT_LOCALE = "en-IN";

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

export type DateTimeInput = Date | string | null | undefined;

export type FormatDateTimeOptions = {
  locale?: string;
  timeZone?: string | null;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
  weekday?: "long" | "short" | "narrow";
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
  hour12?: boolean;
};

export function isValidIanaTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

/** Browser-only: resolves the user's IANA timezone (e.g. Asia/Kolkata). */
export function getBrowserTimeZone(): string {
  if (typeof Intl === "undefined") {
    return "UTC";
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function resolveTimeZone(timeZone?: string | null): string {
  if (timeZone && isValidIanaTimeZone(timeZone)) {
    return timeZone;
  }
  if (typeof window !== "undefined") {
    return getBrowserTimeZone();
  }
  return "UTC";
}

function toInstant(value: DateTimeInput): Date | null {
  return coerceToDate(value);
}

export function formatDateTime(
  value: DateTimeInput,
  options: FormatDateTimeOptions = {},
): string {
  const instant = toInstant(value);
  if (!instant) {
    return "";
  }

  const locale = options.locale ?? DEFAULT_LOCALE;
  const timeZone = resolveTimeZone(options.timeZone);

  return new Intl.DateTimeFormat(locale, {
    timeZone,
    ...(options.weekday ? { weekday: options.weekday } : {}),
    ...(options.year ? { year: options.year } : {}),
    ...(options.month ? { month: options.month } : {}),
    ...(options.day ? { day: options.day } : {}),
    ...(options.hour ? { hour: options.hour } : {}),
    ...(options.minute ? { minute: options.minute } : {}),
    ...(options.second ? { second: options.second } : {}),
    ...(options.hour12 != null ? { hour12: options.hour12 } : {}),
    ...(options.dateStyle ? { dateStyle: options.dateStyle } : {}),
    ...(options.timeStyle ? { timeStyle: options.timeStyle } : {}),
  }).format(instant);
}

export function formatSosDateTime(
  value: DateTimeInput,
  timeZone?: string | null,
): string {
  return formatDateTime(value, {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatSosDate(value: DateTimeInput, timeZone?: string | null): string {
  return formatDateTime(value, {
    timeZone,
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatSosTime(value: DateTimeInput, timeZone?: string | null): string {
  return formatDateTime(value, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatRelativeTime(
  value: DateTimeInput,
  now: Date = new Date(),
  timeZone?: string | null,
): string {
  const instant = toInstant(value);
  if (!instant) {
    return "";
  }

  const diffMs = now.getTime() - instant.getTime();
  const absDiff = Math.abs(diffMs);

  if (absDiff < MINUTE_MS) {
    return "Just now";
  }
  if (absDiff < HOUR_MS) {
    const minutes = Math.round(absDiff / MINUTE_MS);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (absDiff < DAY_MS) {
    const hours = Math.round(absDiff / HOUR_MS);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (absDiff < DAY_MS * 7) {
    const days = Math.round(absDiff / DAY_MS);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return formatSosDateTime(instant, timeZone);
}
