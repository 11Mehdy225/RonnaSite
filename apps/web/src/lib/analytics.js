export function trackEvent(event, path = window.location.pathname) {
  const body = JSON.stringify({ event, path: String(path || "/").slice(0, 240) });
  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
