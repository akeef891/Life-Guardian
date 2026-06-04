export type PreparednessCategoryId =
  | "road_accidents"
  | "fire"
  | "flood"
  | "medical"
  | "women_safety"
  | "child_safety";

export type PreparednessTip = {
  id: PreparednessCategoryId;
  title: string;
  summary: string;
  steps: string[];
};

export const PREPAREDNESS_TIPS: PreparednessTip[] = [
  {
    id: "road_accidents",
    title: "Road Accidents",
    summary: "Immediate actions after a vehicle collision.",
    steps: [
      "Move to a safe location if possible and turn on hazard lights.",
      "Call emergency services and share exact location using maps.",
      "Do not move injured persons unless there is immediate danger.",
      "Exchange details with other parties and document the scene with photos.",
      "Notify your emergency contacts via Life Guardian SOS if needed.",
    ],
  },
  {
    id: "fire",
    title: "Fire",
    summary: "Protect yourself and others during a fire emergency.",
    steps: [
      "Alert everyone nearby and activate fire alarms if available.",
      "Evacuate using stairs; never use elevators during a fire.",
      "Stay low to avoid smoke inhalation.",
      "Close doors behind you to slow fire spread.",
      "Once outside, call fire services and account for all family members.",
    ],
  },
  {
    id: "flood",
    title: "Flood",
    summary: "Stay safe during flooding and heavy rain events.",
    steps: [
      "Move to higher ground immediately; avoid walking in moving water.",
      "Turn off electricity at the main switch if water enters your home.",
      "Keep emergency kit, documents, and medications in a waterproof bag.",
      "Follow official evacuation orders from local authorities.",
      "Do not drive through flooded roads — most flood deaths occur in vehicles.",
    ],
  },
  {
    id: "medical",
    title: "Medical Emergencies",
    summary: "Critical steps before professional help arrives.",
    steps: [
      "Check responsiveness and breathing; call ambulance services.",
      "Share your Life Guardian QR card for allergies and medications.",
      "If bleeding, apply firm pressure with a clean cloth.",
      "For choking, perform back blows and abdominal thrusts if trained.",
      "Keep the person warm and monitor until help arrives.",
    ],
  },
  {
    id: "women_safety",
    title: "Women Safety",
    summary: "Personal safety practices for everyday situations.",
    steps: [
      "Share live location with trusted contacts when traveling alone.",
      "Use well-lit routes and stay aware of surroundings.",
      "Keep emergency numbers on speed dial.",
      "Trust your instincts — leave uncomfortable situations early.",
      "Use Life Guardian SOS to alert your trusted circle instantly.",
    ],
  },
  {
    id: "child_safety",
    title: "Child Safety",
    summary: "Protecting children during emergencies.",
    steps: [
      "Teach children their full name, address, and a parent phone number.",
      "Establish a family meeting point for evacuations.",
      "Keep medical information updated in your emergency profile.",
      "Practice what to do during fire drills and earthquakes.",
      "Ensure caregivers have access to your QR emergency card.",
    ],
  },
];
