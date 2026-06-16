const FALLBACK_SITE_URL = "https://life-guardian.vercel.app/";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return FALLBACK_SITE_URL;
}

export function getAbsoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath === "/" ? "" : normalizedPath}`;
}
