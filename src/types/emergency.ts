export type EmergencyContactPreview = {
  name: string;
  phone: string;
  relationship?: string;
  isPrimary?: boolean;
};

export type EmergencyCardData = {
  displayName: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
  medicalConditions?: string;
  notes?: string;
  emergencyContacts?: EmergencyContactPreview[];
};
