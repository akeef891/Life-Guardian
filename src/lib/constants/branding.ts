import brandLogoFull from "../../../public/logo/logo-full.png";
import brandLogoIcon from "../../../public/logo/logo-icon.png";

/** Bump when public logo PNG assets change (favicon / manifest cache bust). */
export const BRAND_LOGO_VERSION = "3";

/** Static imports — Next.js serves content-hashed URLs for sharp UI rendering. */
export const BRAND_LOGO_ICON = brandLogoIcon;
export const BRAND_LOGO_FULL = brandLogoFull;

/** Public paths for metadata, favicon, apple-touch, and PWA manifest. */
export const BRAND_LOGO_ICON_PUBLIC = `/logo/logo-icon.png?v=${BRAND_LOGO_VERSION}`;
export const BRAND_LOGO_FULL_PUBLIC = `/logo/logo-full.png?v=${BRAND_LOGO_VERSION}`;
