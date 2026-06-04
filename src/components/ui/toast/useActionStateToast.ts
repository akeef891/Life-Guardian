"use client";

import { useEffect, useRef } from "react";
import { useToast } from "./ToastProvider";

type ActionStateWithFeedback = {
  success: boolean;
  message?: string;
  error?: string;
};

/**
 * Shows toast when server action state changes (skips initial mount).
 */
export function useActionStateToast(state: ActionStateWithFeedback): void {
  const { success, error } = useToast();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (state.error) {
      error(state.error);
      return;
    }

    if (state.success) {
      success(state.message ?? "Action completed successfully.");
    }
  }, [state.success, state.message, state.error, success, error]);
}
