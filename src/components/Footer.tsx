import Link from "next/link";
import { FOOTER_QUICK_LINKS, ROUTES } from "@/lib/constants/routes";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-foreground text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link href={ROUTES.home} className="inline-flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white"
                aria-hidden
              >
                LG
              </span>
              <span className="text-lg font-semibold">Life Guardian</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Life Guardian helps people during emergencies with instant access to
              medical information, QR emergency cards, and SOS alerts for families
              and caregivers.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Quick Links
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-2">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/60">
            © {currentYear} Life Guardian. All rights reserved.
          </p>
          <p className="text-xs text-white/50">
            Not a substitute for professional emergency services. Call your local
            emergency number when in immediate danger.
          </p>
        </div>
      </div>
    </footer>
  );
}
