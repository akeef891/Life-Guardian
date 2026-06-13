import type { Metadata } from "next";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { SITE_NAME } from "@/lib/seo/constants";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: SITE_NAME,
  description:
    "Life Guardian helps families and caregivers respond faster with SOS alerts, QR emergency cards, medical profiles, and community safety tools.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <div className="min-w-0 overflow-x-hidden">
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
}
