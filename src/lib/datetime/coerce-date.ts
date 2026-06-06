/** Normalize Prisma/RSC Date values (Date or ISO string) for display formatters. */
export function coerceToDate(value: Date | string | null | undefined): Date | null {
  if (value == null) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
