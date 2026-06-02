type SOSHistoryItem = {
  id: string;
  status: string;
  message: string | null;
  createdAt: Date;
};

type SOSHistoryListProps = {
  alerts: SOSHistoryItem[];
};

function formatDate(value: Date) {
  return value.toLocaleDateString();
}

function formatTime(value: Date) {
  return value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function SOSHistoryList({ alerts }: SOSHistoryListProps) {
  return (
    <section className="mt-8 rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold text-foreground">SOS History</h2>
      <p className="mt-1 text-sm text-muted">
        Recent SOS events created from your account.
      </p>

      {alerts.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-border bg-background px-4 py-3 text-sm text-muted">
          No SOS events yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className="rounded-lg border border-border bg-background px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sos/10 px-2 py-0.5 text-xs font-semibold text-sos">
                  {alert.status}
                </span>
                <span className="text-sm text-muted">{formatDate(alert.createdAt)}</span>
                <span className="text-sm text-muted">•</span>
                <span className="text-sm text-muted">{formatTime(alert.createdAt)}</span>
              </div>
              {alert.message ? (
                <p className="mt-2 text-sm text-foreground">{alert.message}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
