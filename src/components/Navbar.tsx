import Link from "next/link";
import { APP_NAV_LINKS, MARKETING_NAV_LINKS, ROUTES } from "@/lib/constants/routes";

type NavbarProps = {
  variant?: "marketing" | "app";
};

export function Navbar({ variant = "marketing" }: NavbarProps) {
  const links = variant === "app" ? APP_NAV_LINKS : MARKETING_NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={ROUTES.home}
          className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white shadow-sm"
            aria-hidden
          >
            LG
          </span>
          <span>Life Guardian</span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {variant === "marketing" ? (
            <Link
              href={ROUTES.signUp}
              className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition-all hover:bg-brand-dark hover:shadow-md"
            >
              Get Started
            </Link>
          ) : (
            <Link
              href={ROUTES.home}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              Home
            </Link>
          )}
        </div>
      </div>

      {variant === "app" && (
        <nav
          className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden"
          aria-label="Mobile app navigation"
        >
          {APP_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
