import { ROUTES } from "@/lib/constants/routes";
import type { CompletionBreakdown } from "./calculate-completion";

type EmergencyProfileLike = {
  bloodType?: string | null;
};

export type DashboardRecommendation = {
  id: string;
  title: string;
  description: string;
  href: string;
  priority: "high" | "medium";
};

type GenerateInput = {
  profile: EmergencyProfileLike | null;
  contactsCount: number;
  hasPrimaryContact: boolean;
  qrToken: string | null;
  sosAlertsCount: number;
  completion: CompletionBreakdown;
};

export function generateDashboardRecommendations(
  input: GenerateInput,
): DashboardRecommendation[] {
  const recommendations: DashboardRecommendation[] = [];

  if (input.contactsCount === 0) {
    recommendations.push({
      id: "add_contacts",
      title: "Add emergency contacts",
      description: "Add at least one trusted contact who can respond in an emergency.",
      href: `${ROUTES.profile}#emergency-contacts`,
      priority: "high",
    });
  } else if (!input.hasPrimaryContact) {
    recommendations.push({
      id: "set_primary_contact",
      title: "Set a primary contact",
      description: "Mark one contact as primary so responders know who to call first.",
      href: `${ROUTES.profile}#emergency-contacts`,
      priority: "high",
    });
  }

  if (!input.profile?.bloodType?.trim()) {
    recommendations.push({
      id: "complete_blood_type",
      title: "Complete blood group",
      description: "Add your blood type so first responders have critical medical info.",
      href: `${ROUTES.profile}#profile-editor`,
      priority: "high",
    });
  }

  if (input.completion.profile < 100) {
    recommendations.push({
      id: "complete_profile",
      title: "Complete your emergency profile",
      description: "Add your display name, date of birth, and primary language.",
      href: `${ROUTES.profile}#profile-editor`,
      priority: "medium",
    });
  }

  if (input.completion.medical < 80) {
    recommendations.push({
      id: "complete_medical",
      title: "Complete medical information",
      description: "Fill in allergies, medications, and conditions for faster care.",
      href: `${ROUTES.profile}#profile-editor`,
      priority: "medium",
    });
  }

  if (!input.qrToken) {
    recommendations.push({
      id: "generate_qr",
      title: "Generate QR card",
      description: "Create a scannable emergency card you can share offline.",
      href: ROUTES.qrCard,
      priority: "high",
    });
  }

  if (input.sosAlertsCount === 0) {
    recommendations.push({
      id: "test_sos",
      title: "Test SOS",
      description: "Run a test SOS to verify location capture and contact delivery links.",
      href: ROUTES.sos,
      priority: "medium",
    });
  }

  const priorityOrder = { high: 0, medium: 1 } as const;
  return recommendations.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );
}
