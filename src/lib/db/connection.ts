/**
 * Normalizes DATABASE_URL for Neon + node-pg to avoid SSL mode deprecation warnings.
 * @see https://www.postgresql.org/docs/current/libpq-ssl.html
 */
export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? "";
  if (!url) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const sslmode = parsed.searchParams.get("sslmode");

    if (sslmode === "require" || sslmode === "prefer" || sslmode === "verify-ca") {
      parsed.searchParams.set("uselibpqcompat", "true");
      if (sslmode === "require") {
        parsed.searchParams.set("sslmode", "require");
      }
    }

    return parsed.toString();
  } catch {
    return url;
  }
}
