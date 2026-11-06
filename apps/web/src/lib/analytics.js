const STORAGE_KEY = "rg_campaign_attribution";

function clean(value, max = 120) {
  return String(value || "").trim().slice(0, max);
}

export function getCampaignAttribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const hasCampaign = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"].some((key) => params.has(key));
  let stored = {};
  try { stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "{}"); } catch { stored = {}; }

  if (hasCampaign || !stored.source) {
    let referrer = "";
    try { referrer = document.referrer ? new URL(document.referrer).hostname : ""; } catch { referrer = ""; }
    const platform = params.has("gclid") ? "google_ads" : params.has("fbclid") ? "meta_ads" : "";
    stored = {
      source: clean(params.get("utm_source") || platform || referrer || "direct"),
      medium: clean(params.get("utm_medium") || (platform ? "paid" : referrer ? "referral" : "none")),
      name: clean(params.get("utm_campaign") || "not_set"),
      content: clean(params.get("utm_content")),
      term: clean(params.get("utm_term")),
      landingPage: clean(window.location.pathname, 240),
      referrer: clean(referrer)
    };
    try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored)); } catch { /* stockage indisponible */ }
  }
  return stored;
}

export function trackEvent(event, path = window.location.pathname) {
  const payload = { event, path: String(path || "/").slice(0, 240), campaign: getCampaignAttribution() };
  const body = JSON.stringify(payload);
  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});

  if (typeof window.gtag === "function") window.gtag("event", event, { page_path: payload.path, campaign_name: payload.campaign.name });
  if (typeof window.fbq === "function" && ["quote_submitted", "tool_completed"].includes(event)) {
    window.fbq("trackCustom", event, { path: payload.path, campaign: payload.campaign.name });
  }
}
