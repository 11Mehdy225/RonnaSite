import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../../lib/api.js";

export default function RequireAdmin({ children }) {
  const nav = useNavigate();
  const loc = useLocation();
  const [ok, setOk] = useState(null); // null=loading, true/false

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch(apiUrl("/api/admin/auth/me", { credentials: "include" }));
        if (!alive) return;

        if (!res.ok) {
          setOk(false);
          nav("/admin/login", { replace: true, state: { from: loc.pathname } });
          return;
        }

        const json = await res.json().catch(() => ({}));
        if (!json?.ok) {
          setOk(false);
          nav("/admin/login", { replace: true, state: { from: loc.pathname } });
          return;
        }

        setOk(true);
      } catch {
        setOk(false);
        nav("/admin/login", { replace: true, state: { from: loc.pathname } });
      }
    })();

    return () => {
      alive = false;
    };
  }, [nav, loc.pathname]);

  if (ok === null) return <div style={{ padding: 24 }}>Chargement…</div>;
  if (ok === false) return null;

  return children;
}