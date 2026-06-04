/**
 * Safe server-side error logging (no secrets in message).
 */
export function logServerError(context: string, error: unknown): void {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`[Life Guardian] ${context}:`, message);
}
