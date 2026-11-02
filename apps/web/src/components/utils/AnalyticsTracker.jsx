import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "../../lib/analytics.js";

export default function AnalyticsTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname.startsWith("/admin")) trackEvent("page_view", pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest?.("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (href.startsWith("tel:")) trackEvent("phone_click");
      else if (href.startsWith("mailto:")) trackEvent("email_click");
      else if (href.includes("wa.me/")) trackEvent("whatsapp_click");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
