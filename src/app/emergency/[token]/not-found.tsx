import Link from "next/link";

export default function EmergencyTokenNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center px-4 py-16">
      <div className="w-full rounded-2xl border border-border bg-surface p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Emergency card not found</h1>
        <p className="mt-3 text-sm text-muted">
          The QR token is invalid, expired, or no longer active. Please request a new
          QR card from the account owner.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
