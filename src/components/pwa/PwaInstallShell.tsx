"use client";

import { PwaInstallProvider } from "@/components/pwa/PwaInstallProvider";

export function PwaInstallShell({ children }: { children: React.ReactNode }) {
  return <PwaInstallProvider>{children}</PwaInstallProvider>;
}
