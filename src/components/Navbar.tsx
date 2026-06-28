"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { BrandLogoIcon } from "@/components/brand/BrandLogoIcon";
import { APP_NAV_LINKS, MARKETING_NAV_LINKS, ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

const MobileInstallBanner = dynamic(
  () => import("@/components/pwa/MobileInstallBanner").then((mod) => mod.MobileInstallBanner),
  { ssr: false },
);

const InstallAppButton = dynamic(
  () => import("@/components/pwa/InstallAppButton").then((mod) => mod.InstallAppButton),
  { ssr: false },
);

type NavbarProps = {
  variant?: "marketing" | "app";
};

function isActivePath(pathname: string, href: string) {
  if (href === ROUTES.home) {
    return pathname === ROUTES.home;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  pathname,
  onNavigate,
  className,
}: {
  href: string;
  label: string;
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25",
        active
          ? "bg-brand-light text-brand-dark"
          : "text-muted hover:bg-surface hover:text-foreground",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export function Navbar({ variant = "marketing" }: NavbarProps) {
  const pathname = usePathname();
  const links = variant === "app" ? APP_NAV_LINKS : MARKETING_NAV_LINKS;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    queueMicrotask(() => closeMenu());
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md">
      <MobileInstallBanner />
      <div className="mx-auto flex h-16 min-w-0 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={ROUTES.home}
          className="flex min-w-0 shrink-0 items-center gap-3 font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25"
        >
          <BrandLogoIcon className="h-10 w-10" sizes="40px" priority />
          <span className="truncate font-semibold">Life Guardian</span>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-8 lg:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <NavLink key={link.href + link.label} href={link.href} label={link.label} pathname={pathname} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <InstallAppButton className="hidden md:inline-flex" />
          {variant === "marketing" ? (
            <Link
              href={ROUTES.signUp}
              className="inline-flex min-h-11 items-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition-all duration-200 hover:bg-brand-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
            </Link>
          ) : (
            <Link
              href={ROUTES.home}
              className="hidden min-h-11 items-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25 lg:inline-flex"
            >
              Home
            </Link>
          )}

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border text-foreground transition-colors duration-200 hover:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25 md:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span className="flex flex-col gap-1.5" aria-hidden>
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-foreground transition-transform duration-200",
                  menuOpen && "translate-y-2 rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-foreground transition-opacity duration-200",
                  menuOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-foreground transition-transform duration-200",
                  menuOpen && "-translate-y-2 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <nav
        className="mx-auto hidden max-w-6xl flex-wrap items-center justify-center gap-6 border-t border-border/60 px-4 py-2.5 md:flex lg:hidden"
        aria-label="Tablet navigation"
      >
        {links.map((link) => (
          <NavLink key={`tablet-${link.href}`} href={link.href} label={link.label} pathname={pathname} />
        ))}
      </nav>

      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 top-16 z-40 bg-foreground/20 backdrop-blur-[1px] transition-opacity duration-200 md:hidden"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
      ) : null}

      <nav
        id={menuId}
        className={cn(
          "fixed right-0 top-16 z-50 flex h-[calc(100dvh-4rem)] w-[min(100%,20rem)] flex-col gap-1 border-l border-border bg-background p-4 shadow-xl transition-transform duration-300 ease-out md:hidden",
          menuOpen ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className="mb-2 border-b border-border px-1 pb-4">
          <Link
            href={ROUTES.home}
            onClick={closeMenu}
            className="inline-flex min-h-11 items-center gap-3 rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25"
          >
            <BrandLogoIcon className="h-11 w-11" sizes="44px" />
            <span className="text-base font-semibold">Life Guardian</span>
          </Link>
        </div>
        {links.map((link) => (
          <NavLink
            key={`mobile-${link.href}`}
            href={link.href}
            label={link.label}
            pathname={pathname}
            onNavigate={closeMenu}
            className="w-full px-4 text-base"
          />
        ))}
        {variant === "app" ? (
          <NavLink
            href={ROUTES.home}
            label="Home"
            pathname={pathname}
            onNavigate={closeMenu}
            className="mt-2 w-full border-t border-border px-4 pt-4 text-base"
          />
        ) : null}
      </nav>
    </header>
  );
}
