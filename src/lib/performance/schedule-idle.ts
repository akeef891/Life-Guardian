/** Schedules non-critical work after initial paint to reduce Total Blocking Time. */
export function scheduleIdleTask(task: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(task, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }

  const id = globalThis.setTimeout(task, 1);
  return () => globalThis.clearTimeout(id);
}
