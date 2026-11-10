import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "../../lib/analytics.js";

const TOOL_PATHS = new Set(["/audit-express", "/devis-express", "/cahier-des-charges", "/diagnostic-visibilite", "/calculateur-roi", "/plan-transformation"]);
const RESULT_ACTIONS = ["voir mon diagnostic", "calculer mon roi", "générer mon document", "générer ma feuille de route", "générer mon plan", "voir mon estimation"];

export default function AnalyticsTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname.startsWith("/admin")) {
      trackEvent("page_view", pathname);
    }
  }, [pathname]);

  useEffect(() => {
    const onInteraction = (event) => {
      const field = event.target.closest?.("input, select, textarea");
      if (!field || field.type === "hidden" || field.getAttribute("aria-hidden") === "true") return;
      if (TOOL_PATHS.has(window.location.pathname)) trackEvent("tool_started", window.location.pathname);
    };
    const onClick = (event) => {
      const link = event.target.closest?.("a[href]");
      if (link) {
        const href = link.getAttribute("href") || "";
        if (href.startsWith("tel:")) trackEvent("phone_click");
        else if (href.startsWith("mailto:")) trackEvent("email_click");
        else if (href.includes("wa.me/")) trackEvent("whatsapp_click");
        else if (TOOL_PATHS.has(href)) trackEvent("tool_click", href);
      }
      const button = event.target.closest?.("button");
      const label = button?.textContent?.trim().toLowerCase() || "";
      if (button && !button.disabled && TOOL_PATHS.has(window.location.pathname) && RESULT_ACTIONS.some((text) => label.includes(text))) {
        trackEvent("tool_completed", window.location.pathname);
      }
    };
    document.addEventListener("change", onInteraction, true);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("change", onInteraction, true);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
