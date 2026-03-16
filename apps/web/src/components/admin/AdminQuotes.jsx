import { useEffect, useMemo, useState } from "react";

const STATUS = ["NEW", "IN_PROGRESS", "DONE"];

export default function AdminQuotes() {
  // const token = localStorage.getItem("rg_admin_token");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [active, setActive] = useState(null); // quote sélectionné
  const [filter, setFilter] = useState("ALL");

  const filtered = useMemo(() => {
    if (filter === "ALL") return items;
    return items.filter((x) => x.status === filter);
  }, [items, filter]);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      // const url = filter === "ALL" ? "/api/admin/quotes" : `/api/admin/quotes?status=${filter}`;
      const url =
  filter === "ALL"
    ? "/api/admin/quotes?status=ALL&limit=100&page=1"
    : `/api/admin/quotes?status=${filter}&limit=100&page=1`;
      const res = await fetch(url, {
        // headers: { Authorization: `Bearer ${token}` }
        credentials: "include"
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok !== true) {
        setErr(json?.message || "Impossible de charger les demandes.");
        return;
      }
      setItems(json.items || []);
      if (json.items?.length && !active) setActive(json.items[0]);
    } catch {
      setErr("Erreur réseau. Vérifie l’API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

const updateQuote = async (id, patch) => {
  // const res = await fetch(`/api/admin/quotes/${id}`, {
  //   method: "PATCH",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify(patch),
  // });
  const res = await fetch(`/api/admin/quotes/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json",
    "X-Requested-With": "rg-admin", },
  credentials: "include",
  body: JSON.stringify(patch),
});

  const text = await res.text();

  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    json = null;
    console.log(e)
  }

  if (!res.ok) {
    const msg = (json && json.message) ? json.message : (text || `HTTP ${res.status}`);
    throw new Error(msg);
  }

  if (!json || json.ok !== true) {
    throw new Error((json && json.message) || "Update failed");
  }

  const updated = json.item;
  setItems((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
  setActive(updated);
};

  // const onLogout = () => {
  //   localStorage.removeItem("rg_admin_token");
  //   localStorage.removeItem("rg_admin_role");
  //   window.location.href = "/admin/login";
  // };
const onLogout = async () => {
  try {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } finally {
    window.location.href = "/admin/login";
  }
};
  return (
    <main style={styles.main}>
      <div style={styles.topBar}>
        <div>
          <div style={styles.h1}>Admin • Demandes de devis</div>
          <div style={styles.sub}>Suivi, statut et notes internes.</div>
        </div>

        <div style={styles.actions}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.select}>
            <option value="ALL">Tous</option>
            {STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button type="button" style={styles.btnGhost} onClick={load}>
            Rafraîchir
          </button>
          <button type="button" style={styles.btnDanger} onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      {loading && <div style={styles.state}>Chargement…</div>}
      {!loading && err && <div style={{ ...styles.state, ...styles.stateErr }}>{err}</div>}

      {!loading && !err && (
        <div style={styles.grid}>
          {/* Liste */}
          <div style={styles.listCard}>
            {filtered.length === 0 ? (
              <div style={styles.empty}>Aucune demande.</div>
            ) : (
              filtered.map((q) => (
                <button
                  key={q._id}
                  type="button"
                  onClick={() => setActive(q)}
                  style={{
                    ...styles.row,
                    ...(active?._id === q._id ? styles.rowActive : null)
                  }}
                >
                  <div style={styles.rowTop}>
                    <div style={styles.rowName}>{q.fullName || "—"}</div>
                    <span style={{ ...styles.badge, ...badgeStyle(q.status) }}>{q.status || "NEW"}</span>
                  </div>
                  <div style={styles.rowSub}>
                    <span>{q.service || "—"}</span>
                    <span style={styles.dot}>•</span>
                    <span>{q.company || "—"}</span>
                  </div>
                  <div style={styles.rowSmall}>
                    {q.subject || "—"}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Détail */}
          <div style={styles.detailCard}>
            {!active ? (
              <div style={styles.empty}>Sélectionne une demande.</div>
            ) : (
              <QuoteDetail
                q={active}
                onUpdate={updateQuote}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function QuoteDetail({ q, onUpdate }) {
  const [status, setStatus] = useState(q.status || "NEW");
  const [notes, setNotes] = useState(q.notes || "");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    setStatus(q.status || "NEW");
    setNotes(q.notes || "");
    setNotice(null);
  }, [q._id]); // eslint-disable-line

  const save = async () => {
    setSaving(true);
    setNotice(null);
    try {
      await onUpdate(q._id, { status, notes });
      setNotice({ type: "ok", text: "Mis à jour." });
    } catch (e)  {
    console.error(e);
      setNotice({ type: "err", text: "Échec de mise à jour." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={styles.detailTop}>
        <div>
          <div style={styles.detailName}>{q.fullName}</div>
          <div style={styles.detailMeta}>
            <a href={`mailto:${q.email}`} style={styles.detailLink}>{q.email}</a>
            <span style={styles.dot}>•</span>
            <a href={`tel:${q.phone}`} style={styles.detailLink}>{q.phone}</a>
          </div>
          <div style={styles.detailSmall}>
            {q.company} — {q.role}
          </div>
        </div>

        <span style={{ ...styles.badge, ...badgeStyle(q.status) }}>
          {q.status || "NEW"}
        </span>
      </div>

      <div style={styles.block}>
        <div style={styles.blockTitle}>Demande</div>
        <div style={styles.blockText}><strong>Service :</strong> {q.service || "—"}</div>
        <div style={styles.blockText}><strong>Objet :</strong> {q.subject || "—"}</div>
        <div style={styles.blockMsg}>{q.message || "—"}</div>
      </div>

      <div style={styles.block}>
        <div style={styles.blockTitle}>Cadre projet</div>
        <div style={styles.blockText}><strong>Budget :</strong> {q.budgetRange || "—"}</div>
        <div style={styles.blockText}><strong>Délai :</strong> {q.timeline || "—"}</div>
        <div style={styles.blockText}><strong>Contact :</strong> {q.preferredContact || "—"}</div>
      </div>

      <div style={styles.block}>
        <div style={styles.blockTitle}>Suivi interne</div>

        <div style={styles.row2}>
          <label style={styles.label}>Statut</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
            {["NEW", "IN_PROGRESS", "DONE"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <label style={styles.label}>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          style={styles.textarea}
          placeholder="Notes internes (non visibles sur le site)…"
        />

        {notice && (
          <div style={{ ...styles.notice, ...(notice.type === "ok" ? styles.noticeOk : styles.noticeErr) }}>
            {notice.text}
          </div>
        )}

        <button type="button" onClick={save} disabled={saving} style={{ ...styles.btn, ...(saving ? styles.btnDis : null) }}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

function badgeStyle(status) {
  if (status === "DONE") return { background: "rgba(34,197,94,0.14)", borderColor: "rgba(34,197,94,0.30)" };
  if (status === "IN_PROGRESS") return { background: "rgba(245,158,11,0.14)", borderColor: "rgba(245,158,11,0.30)" };
  return { background: "rgba(59,130,246,0.14)", borderColor: "rgba(59,130,246,0.30)" };
}

const styles = {
  main: { padding: "96px 18px 60px", maxWidth: 1200, margin: "0 auto" },
  topBar: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  h1: { margin: 0, fontSize: 22, fontWeight: 950, color: "rgba(255,255,255,0.92)" },
  sub: { marginTop: 6, color: "rgba(255,255,255,0.65)" },

  actions: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },

  grid: { display: "grid", gridTemplateColumns: "420px 1fr", gap: 14, marginTop: 16 },
  listCard: {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    overflow: "hidden"
  },
  detailCard: {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 14
  },

  row: {
    width: "100%",
    textAlign: "left",
    padding: "12px 12px",
    border: "none",
    background: "transparent",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer"
  },
  rowActive: { background: "rgba(31,79,216,0.10)" },
  rowTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  rowName: { fontWeight: 900, color: "rgba(255,255,255,0.90)" },
  rowSub: { marginTop: 6, color: "rgba(255,255,255,0.65)", display: "flex", gap: 8, flexWrap: "wrap" },
  rowSmall: { marginTop: 6, color: "rgba(255,255,255,0.55)", fontSize: 12 },

  badge: {
    fontSize: 11,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    color: "rgba(255,255,255,0.86)",
    whiteSpace: "nowrap"
  },

  detailTop: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  detailName: { fontSize: 18, fontWeight: 950, color: "rgba(255,255,255,0.92)" },
  detailMeta: { marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap", color: "rgba(255,255,255,0.70)" },
  detailSmall: { marginTop: 6, color: "rgba(255,255,255,0.60)" },
  detailLink: { color: "rgba(255,255,255,0.84)", textDecoration: "none" },

  block: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(3,10,26,0.28)",
    padding: 12
  },
  blockTitle: { fontWeight: 950, marginBottom: 8, color: "rgba(255,255,255,0.90)" },
  blockText: { color: "rgba(255,255,255,0.72)", marginTop: 4, lineHeight: 1.6 },
  blockMsg: { marginTop: 8, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.82)", lineHeight: 1.7 },

  label: { fontSize: 12, color: "rgba(255,255,255,0.70)", marginTop: 8 },
  row2: { display: "grid", gap: 6 },

  select: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,10,26,0.35)",
    color: "rgba(255,255,255,0.92)",
    outline: "none"
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,10,26,0.35)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
    resize: "vertical"
  },

  btn: {
    marginTop: 10,
    padding: "12px 14px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 10px 26px rgba(31,79,216,.16)",
    cursor: "pointer"
  },
  btnDis: { opacity: 0.7, cursor: "not-allowed" },

  btnGhost: {
    padding: "10px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.88)",
    cursor: "pointer"
  },
  btnDanger: {
    padding: "10px 12px",
    borderRadius: 999,
    background: "rgba(239,68,68,0.14)",
    border: "1px solid rgba(239,68,68,0.30)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer"
  },

  notice: {
    marginTop: 10,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)"
  },
  noticeOk: { background: "rgba(34,197,94,0.12)", borderColor: "rgba(34,197,94,0.28)" },
  noticeErr: { background: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.28)" },

  state: {
    marginTop: 14,
    borderRadius: 18,
    border: "1px dashed rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
    color: "rgba(255,255,255,0.74)"
  },
  stateErr: { borderColor: "rgba(239,68,68,0.35)", color: "rgba(239,68,68,0.92)" },
  empty: { padding: 14, color: "rgba(255,255,255,0.65)" },
  dot: { color: "rgba(255,255,255,0.35)" }

 
};
