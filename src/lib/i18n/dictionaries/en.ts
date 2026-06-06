export const en = {
  nav: {
    dashboard: "Dashboard",
    profile: "Emergency Profile",
    qrCard: "QR Card",
    sos: "SOS",
    resources: "Resources",
    checkIn: "Check-In",
    preparedness: "Preparedness",
  },
  common: {
    loading: "Loading…",
    openMaps: "Open in Google Maps",
    distance: "km away",
    retry: "Try again",
    save: "Save",
  },
  resources: {
    title: "Emergency Resource Center",
    description: "Find nearby hospitals, police stations, and ambulance services.",
    hospitals: "Nearby Hospitals",
    police: "Nearby Police Stations",
    ambulances: "Nearby Ambulance Services",
    useLocation: "Use my location",
    refreshLocation: "Refresh GPS & resources",
    acquiringGps: "Acquiring high-accuracy GPS (up to 30s)…",
    gpsTimeout: "Could not obtain a GPS fix in time. Move outdoors and try again.",
    locationError: "Unable to get your location.",
    locationHint: "Enable location on the Resources page to see nearby services.",
    loadError: "Could not load the resource list. Please try again.",
    unavailable:
      "Live map data is temporarily unavailable. You can still use SOS and your emergency profile.",
    noResults: "No resources found nearby.",
    noResultsHint: "No hospitals, police, or ambulance services were found within 10 km of your GPS position.",
  },
  checkIn: {
    title: "Family Safety Check-In",
    description: "Let your trusted circle know you are safe or need help.",
    safe: "Mark Safe",
    needHelp: "Need Assistance",
    traveling: "Traveling",
    notePlaceholder: "Optional note for your family",
    latest: "Latest status",
  },
  dashboard: {
    resourceCenter: "Resource Center",
    nearestHospital: "Nearest Hospital",
    nearestPolice: "Nearest Police",
    safetyStatus: "Safety Status",
    communityAlerts: "Community Alerts",
  },
};

type DeepString<T> = T extends string
  ? string
  : T extends object
    ? { [K in keyof T]: DeepString<T[K]> }
    : T;

export type Dictionary = DeepString<typeof en>;
