"use client";

import { usePwaInstall } from "@/components/pwa/PwaInstallProvider";
import { cn } from "@/lib/utils/cn";

type InstallAppButtonProps = {
  className?: string;
};

/** Desktop / tablet navbar install CTA — hidden when install is unavailable or already installed. */
export function InstallAppButton({ className }: InstallAppButtonProps) {
  const { canInstall, promptInstall } = usePwaInstall();

  if (!canInstall) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => void promptInstall()}
      className={cn(
        "inline-flex min-h-11 items-center rounded-lg border border-brand/30 bg-brand/10 px-3 py-2 text-sm font-semibold text-brand-dark transition-colors duration-200 hover:bg-brand/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25",
        className,
      )}
    >
      Install App
    </button>
  );
}
