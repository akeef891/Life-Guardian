import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PreparednessHub } from "@/components/preparedness/PreparednessHub";

export const metadata: Metadata = {
  title: "Emergency Preparedness",
  description: "Preparedness tips for common emergencies.",
};

export default function PreparednessPage() {
  return (
    <div className="min-w-0">
      <PageHeader
        title="Emergency Preparedness Hub"
        description="Practical guidance for road accidents, fire, flood, medical emergencies, and personal safety."
      />
      <PreparednessHub />
    </div>
  );
}
