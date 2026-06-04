"use client";

import { useState } from "react";
import { PREPAREDNESS_TIPS, type PreparednessTip } from "@/data/preparedness-tips";

function TipCard({ tip }: { tip: PreparednessTip }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="min-w-0 rounded-xl border border-border bg-background">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-4 text-left focus:outline-none focus:ring-4 focus:ring-brand/25"
        aria-expanded={open}
      >
        <span>
          <span className="block text-sm font-semibold text-foreground">{tip.title}</span>
          <span className="mt-1 block text-xs text-muted">{tip.summary}</span>
        </span>
        <span className="shrink-0 text-lg text-muted" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <ol className="list-decimal space-y-2 border-t border-border px-4 py-4 pl-8 text-sm text-foreground">
          {tip.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
    </article>
  );
}

export function PreparednessHub() {
  return (
    <div className="grid min-w-0 gap-4">
      {PREPAREDNESS_TIPS.map((tip) => (
        <TipCard key={tip.id} tip={tip} />
      ))}
    </div>
  );
}
