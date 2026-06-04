export default function RespondNotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-12 text-center">
      <h1 className="text-xl font-bold text-foreground">Link not found</h1>
      <p className="mt-2 text-sm text-muted">
        This emergency response link is invalid or has expired.
      </p>
    </main>
  );
}
