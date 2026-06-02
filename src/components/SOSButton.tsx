"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type SOSButtonProps = {
  className?: string;
  onTrigger?: () => void;
};

export function SOSButton({ className, onTrigger }: SOSButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  function handleClick() {
    setIsPressed(true);
    onTrigger?.();
    setTimeout(() => setIsPressed(false), 2000);
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Trigger SOS alert"
        className={cn(
          "relative flex h-40 w-40 items-center justify-center rounded-full bg-sos text-2xl font-bold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sos active:scale-95",
          isPressed && "animate-pulse ring-4 ring-sos/40",
        )}
      >
        SOS
      </button>
      <p className="max-w-xs text-center text-sm text-muted">
        {isPressed
          ? "SOS UI placeholder — connect alert service in a later phase."
          : "Tap to preview the SOS trigger experience. No alerts are sent yet."}
      </p>
    </div>
  );
}
