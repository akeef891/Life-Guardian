"use client";

import { useState, useTransition } from "react";
import { LocalDateTime } from "@/components/datetime/LocalDateTime";
import { submitContactResponse } from "@/app/respond/[token]/actions";
import {
  CONTACT_RESPONSE_STATUS,
  type ContactResponseStatus,
} from "@/types/emergency-response";

type ContactResponsePanelProps = {
  token: string;
  contactName: string;
  victimName: string;
  currentStatus: ContactResponseStatus;
  alertTime: string;
};

const STATUS_OPTIONS: Array<{
  value: ContactResponseStatus;
  label: string;
  description: string;
}> = [
  {
    value: CONTACT_RESPONSE_STATUS.RESPONDING,
    label: "I'm responding",
    description: "You are on your way or taking action now.",
  },
  {
    value: CONTACT_RESPONSE_STATUS.SAFE,
    label: "They are safe",
    description: "You have confirmed the person is safe.",
  },
  {
    value: CONTACT_RESPONSE_STATUS.UNAVAILABLE,
    label: "Unavailable",
    description: "You cannot assist at this time.",
  },
];

export function ContactResponsePanel({
  token,
  contactName,
  victimName,
  currentStatus,
  alertTime,
}: ContactResponsePanelProps) {
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(next: ContactResponseStatus) {
    setError(null);
    startTransition(async () => {
      const result = await submitContactResponse(token, next);
      if (result.success) {
        setStatus(next);
        setMessage("Thank you. Your response was recorded.");
      } else {
        setError(result.error ?? "Unable to save your response.");
      }
    });
  }

  const alreadyAnswered = status !== CONTACT_RESPONSE_STATUS.PENDING;

  return (
    <section className="min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Emergency contact acknowledgement
      </p>
      <h1 className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
        Hi {contactName}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {victimName} triggered an SOS alert on{" "}
        <LocalDateTime value={alertTime} mode="datetime" className="font-medium text-foreground" />
        . Please choose your response.
      </p>

      {alreadyAnswered ? (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">
            Current status: {status}
          </p>
          {message ? <p className="mt-1 text-sm text-emerald-800">{message}</p> : null}
          <p className="mt-2 text-xs text-emerald-800">
            You can update your response below if the situation changes.
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="mt-5 space-y-3">
        {STATUS_OPTIONS.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleSubmit(option.value)}
              className="flex min-h-14 w-full flex-col items-start rounded-xl border border-border bg-background p-4 text-left transition-colors hover:border-brand/40 hover:bg-brand/5 focus:outline-none focus:ring-4 focus:ring-brand/25 disabled:opacity-60"
            >
              <span className="text-sm font-semibold text-foreground">{option.label}</span>
              <span className="mt-1 text-xs text-muted">{option.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
