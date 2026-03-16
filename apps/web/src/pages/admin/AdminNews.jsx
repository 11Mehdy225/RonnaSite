// import { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const STATUS_OPTIONS = [
//   { value: "ALL", label: "Tous" },
//   { value: "PUBLISHED", label: "Publiées" },
//   { value: "DRAFT", label: "Brouillons" }
// ];

// export default function AdminNews() {
//   const nav = useNavigate();
//   const token = localStorage.getItem("rg_admin_token");

//   const [status, setStatus] = useState("ALL");
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);

//   const load = async () => {
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await fetch(`/api/admin/news?status=${status}&limit=50&page=1`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const json = await res.json().catch(() => ({}));

//       if (!res.ok || json?.ok !== true) {
//         setErr(json?.message || "Impossible de charger les actualités.");
//         return;
//       }
//       setItems(json.items || []);
//     } catch {
//       setErr("Erreur réseau. Vérifie que l’API tourne.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [status]);

//   const stats = useMemo(() => {
//     const total = items.length;
//     const published = items.filter((x) => x.published === true).length;
//     const draft = items.filter((x) => x.published === false).length;
//     return { total, published, draft };
//   }, [items]);

//   return (
//     <div style={styles.wrap}>
//       <div style={styles.top}>
//         <div>
//           <div style={styles.h1}>Actualités</div>
//           <div style={styles.sub}>
//             Total: <strong>{stats.total}</strong> • Publiées: <strong>{stats.published}</strong> • Brouillons:{" "}
//             <strong>{stats.draft}</strong>
//           </div>
//         </div>

//         <div style={styles.actions}>
//           <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
//             {STATUS_OPTIONS.map((o) => (
//               <option key={o.value} value={o.value}>
//                 {o.label}
//               </option>
//             ))}
//           </select>

//           <button type="button" style={styles.btnGhost} onClick={load}>
//             Rafraîchir
//           </button>

//           <Link to="/admin/news/new" style={styles.btn}>
//             + Nouvelle actu
//           </Link>
//         </div>
//       </div>

//       {loading && <div style={styles.state}>Chargement…</div>}
//       {!loading && err && <div style={{ ...styles.state, ...styles.stateErr }}>{err}</div>}

//       {!loading && !err && (
//         <div style={styles.list}>
//           {items.length === 0 ? (
//             <div style={styles.empty}>Aucune actualité.</div>
//           ) : (
//             items.map((n) => (
//               <button
//                 key={n._id}
//                 type="button"
//                 onClick={() => nav(`/admin/news/${n._id}/edit`)}
//                 style={styles.row}
//               >
//                 <div style={styles.rowTop}>
//                   <div style={styles.title}>{n.title || "—"}</div>
//                   <span style={{ ...styles.badge, ...(n.published ? styles.badgeOn : styles.badgeOff) }}>
//                     {n.published ? "PUBLISHED" : "DRAFT"}
//                   </span>
//                 </div>
//                 <div style={styles.meta}>
//                   <span>{n.category || "—"}</span>
//                   <span style={styles.dot}>•</span>
//                   <span>{n.slug || "—"}</span>
//                   <span style={styles.dot}>•</span>
//                   <span>{formatDate(n.publishedAt || n.createdAt)}</span>
//                 </div>
//                 <div style={styles.excerpt}>{n.excerpt || "—"}</div>
//               </button>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function formatDate(d) {
//   try {
//     const dt = new Date(d);
//     if (Number.isNaN(dt.getTime())) return "—";
//     return dt.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" });
//   } catch {
//     return "—";
//   }
// }

// const styles = {
//   wrap: { maxWidth: 1200, margin: "0 auto" },
//   top: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
//   h1: { fontSize: 22, fontWeight: 950, color: "rgba(255,255,255,0.92)" },
//   sub: { marginTop: 6, color: "rgba(255,255,255,0.65)" },

//   actions: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },

//   select: {
//     padding: "10px 12px",
//     borderRadius: 14,
//     border: "1px solid rgba(255,255,255,0.12)",
//     background: "rgba(3,10,26,0.35)",
//     color: "rgba(255,255,255,0.92)",
//     outline: "none"
//   },

//   btn: {
//     padding: "10px 14px",
//     borderRadius: 999,
//     background: "rgba(31,79,216,.95)",
//     border: "1px solid rgba(255,255,255,0.14)",
//     textDecoration: "none",
//     color: "white",
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 8
//   },
//   btnGhost: {
//     padding: "10px 12px",
//     borderRadius: 999,
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.12)",
//     color: "rgba(255,255,255,0.88)",
//     cursor: "pointer"
//   },

//   state: {
//     marginTop: 14,
//     borderRadius: 18,
//     border: "1px dashed rgba(255,255,255,0.16)",
//     background: "rgba(255,255,255,0.03)",
//     padding: 16,
//     color: "rgba(255,255,255,0.74)"
//   },
//   stateErr: { borderColor: "rgba(239,68,68,0.35)", color: "rgba(239,68,68,0.92)" },

//   list: { marginTop: 14, display: "grid", gap: 10 },
//   row: {
//     width: "100%",
//     textAlign: "left",
//     borderRadius: 18,
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "rgba(255,255,255,0.03)",
//     padding: 12,
//     cursor: "pointer"
//   },
//   rowTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
//   title: { fontWeight: 950, color: "rgba(255,255,255,0.90)" },
//   badge: {
//     fontSize: 11,
//     padding: "6px 10px",
//     borderRadius: 999,
//     border: "1px solid rgba(255,255,255,0.14)",
//     color: "rgba(255,255,255,0.86)",
//     whiteSpace: "nowrap"
//   },
//   badgeOn: { background: "rgba(34,197,94,0.14)", borderColor: "rgba(34,197,94,0.30)" },
//   badgeOff: { background: "rgba(245,158,11,0.14)", borderColor: "rgba(245,158,11,0.30)" },

//   meta: { marginTop: 6, color: "rgba(255,255,255,0.60)", display: "flex", gap: 8, flexWrap: "wrap" },
//   dot: { color: "rgba(255,255,255,0.35)" },
//   excerpt: { marginTop: 8, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 },

//   empty: { padding: 14, color: "rgba(255,255,255,0.65)" }
// };


import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tous" },
  { value: "PUBLISHED", label: "Publiées" },
  { value: "DRAFT", label: "Brouillons" },
];

export default function AdminNews() {
  const nav = useNavigate();

  const [status, setStatus] = useState("ALL");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(`/api/admin/news?status=${encodeURIComponent(status)}&limit=50&page=1`, {
        credentials: "include",
      });

      const json = await res.json().catch(() => ({}));

      // session expirée / pas connecté
      if (res.status === 401) {
        nav("/admin/login", { replace: true });
        return;
      }

      if (!res.ok || json?.ok !== true) {
        setErr(json?.message || "Impossible de charger les actualités.");
        return;
      }

      setItems(json.items || []);
    } catch {
      setErr("Erreur réseau. Vérifie que l’API tourne.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter((x) => x.published === true).length;
    const draft = items.filter((x) => x.published === false).length;
    return { total, published, draft };
  }, [items]);

  return (
    <div style={styles.wrap}>
      <div style={styles.top}>
        <div>
          <div style={styles.h1}>Actualités</div>
          <div style={styles.sub}>
            Total: <strong>{stats.total}</strong> • Publiées: <strong>{stats.published}</strong> • Brouillons:{" "}
            <strong>{stats.draft}</strong>
          </div>
        </div>

        <div style={styles.actions}>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <button type="button" style={styles.btnGhost} onClick={load}>
            Rafraîchir
          </button>

          <Link to="/admin/news/new" style={styles.btn}>
            + Nouvelle actu
          </Link>
        </div>
      </div>

      {loading && <div style={styles.state}>Chargement…</div>}
      {!loading && err && <div style={{ ...styles.state, ...styles.stateErr }}>{err}</div>}

      {!loading && !err && (
        <div style={styles.list}>
          {items.length === 0 ? (
            <div style={styles.empty}>Aucune actualité.</div>
          ) : (
            items.map((n) => (
              <button
                key={n._id}
                type="button"
                onClick={() => nav(`/admin/news/${n._id}/edit`)}
                style={styles.row}
              >
                <div style={styles.rowTop}>
                  <div style={styles.title}>{n.title || "—"}</div>
                  <span style={{ ...styles.badge, ...(n.published ? styles.badgeOn : styles.badgeOff) }}>
                    {n.published ? "PUBLISHED" : "DRAFT"}
                  </span>
                </div>

                <div style={styles.meta}>
                  <span>{n.category || "—"}</span>
                  <span style={styles.dot}>•</span>
                  <span>{n.slug || "—"}</span>
                  <span style={styles.dot}>•</span>
                  <span>{formatDate(n.publishedAt || n.createdAt)}</span>
                </div>

                <div style={styles.excerpt}>{n.excerpt || "—"}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function formatDate(d) {
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "—";
    return dt.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return "—";
  }
}

const styles = {
  wrap: { maxWidth: 1200, margin: "0 auto" },
  top: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  h1: { fontSize: 22, fontWeight: 950, color: "rgba(255,255,255,0.92)" },
  sub: { marginTop: 6, color: "rgba(255,255,255,0.65)" },

  actions: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },

  select: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,10,26,0.35)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
  },

  btn: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    textDecoration: "none",
    color: "white",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  btnGhost: {
    padding: "10px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.88)",
    cursor: "pointer",
  },

  state: {
    marginTop: 14,
    borderRadius: 18,
    border: "1px dashed rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
    color: "rgba(255,255,255,0.74)",
  },
  stateErr: { borderColor: "rgba(239,68,68,0.35)", color: "rgba(239,68,68,0.92)" },

  list: { marginTop: 14, display: "grid", gap: 10 },
  row: {
    width: "100%",
    textAlign: "left",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 12,
    cursor: "pointer",
  },
  rowTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  title: { fontWeight: 950, color: "rgba(255,255,255,0.90)" },
  badge: {
    fontSize: 11,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    color: "rgba(255,255,255,0.86)",
    whiteSpace: "nowrap",
  },
  badgeOn: { background: "rgba(34,197,94,0.14)", borderColor: "rgba(34,197,94,0.30)" },
  badgeOff: { background: "rgba(245,158,11,0.14)", borderColor: "rgba(245,158,11,0.30)" },

  meta: { marginTop: 6, color: "rgba(255,255,255,0.60)", display: "flex", gap: 8, flexWrap: "wrap" },
  dot: { color: "rgba(255,255,255,0.35)" },
  excerpt: { marginTop: 8, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 },

  empty: { padding: 14, color: "rgba(255,255,255,0.65)" },
};