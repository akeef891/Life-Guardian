"use client";

type SOSErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SOSError({ error, reset }: SOSErrorProps) {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-900">SOS page error</h2>
      <p className="mt-2 text-sm text-red-800">
        Something went wrong loading the SOS alert tools. Your existing alerts and profile data
        are safe.
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
