import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/LandingIcons";
import { ROUTES } from "@/lib/constants/routes";

const STEPS = [
  {
    step: 1,
    title: "Create Emergency Profile",
    description:
      "Add your blood type, allergies, medications, medical conditions, and emergency contacts in one secure profile.",
  },
  {
    step: 2,
    title: "Generate QR Emergency Card",
    description:
      "Life Guardian creates a unique QR code linked to your profile so anyone nearby can view critical information immediately.",
  },
  {
    step: 3,
    title: "Share With Family",
    description:
      "Give your QR card to family members, caregivers, or keep it on your phone, wallet, or medical ID for everyday carry.",
  },
  {
    step: 4,
    title: "Get Faster Emergency Support",
    description:
      "When crisis strikes, responders and loved ones act on accurate information—and SOS alerts notify your contacts without delay.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 py-20 sm:py-28"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Four steps to emergency readiness
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Set up once, stay protected every day, and be confident that the right
            people can help when it matters most.
          </p>
        </div>

        <ol className="relative mt-16 space-y-8 lg:space-y-0">
          <div
            className="absolute left-8 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-brand via-brand/40 to-transparent lg:left-1/2 lg:block lg:-translate-x-px"
            aria-hidden
          />

          {STEPS.map((item, index) => {
            const isEven = index % 2 === 1;

            return (
              <li
                key={item.step}
                className={`relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12 ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={`flex-1 ${isEven ? "lg:text-right" : ""}`}>
                  <div
                    className={`inline-flex items-center gap-3 ${isEven ? "lg:flex-row-reverse" : ""}`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-md shadow-brand/30">
                      {item.step}
                    </span>
                    <span className="text-sm font-semibold uppercase tracking-wider text-brand">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-foreground sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>

                <div
                  className="hidden h-4 w-4 shrink-0 rounded-full border-4 border-background bg-brand shadow ring-4 ring-brand/20 lg:absolute lg:left-1/2 lg:block lg:-translate-x-1/2"
                  aria-hidden
                />

                <div className="hidden flex-1 lg:block" aria-hidden>
                  <div
                    className={`rounded-2xl border border-border bg-surface p-6 ${
                      isEven ? "lg:mr-auto lg:max-w-md" : "lg:ml-auto lg:max-w-md"
                    }`}
                  >
                    <div className="flex h-24 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-light/20">
                      <span className="text-4xl font-bold text-brand/30">
                        {String(item.step).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-16 rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-50 to-surface-elevated p-8 text-center sm:p-12 dark:from-brand-light/20">
          <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
            Ready to protect yourself and your family?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Create your emergency profile in minutes and take the first step toward
            faster, clearer help during an emergency.
          </p>
          <Link
            href={ROUTES.dashboard}
            className="group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark"
          >
            Get Started Free
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
