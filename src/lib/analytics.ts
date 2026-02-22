export async function trackCopyEvent(componentId: string): Promise<void> {
  try {
    await fetch("/api/analytics/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ componentId }),
      keepalive: true,
    });
  } catch {
    // Non-blocking analytics.
  }
}

export async function trackPageView(path: string): Promise<void> {
  try {
    await fetch("/api/analytics/pageview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path }),
      keepalive: true,
    });
  } catch {
    // Non-blocking analytics.
  }
}
