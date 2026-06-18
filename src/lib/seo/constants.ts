export const SITE_NAME = "Life Guardian";

export const SITE_DESCRIPTION =
  "Life Guardian is an emergency preparedness and response platform providing SOS alerts, emergency contacts, QR emergency cards, community resources, safety check-ins, emergency analytics, and preparedness tools.";

export const SITE_KEYWORDS = [
  "emergency safety",
  "emergency contacts",
  "SOS alerts",
  "QR emergency card",
  "medical emergency",
  "personal safety",
  "community safety",
  "accident response",
  "Life Guardian",
];

export const OG_IMAGE_PATH = "/logo/logo-full.png";

/** Public routes only — exclude authenticated app pages (dashboard, profile, qr-card, sos). */
export const SITEMAP_PATHS = [
  "/",
  "/about",
  "/resources",
  "/check-in",
  "/preparedness",
] as const;
