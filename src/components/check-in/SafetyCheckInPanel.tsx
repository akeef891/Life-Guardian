"use client";

import { useActionState, useRef } from "react";
import { submitSafetyCheckIn } from "@/app/(app)/check-in/actions";
import { CHECK_IN_INITIAL_STATE } from "@/app/(app)/check-in/types";
import { useActionStateToast } from "@/components/ui/toast/useActionStateToast";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  SAFETY_CHECK_IN_STATUS,
  type SafetyCheckInStatus,
} from "@/types/safety-check-in";

type SafetyCheckInPanelProps = {
  latestStatus: SafetyCheckInStatus | null;
  latestAt: string | null;
};

const STATUS_BUTTONS: SafetyCheckInStatus[] = [
  SAFETY_CHECK_IN_STATUS.SAFE,
  SAFETY_CHECK_IN_STATUS.NEED_ASSISTANCE,
  SAFETY_CHECK_IN_STATUS.TRAVELING,
];

export function SafetyCheckInPanel({ latestStatus, latestAt }: SafetyCheckInPanelProps) {
  const { dictionary: t } = useLocale();
  const [state, formAction, isPending] = useActionState(
    submitSafetyCheckIn,
    CHECK_IN_INITIAL_STATE,
  );

  useActionStateToast(state);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);

  const labels: Record<SafetyCheckInStatus, string> = {
    SAFE: t.checkIn.safe,
    NEED_ASSISTANCE: t.checkIn.needHelp,
    TRAVELING: t.checkIn.traveling,
  };

  return (
    <div className="min-w-0 space-y-6">
      {latestStatus ? (
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {t.checkIn.latest}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{latestStatus}</p>
          {latestAt ? <p className="mt-1 text-xs text-muted">{latestAt}</p> : null}
        </div>
      ) : null}

      <form ref={formRef} action={formAction} className="space-y-4" aria-busy={isPending}>
        <input ref={statusRef} type="hidden" name="status" defaultValue="" />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">Note (optional)</span>
          <textarea
            name="note"
            rows={3}
            placeholder={t.checkIn.notePlaceholder}
            className="w-full min-h-11 resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none ring-brand/20 focus:ring-4"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          {STATUS_BUTTONS.map((status) => (
            <button
              key={status}
              type="button"
              disabled={isPending}
              onClick={() => {
                if (statusRef.current) {
                  statusRef.current.value = status;
                }
                formRef.current?.requestSubmit();
              }}
              className={[
                "inline-flex min-h-12 items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-4 disabled:opacity-60",
                status === SAFETY_CHECK_IN_STATUS.NEED_ASSISTANCE
                  ? "border-sos/30 bg-sos/10 text-sos hover:bg-sos/20 focus:ring-sos/30"
                  : "border-border bg-background text-foreground hover:border-brand/30 hover:bg-brand/5 focus:ring-brand/25",
              ].join(" ")}
            >
              {labels[status]}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
