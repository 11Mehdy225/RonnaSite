const STORAGE_KEY = "rg_campaign_attribution";
const SESSION_KEY = "rg_analytics_session";
const SENT_KEY = "rg_analytics_sent";
export const ANALYTICS_OPT_OUT_KEY = "rg_analytics_opt_out";

const ALLOWED_SOURCES = new Set(["facebook", "instagram", "google", "linkedin", "whatsapp", "email", "meta_ads", "google_ads"]);
const ALLOWED_MEDIUMS = new Set(["paid_social", "cpc", "social", "email", "referral", "paid"]);
const CAMPAIGN_PATTERN = /^[a-z0-9][a-z0-9_-]{0,79}$/;

function clean(value, max = 120) {
  return String(value || "").trim().slice(0, max);
}

function getSessionId() {
  let sessionId = "";
  try { sessionId = window.sessionStorage.getItem(SESSION_KEY) || ""; } catch { sessionId = ""; }
  if (!sessionId) {
    sessionId = globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    try { window.sessionStorage.setItem(SESSION_KEY, sessionId); } catch { /* stockage indisponible */ }
  }
  return sessionId;
}

export function isAnalyticsOptedOut() {
  if (typeof window === "undefined") return false;
  try { return window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "1"; } catch { return false; }
}

export function setAnalyticsOptOut(disabled) {
  try {
    if (disabled) window.localStorage.setItem(ANALYTICS_OPT_OUT_KEY, "1");
    else window.localStorage.removeItem(ANALYTICS_OPT_OUT_KEY);
  } catch { /* stockage indisponible */ }
}

function alreadySent(key) {
  let sent = [];
  try { sent = JSON.parse(window.sessionStorage.getItem(SENT_KEY) || "[]"); } catch { sent = []; }
  if (sent.includes(key)) return true;
  try { window.sessionStorage.setItem(SENT_KEY, JSON.stringify([...sent.slice(-80), key])); } catch { /* stockage indisponible */ }
  return false;
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
    const requestedSource = clean(params.get("utm_source") || platform).toLowerCase();
    const requestedMedium = clean(params.get("utm_medium") || (platform ? "paid" : "")).toLowerCase();
    const requestedName = clean(params.get("utm_campaign")).toLowerCase();
    const validCampaign = (!hasCampaign || platform || (ALLOWED_SOURCES.has(requestedSource) && ALLOWED_MEDIUMS.has(requestedMedium)))
      && (!requestedName || CAMPAIGN_PATTERN.test(requestedName));
    stored = {
      source: validCampaign ? (requestedSource || referrer || "direct") : (referrer || "direct"),
      medium: validCampaign ? (requestedMedium || (referrer ? "referral" : "none")) : (referrer ? "referral" : "none"),
      name: validCampaign && requestedName ? requestedName : "not_set",
      content: validCampaign ? clean(params.get("utm_content")).toLowerCase() : "",
      term: validCampaign ? clean(params.get("utm_term")).toLowerCase() : "",
      landingPage: clean(window.location.pathname, 240),
      referrer: clean(referrer)
    };
    try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored)); } catch { /* stockage indisponible */ }
  }
  return stored;
}

export function trackEvent(event, path = window.location.pathname) {
  if (typeof window === "undefined" || isAnalyticsOptedOut()) return;
  const safePath = String(path || "/").split("?")[0].slice(0, 240);
  const sessionId = getSessionId();
  const eventKey = `${event}:${safePath}`;
  if (alreadySent(eventKey)) return;
  const payload = { event, path: safePath, sessionId, version: 2, campaign: getCampaignAttribution() };
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
