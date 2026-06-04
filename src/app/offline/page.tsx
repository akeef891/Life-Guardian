export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-foreground">You are offline</h1>
      <p className="mt-3 text-sm text-muted">
        Life Guardian saved a basic shell. Reconnect to sync SOS, check-ins, and live resources.
      </p>
      <a
        href="/dashboard"
        className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white"
      >
        Open dashboard
      </a>
    </main>
  );
}
