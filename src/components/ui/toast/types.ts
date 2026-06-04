export type ToastVariant = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  variant: ToastVariant;
  message: string;
  durationMs: number;
};

export type ToastInput = {
  variant: ToastVariant;
  message: string;
  durationMs?: number;
};
