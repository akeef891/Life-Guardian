import type { ComponentType } from "react";
import {
  FamilyIcon,
  ProfileIcon,
  QrCodeIcon,
  SosIcon,
} from "@/components/icons/LandingIcons";

type Feature = {
  title: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
  accent: string;
};

const FEATURES: Feature[] = [
  {
    title: "Emergency Profile",
    description:
      "Keep blood type, allergies, medications, and conditions organized in one profile your care team can trust during a crisis.",
    Icon: ProfileIcon,
    accent: "bg-brand-light text-brand",
  },
  {
    title: "QR Emergency Card",
    description:
      "Generate a scannable card that opens your essential medical details instantly—no app install or sign-in required for helpers.",
    Icon: QrCodeIcon,
    accent: "bg-brand-50 text-brand-dark dark:text-brand",
  },
  {
    title: "SOS Alerts",
    description:
      "Send a one-tap SOS to your emergency contacts with optional location and message so your family knows you need help right away.",
    Icon: SosIcon,
    accent: "bg-emergency-light text-emergency",
  },
  {
    title: "Family Protection",
    description:
      "Add trusted contacts, control what they see, and make sure the people who matter most can act quickly on your behalf.",
    Icon: FamilyIcon,
    accent: "bg-brand-light text-accent",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-20 border-t border-border bg-surface py-16 sm:py-24 lg:py-28"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto min-w-0 max-w-6xl px-4 sm:px-6">
        <div className="mx-auto min-w-0 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Features
          </p>
          <h2
            id="features-heading"
            className="mt-3 break-words text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Prepared before the emergency happens
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Life Guardian combines medical readiness, instant sharing, and family
            alerts in one calm, easy-to-use platform.
          </p>
        </div>

        <ul className="mt-12 grid min-w-0 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="group flex min-w-0 flex-col rounded-2xl border border-border bg-surface-elevated p-6 shadow-sm transition-[border-color,box-shadow] duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-brand/30 motion-safe:hover:shadow-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.accent}`}
              >
                <feature.Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 break-words text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
