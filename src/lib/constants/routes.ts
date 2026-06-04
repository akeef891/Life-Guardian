export const ROUTES = {
  home: "/",
  about: "/about",
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/dashboard",
  profile: "/profile",
  qrCard: "/qr-card",
  sos: "/sos",
  resources: "/resources",
  checkIn: "/check-in",
  preparedness: "/preparedness",
} as const;

export const LANDING_SECTIONS = {
  features: "#features",
  howItWorks: "#how-it-works",
} as const;

export const MARKETING_NAV_LINKS = [
  { href: ROUTES.home, label: "Home" },
  { href: `${ROUTES.home}${LANDING_SECTIONS.features}`, label: "Features" },
  { href: `${ROUTES.home}${LANDING_SECTIONS.howItWorks}`, label: "How It Works" },
  { href: ROUTES.about, label: "About" },
] as const;

export const APP_NAV_LINKS = [
  { href: ROUTES.dashboard, label: "Dashboard" },
  { href: ROUTES.profile, label: "Emergency Profile" },
  { href: ROUTES.qrCard, label: "QR Card" },
  { href: ROUTES.sos, label: "SOS" },
  { href: ROUTES.resources, label: "Resources" },
  { href: ROUTES.checkIn, label: "Check-In" },
  { href: ROUTES.preparedness, label: "Preparedness" },
] as const;

export const FOOTER_QUICK_LINKS = [
  { href: ROUTES.home, label: "Home" },
  { href: `${ROUTES.home}${LANDING_SECTIONS.features}`, label: "Features" },
  { href: `${ROUTES.home}${LANDING_SECTIONS.howItWorks}`, label: "How It Works" },
  { href: ROUTES.about, label: "About" },
  { href: ROUTES.dashboard, label: "Dashboard" },
  { href: ROUTES.profile, label: "Emergency Profile" },
  { href: ROUTES.qrCard, label: "QR Card" },
  { href: ROUTES.sos, label: "SOS Alerts" },
] as const;
