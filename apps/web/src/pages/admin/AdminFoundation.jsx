import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

async function readJson(res) {
  const text = await res.text().catch(() => "");
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function adminJson(url, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const headers = { ...(options.headers || {}) };

  // CSRF header uniquement sur méthodes mutantes
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    headers["X-Requested-With"] = "rg-admin";
  }

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");

  const json = await readJson(res);

  if (!res.ok || json?.ok === false) {
    throw new Error(json?.message || json?.error || `HTTP ${res.status}`);
  }

  return json;
}

function toDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function AdminFoundation() {
  const nav = useNavigate();

  const [status, setStatus] = useState("ALL");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null); // { type: 'ok'|'err', text: string }

  const qs = useMemo(
    () => new URLSearchParams({ status, limit: "100", page: "1" }).toString(),
    [status]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setNotice(null);

    try {
      const json = await adminJson(`/api/admin/foundation/actions?${qs}`);
      setItems(Array.isArray(json.items) ? json.items : []);
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") {
        nav("/admin/login", { replace: true });
        return;
      }
      setNotice({ type: "err", text: e?.message || "Erreur réseau" });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [qs, nav]);

  useEffect(() => {
    load();
  }, [load]);

  const removeItem = async (id) => {
    const ok = window.confirm("Supprimer cet élément ? (irréversible)");
    if (!ok) return;

    setNotice(null);

    try {
      await adminJson(`/api/admin/foundation/actions/${id}`, {
        method: "DELETE",
      });

      setNotice({ type: "ok", text: "Supprimé." });
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") {
        nav("/admin/login", { replace: true });
        return;
      }
      setNotice({ type: "err", text: e?.message || "Erreur suppression" });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <div>
          <h1 style={styles.h1}>Fondation</h1>
          <div style={styles.sub}>
            Gérer les actions / événements (eventDate = “à venir”).
          </div>
        </div>

        <div style={styles.actions}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.select}
          >
            <option value="ALL">Tous</option>
            <option value="PUBLISHED">Publiés</option>
            <option value="DRAFT">Brouillons</option>
          </select>

          <button type="button" style={styles.btnGhost} onClick={load} disabled={loading}>
            {loading ? "..." : "Rafraîchir"}
          </button>

          <Link to="/admin/foundation/new" style={styles.btn}>
            + Nouveau
          </Link>
        </div>
      </div>

      {notice && (
        <div
          style={{
            ...styles.notice,
            ...(notice.type === "ok" ? styles.noticeOk : styles.noticeErr),
          }}
        >
          {notice.text}
        </div>
      )}

      {loading ? (
        <div style={styles.card}>Chargement…</div>
      ) : items.length === 0 ? (
        <div style={styles.card}>Aucun élément.</div>
      ) : (
        <div style={styles.list}>
          {items.map((it) => (
            <div key={it._id} style={styles.item}>
              <div style={styles.itemMain}>
                <div style={styles.badges}>
                  <span
                    style={{
                      ...styles.badge,
                      ...(it.published ? styles.badgeOn : styles.badgeOff),
                    }}
                  >
                    {it.published ? "Publié" : "Brouillon"}
                  </span>
                  <span style={styles.badgeGhost}>Date: {toDate(it.eventDate)}</span>
                  <span style={styles.badgeGhost}>Ordre: {it.order ?? 0}</span>
                </div>

                <div style={styles.title}>{it.title || "—"}</div>
                <div style={styles.meta}>
                  <span style={styles.metaText}>Slug: {it.slug || "—"}</span>
                </div>
                <div style={styles.short}>{it.short || "—"}</div>
              </div>

              <div style={styles.itemSide}>
                <button
                  type="button"
                  style={styles.btnGhost}
                  onClick={() => nav(`/admin/foundation/${it._id}/edit`)}
                >
                  Modifier
                </button>
                <button
                  type="button"
                  style={{ ...styles.btnGhost, ...styles.btnDanger }}
                  onClick={() => removeItem(it._id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: 1100, margin: "0 auto", padding: "0 10px" },
  h1: { margin: 0, fontSize: 28, fontWeight: 950, color: "rgba(255,255,255,0.95)" },
  sub: { marginTop: 6, color: "rgba(255,255,255,0.65)" },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  actions: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },

  select: {
    height: 42,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,10,26,0.35)",
    color: "rgba(255,255,255,0.92)",
    padding: "0 10px",
  },

  btn: {
    height: 42,
    display: "inline-flex",
    alignItems: "center",
    padding: "0 14px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "white",
    textDecoration: "none",
    cursor: "pointer",
  },
  btnGhost: {
    height: 42,
    padding: "0 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.88)",
    cursor: "pointer",
  },

  notice: { borderRadius: 16, padding: 12, marginBottom: 12, border: "1px solid rgba(255,255,255,0.12)" },
  noticeOk: { background: "rgba(34,197,94,0.10)" },
  noticeErr: { background: "rgba(239,68,68,0.10)" },

  card: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
    color: "rgba(255,255,255,0.80)",
  },

  list: { display: "grid", gap: 10 },
  item: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 14,
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 12,
  },
  itemMain: { minWidth: 0 },
  itemSide: { display: "grid", gap: 8, alignContent: "start" },

  badges: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 },
  badge: { padding: "6px 10px", borderRadius: 999, fontSize: 12, border: "1px solid rgba(255,255,255,0.12)" },
  badgeOn: { background: "rgba(34,197,94,0.12)" },
  badgeOff: { background: "rgba(239,68,68,0.10)" },
  badgeGhost: {
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.70)",
  },

  title: { fontWeight: 950, color: "rgba(255,255,255,0.95)", fontSize: 16 },
  meta: { marginTop: 6 },
  metaText: { color: "rgba(255,255,255,0.65)", fontSize: 12 },
  short: { marginTop: 8, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 },

  btnDanger: { borderColor: "rgba(239,68,68,0.30)" },
};