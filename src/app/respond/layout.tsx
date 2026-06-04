export default function RespondLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface px-4 py-4 sm:px-6">
        <p className="text-sm font-semibold text-foreground">Life Guardian</p>
        <p className="text-xs text-muted">Emergency response</p>
      </header>
      {children}
    </div>
  );
}
