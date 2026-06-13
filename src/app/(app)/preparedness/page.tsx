import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PreparednessHub } from "@/components/preparedness/PreparednessHub";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Emergency Preparedness",
  description:
    "Prepare for road accidents, fire, flood, medical emergencies, and personal safety with Life Guardian preparedness guidance.",
  path: "/preparedness",
});

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
