import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon } from "@/components/icons/LandingIcons";
import { ROUTES } from "@/lib/constants/routes";

const TRUST_POINTS = [
  "Medical info ready in seconds",
  "No login required for QR viewers",
  "One-tap SOS for your contacts",
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--hero-gradient-start)_0%,var(--hero-gradient-end)_55%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />
      <div className="absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-brand/10 blur-3xl" aria-hidden />
      <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" aria-hidden />

      <div className="mx-auto min-w-0 max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20">
        <div className="grid min-w-0 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-light/80 px-4 py-1.5 text-sm font-medium text-brand-dark dark:text-brand">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-emergency opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emergency" />
              </span>
              Built for real-world emergencies
            </div>

            <h1 className="mt-6 break-words text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Critical help starts with{" "}
              <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                the right information
              </span>
            </h1>

            <p className="mt-6 max-w-xl break-words text-lg leading-relaxed text-muted sm:text-xl">
              Life Guardian helps people during emergencies by giving first responders,
              caregivers, and family instant access to medical details, a scannable QR
              emergency card, and SOS alerts—so support arrives faster when every second
              counts.
            </p>

            <ul className="mt-8 space-y-3">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-foreground sm:text-base">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={ROUTES.signUp}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-8 text-base font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 sm:w-auto"
              >
                Get Started
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`${ROUTES.home}#how-it-works`}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-border bg-surface-elevated px-8 text-base font-semibold text-foreground transition-colors hover:border-brand/30 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 sm:w-auto"
              >
                See how it works
              </Link>
            </div>
          </div>

          <div className="relative mx-auto min-w-0 w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand/20 via-transparent to-accent/10 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-2xl shadow-brand/10">
              <div className="border-b border-border bg-emergency px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/90">
                  Emergency Medical Card — Preview
                </p>
              </div>
              <div className="space-y-5 p-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">Patient</p>
                  <p className="mt-1 text-xl font-bold text-foreground">Alex Morgan</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-emergency-light p-4">
                    <p className="text-xs font-medium text-emergency">Blood type</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">O+</p>
                  </div>
                  <div className="rounded-xl bg-brand-50 p-4 dark:bg-brand-light/30">
                    <p className="text-xs font-medium text-brand">Allergies</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">Penicillin</p>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-xs font-medium text-muted">Emergency contact</p>
                  <p className="mt-1 font-semibold text-foreground">Jordan Morgan — Spouse</p>
                  <p className="mt-1 text-sm font-medium text-brand">+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-dashed border-border bg-surface px-4 py-3">
                  <span className="text-xs text-muted">Scannable QR card</span>
                  <div className="grid h-12 w-12 grid-cols-2 gap-0.5 rounded bg-foreground p-1">
                    <span className="bg-background" />
                    <span className="bg-foreground" />
                    <span className="bg-foreground" />
                    <span className="bg-background" />
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted">
              Example card shown for demonstration purposes only.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
