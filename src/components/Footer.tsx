import Link from "next/link";
import { BrandLogoFull } from "@/components/brand/BrandLogoFull";
import { FOOTER_QUICK_LINKS, ROUTES } from "@/lib/constants/routes";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-auto w-full shrink-0 border-t border-[var(--footer-border)] bg-[var(--footer-bg)] text-[var(--footer-text)]"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>
      <div className="mx-auto min-w-0 max-w-7xl px-6 py-14 lg:px-8">
        <div className="flex min-w-0 flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div className="min-w-0 max-w-md">
            <Link
              href={ROUTES.home}
              className="inline-flex max-w-full rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
            >
              <BrandLogoFull />
            </Link>
            <p className="mt-4 max-w-[28rem] break-words text-sm leading-relaxed text-[var(--footer-muted)]">
              Life Guardian helps people during emergencies with instant access to
              medical information, QR emergency cards, and SOS alerts for families
              and caregivers.
            </p>
          </div>

          <nav aria-label="Footer quick links" className="min-w-0 shrink-0 lg:pt-0">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--footer-text)]">
              Quick Links
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href + link.label} className="min-w-0">
                  <Link
                    href={link.href}
                    className="inline-block break-words rounded-sm py-0.5 text-sm text-[var(--footer-muted)] transition-colors hover:text-[var(--footer-text)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          className="mt-10 mb-8 border-t border-[var(--footer-border)]"
          role="presentation"
          aria-hidden
        />

        <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <p className="text-sm text-[var(--footer-subtle)]">
            © {currentYear} Life Guardian. All rights reserved.
          </p>
          <p className="max-w-xl break-words text-xs leading-relaxed text-[var(--footer-subtle)] lg:text-right">
            Not a substitute for professional emergency services. Call your local
            emergency number when in immediate danger.
          </p>
        </div>
      </div>
    </footer>
  );
}
