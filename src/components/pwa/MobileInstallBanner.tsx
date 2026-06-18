"use client";

import { usePwaInstall } from "@/components/pwa/PwaInstallProvider";

/** Mobile-only sticky install banner — single prompt surface on small screens. */
export function MobileInstallBanner() {
  const { canInstall, promptInstall } = usePwaInstall();

  if (!canInstall) {
    return null;
  }

  return (
    <div className="border-b border-brand/20 bg-brand/10 px-4 py-2.5 md:hidden">
      <div className="mx-auto flex min-w-0 max-w-6xl items-center justify-between gap-3">
        <p className="min-w-0 text-sm font-medium text-slate-900">
          Install Life Guardian for quick SOS access
        </p>
        <button
          type="button"
          onClick={() => void promptInstall()}
          className="inline-flex shrink-0 min-h-10 items-center rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
        >
          Install
        </button>
      </div>
    </div>
  );
}
