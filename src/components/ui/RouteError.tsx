"use client";

type RouteErrorProps = {
  title: string;
  description: string;
  error: Error & { digest?: string };
  reset: () => void;
};

export function RouteError({ title, description, error, reset }: RouteErrorProps) {
  if (process.env.NODE_ENV === "development") {
    console.error(`[Life Guardian] ${title}:`, error.message);
  }

  return (
    <div
      className="mx-auto w-full min-w-0 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6"
      role="alert"
    >
      <h2 className="text-lg font-semibold text-red-900">{title}</h2>
      <p className="mt-2 text-sm text-red-800">{description}</p>
      {process.env.NODE_ENV === "development" ? (
        <p className="mt-2 break-words text-xs text-red-700">{error.message}</p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
      >
        Try again
      </button>
    </div>
  );
}
