import type { EmergencyCardData } from "@/types/emergency";

/** Static preview data for UI boilerplates only — replace with real data later. */
export const MOCK_EMERGENCY_CARD: EmergencyCardData = {
  displayName: "Alex Morgan",
  bloodType: "O+",
  allergies: "Penicillin, Peanuts",
  medications: "Metformin 500mg daily",
  medicalConditions: "Type 2 Diabetes",
  notes: "Speaks English and Spanish",
  emergencyContacts: [
    {
      name: "Jordan Morgan",
      relationship: "Spouse",
      phone: "+1 (555) 123-4567",
    },
    {
      name: "Dr. Sarah Chen",
      relationship: "Primary care",
      phone: "+1 (555) 987-6543",
    },
  ],
};
