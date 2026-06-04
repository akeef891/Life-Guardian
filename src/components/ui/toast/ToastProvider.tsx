"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ToastInput, ToastItem } from "./types";

const DEFAULT_DURATION_MS = 4500;

type ToastContextValue = {
  toast: (input: ToastInput) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function createToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function ToastViewport({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      aria-live="polite"
      aria-relevant="additions"
      role="region"
      aria-label="Notifications"
    >
      {items.map((item) => (
        <div
          key={item.id}
          role="status"
          className={[
            "pointer-events-auto w-full max-w-sm rounded-xl border px-4 py-3 shadow-lg transition",
            item.variant === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : item.variant === "error"
                ? "border-red-200 bg-red-50 text-red-900"
                : "border-border bg-surface text-foreground",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <p className="min-w-0 flex-1 text-sm font-medium">{item.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(item.id)}
              className="shrink-0 rounded-md px-1.5 py-0.5 text-xs font-semibold opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand/40"
              aria-label="Dismiss notification"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = createToastId();
      const durationMs = input.durationMs ?? DEFAULT_DURATION_MS;
      const item: ToastItem = {
        id,
        variant: input.variant,
        message: input.message,
        durationMs,
      };

      setItems((prev) => [...prev.slice(-4), item]);

      const timer = setTimeout(() => dismiss(id), durationMs);
      timersRef.current.set(id, timer);
    },
    [dismiss],
  );

  const success = useCallback((message: string) => toast({ variant: "success", message }), [toast]);
  const error = useCallback((message: string) => toast({ variant: "error", message }), [toast]);
  const info = useCallback((message: string) => toast({ variant: "info", message }), [toast]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const value = useMemo(
    () => ({ toast, success, error, info }),
    [toast, success, error, info],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
