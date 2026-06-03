"use client";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <div className="mx-auto w-full max-w-6xl rounded-2xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-900">Dashboard error</h2>
      <p className="mt-2 text-sm text-red-800">
        We could not load your dashboard. Your account data has not been changed.
      </p>
      {process.env.NODE_ENV === "development" ? (
        <p className="mt-2 text-xs text-red-700">{error.message}</p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
      >
        Try again
      </button>
    </div>
  );
}
