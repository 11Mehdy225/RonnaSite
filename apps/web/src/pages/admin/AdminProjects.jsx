// import { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const STATUS_OPTIONS = [
//   { value: "ALL", label: "Tous" },
//   { value: "PUBLISHED", label: "Publiés" },
//   { value: "DRAFT", label: "Brouillons" }
// ];

// function formatDate(iso) {
//   if (!iso) return "—";
//   try {
//     const d = new Date(iso);
//     return d.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" });
//   } catch {
//     return "—";
//   }
// }

// export default function AdminProjects() {
//   const nav = useNavigate();
//   const token = localStorage.getItem("rg_admin_token");

//   const [status, setStatus] = useState("ALL");
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notice, setNotice] = useState(null); // {type:'ok'|'err', text:''}

//   const query = useMemo(() => {
//     const params = new URLSearchParams();
//     params.set("status", status);
//     params.set("limit", "50");
//     params.set("page", "1");
//     return params.toString();
//   }, [status]);

//   const load = async () => {
//     setLoading(true);
//     setNotice(null);
//     try {
//       const res = await fetch(`/api/admin/projects?${query}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const json = await res.json().catch(() => ({}));

//       if (!res.ok || json?.ok === false) {
//         setNotice({ type: "err", text: json?.message || "Impossible de charger les réalisations." });
//         setItems([]);
//         return;
//       }

//       setItems(Array.isArray(json.items) ? json.items : []);
//     } catch (e) {
//         console.log(e)
//       setNotice({ type: "err", text: "Erreur réseau. Vérifie que l’API tourne (localhost:4000)." });
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [query]);

//   const onDelete = async (id) => {
//     const ok = window.confirm("Supprimer cette réalisation ? (Action irréversible)");
//     if (!ok) return;

//     setNotice(null);
//     try {
//       const res = await fetch(`/api/admin/projects/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const json = await res.json().catch(() => ({}));
//       if (!res.ok || json?.ok === false) {
//         setNotice({ type: "err", text: json?.message || "Suppression impossible." });
//         return;
//       }
//       setNotice({ type: "ok", text: "Supprimé." });
//       await load();
//     } catch {
//       setNotice({ type: "err", text: "Erreur réseau pendant la suppression." });
//     }
//   };

//   return (
//     <div style={styles.wrap}>
//       <div style={styles.top}>
//         <div>
//           <h1 style={styles.h1}>Réalisations</h1>
//           <div style={styles.sub}>Gérer les projets affichés dans “Nos réalisations”.</div>
//         </div>

//         <div style={styles.actions}>
//           <button type="button" style={styles.btnGhost} onClick={() => nav("/realisations")}>
//             Voir page publique
//           </button>
//           <Link to="/admin/projects/new" style={styles.btn}>
//             + Nouvelle réalisation
//           </Link>
//         </div>
//       </div>

//       <div style={styles.toolbar}>
//         <div style={styles.filter}>
//           <div style={styles.label}>Statut</div>
//           <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
//             {STATUS_OPTIONS.map((o) => (
//               <option key={o.value} value={o.value}>
//                 {o.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button type="button" style={styles.btnGhost} onClick={load} disabled={loading}>
//           {loading ? "Chargement…" : "Rafraîchir"}
//         </button>
//       </div>

//       {notice && (
//         <div style={{ ...styles.notice, ...(notice.type === "ok" ? styles.noticeOk : styles.noticeErr) }}>
//           {notice.text}
//         </div>
//       )}

//       <div style={styles.card}>
//         {loading ? (
//           <div style={styles.empty}>Chargement des réalisations…</div>
//         ) : items.length === 0 ? (
//           <div style={styles.empty}>Aucune réalisation pour ce filtre.</div>
//         ) : (
//           <div style={styles.tableWrap}>
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th style={styles.th}>Titre</th>
//                   <th style={styles.th}>Slug</th>
//                   <th style={styles.th}>Statut</th>
//                   <th style={styles.th}>Date</th>
//                   <th style={{ ...styles.th, width: 210 }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.map((p) => (
//                   <tr key={p._id} style={styles.tr}>
//                     <td style={styles.td}>
//                       <div style={styles.titleCell}>
//                         {p.coverImage ? (
//                           <img src={p.coverImage} alt="" style={styles.thumb} />
//                         ) : (
//                           <div style={styles.thumbPlaceholder} />
//                         )}
//                         <div style={{ minWidth: 0 }}>
//                           <div style={styles.title}>{p.title}</div>
//                           <div style={styles.excerpt}>{p.excerpt || "—"}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td style={styles.tdMono}>{p.slug || "—"}</td>
//                     <td style={styles.td}>
//                       <span style={{ ...styles.badge, ...(p.published ? styles.badgeOn : styles.badgeOff) }}>
//                         {p.published ? "Publié" : "Brouillon"}
//                       </span>
//                     </td>
//                     <td style={styles.td}>
//                       {formatDate(p.publishedAt || p.updatedAt || p.createdAt)}
//                     </td>
//                     <td style={styles.td}>
//                       <div style={styles.rowActions}>
//                         <Link to={`/admin/projects/${p._id}/edit`} style={styles.linkBtn}>
//                           Modifier
//                         </Link>
//                         <button type="button" style={styles.linkDanger} onClick={() => onDelete(p._id)}>
//                           Supprimer
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <div style={styles.small}>
//         Astuce : publie uniquement quand c’est prêt — le site public n’affiche que <strong>published=true</strong>.
//       </div>
//     </div>
//   );
// }

// const styles = {
//   wrap: { maxWidth: 1100, margin: "0 auto" },
//   top: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" },
//   h1: { margin: 0, fontSize: 22, fontWeight: 950, color: "rgba(255,255,255,0.92)" },
//   sub: { marginTop: 6, color: "rgba(255,255,255,0.65)" },

//   actions: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },

//   toolbar: {
//     marginTop: 14,
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//     gap: 12,
//     flexWrap: "wrap"
//   },
//   filter: { display: "grid", gap: 6 },
//   label: { fontSize: 12, color: "rgba(255,255,255,0.65)" },
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
//     color: "white",
//     textDecoration: "none"
//   },
//   btnGhost: {
//     padding: "10px 14px",
//     borderRadius: 999,
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.12)",
//     color: "rgba(255,255,255,0.88)",
//     cursor: "pointer",
//     textDecoration: "none"
//   },

//   notice: {
//     marginTop: 12,
//     borderRadius: 16,
//     padding: "12px 12px",
//     border: "1px solid rgba(255,255,255,0.12)"
//   },
//   noticeOk: { background: "rgba(34,197,94,0.10)", color: "rgba(255,255,255,0.92)" },
//   noticeErr: { background: "rgba(239,68,68,0.10)", color: "rgba(255,255,255,0.92)" },

//   card: {
//     marginTop: 12,
//     borderRadius: 20,
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "rgba(255,255,255,0.03)",
//     padding: 12
//   },

//   tableWrap: { overflowX: "auto" },
//   table: { width: "100%", borderCollapse: "separate", borderSpacing: 0 },
//   th: {
//     textAlign: "left",
//     padding: "10px 10px",
//     fontSize: 12,
//     color: "rgba(255,255,255,0.65)",
//     borderBottom: "1px solid rgba(255,255,255,0.10)"
//   },
//   tr: { borderBottom: "1px solid rgba(255,255,255,0.06)" },
//   td: { padding: "12px 10px", verticalAlign: "top", color: "rgba(255,255,255,0.86)" },
//   tdMono: { padding: "12px 10px", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: "rgba(255,255,255,0.78)" },

//   titleCell: { display: "flex", gap: 10, alignItems: "center", minWidth: 240 },
//   thumb: { width: 44, height: 44, borderRadius: 12, objectFit: "cover", border: "1px solid rgba(255,255,255,0.10)" },
//   thumbPlaceholder: { width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" },

//   title: { fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 380 },
//   excerpt: { fontSize: 12, color: "rgba(255,255,255,0.60)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 380 },

//   badge: { padding: "6px 10px", borderRadius: 999, fontSize: 12, border: "1px solid rgba(255,255,255,0.10)" },
//   badgeOn: { background: "rgba(34,197,94,0.10)" },
//   badgeOff: { background: "rgba(255,255,255,0.06)" },

//   rowActions: { display: "flex", gap: 8, flexWrap: "wrap" },
//   linkBtn: {
//     padding: "8px 10px",
//     borderRadius: 12,
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.12)",
//     color: "rgba(255,255,255,0.88)",
//     textDecoration: "none"
//   },
//   linkDanger: {
//     padding: "8px 10px",
//     borderRadius: 12,
//     background: "rgba(239,68,68,0.10)",
//     border: "1px solid rgba(239,68,68,0.22)",
//     color: "rgba(255,255,255,0.92)",
//     cursor: "pointer"
//   },

//   empty: { padding: 14, color: "rgba(255,255,255,0.70)" },
//   small: { marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.60)" }
// };


import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tous" },
  { value: "PUBLISHED", label: "Publiés" },
  { value: "DRAFT", label: "Brouillons" },
];

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return "—";
  }
}

async function readJson(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export default function AdminProjects() {
  const nav = useNavigate();

  const [status, setStatus] = useState("ALL");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null); // {type:'ok'|'err', text:''}

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("status", status);
    params.set("limit", "50");
    params.set("page", "1");
    return params.toString();
  }, [status]);

  // helper API admin (cookie httpOnly)
const api = useCallback(
  async (url, options = {}) => {
    const method = String(options.method || "GET").toUpperCase();
    const csrfNeeded = !["GET", "HEAD", "OPTIONS"].includes(method);

    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
        ...(csrfNeeded ? { "X-Requested-With": "rg-admin" } : null),
        ...(options.body ? { "Content-Type": "application/json" } : null),
      },
    });

    if (res.status === 401) {
      nav("/admin/login", { replace: true });
      throw new Error("UNAUTHORIZED");
    }

    const json = await readJson(res);
    if (!res.ok || json?.ok === false) {
      throw new Error(json?.message || `HTTP ${res.status}`);
    }

    return json;
  },
  [nav]
);

  const load = useCallback(async () => {
    setLoading(true);
    setNotice(null);

    try {
      const json = await api(`/api/admin/projects?${query}`);
      setItems(Array.isArray(json.items) ? json.items : []);
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") return;
      console.error(e);
      setNotice({ type: "err", text: e?.message || "Impossible de charger les réalisations." });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [api, query]);

  useEffect(() => {
    load();
  }, [load]);

  const onDelete = async (id) => {
    const ok = window.confirm("Supprimer cette réalisation ? (Action irréversible)");
    if (!ok) return;

    setNotice(null);
    try {
      await api(`/api/admin/projects/${id}`, { method: "DELETE" });
      setNotice({ type: "ok", text: "Supprimé." });
      await load();
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") return;
      console.error(e);
      setNotice({ type: "err", text: e?.message || "Suppression impossible." });
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.top}>
        <div>
          <h1 style={styles.h1}>Réalisations</h1>
          <div style={styles.sub}>Gérer les projets affichés dans “Nos réalisations”.</div>
        </div>

        <div style={styles.actions}>
          <button type="button" style={styles.btnGhost} onClick={() => nav("/realisations")}>
            Voir page publique
          </button>
          <Link to="/admin/projects/new" style={styles.btn}>
            + Nouvelle réalisation
          </Link>
        </div>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.filter}>
          <div style={styles.label}>Statut</div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <button type="button" style={styles.btnGhost} onClick={load} disabled={loading}>
          {loading ? "Chargement…" : "Rafraîchir"}
        </button>
      </div>

      {notice && (
        <div style={{ ...styles.notice, ...(notice.type === "ok" ? styles.noticeOk : styles.noticeErr) }}>
          {notice.text}
        </div>
      )}

      <div style={styles.card}>
        {loading ? (
          <div style={styles.empty}>Chargement des réalisations…</div>
        ) : items.length === 0 ? (
          <div style={styles.empty}>Aucune réalisation pour ce filtre.</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Titre</th>
                  <th style={styles.th}>Slug</th>
                  <th style={styles.th}>Statut</th>
                  <th style={styles.th}>Date</th>
                  <th style={{ ...styles.th, width: 210 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p._id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.titleCell}>
                        {p.coverImage ? (
                          <img src={p.coverImage} alt="" style={styles.thumb} />
                        ) : (
                          <div style={styles.thumbPlaceholder} />
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div style={styles.title}>{p.title || "—"}</div>
                          <div style={styles.excerpt}>{p.excerpt || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.tdMono}>{p.slug || "—"}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...(p.published ? styles.badgeOn : styles.badgeOff) }}>
                        {p.published ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td style={styles.td}>{formatDate(p.publishedAt || p.updatedAt || p.createdAt)}</td>
                    <td style={styles.td}>
                      <div style={styles.rowActions}>
                        <Link to={`/admin/projects/${p._id}/edit`} style={styles.linkBtn}>
                          Modifier
                        </Link>
                        <button type="button" style={styles.linkDanger} onClick={() => onDelete(p._id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={styles.small}>
        Astuce : publie uniquement quand c’est prêt — le site public n’affiche que <strong>published=true</strong>.
      </div>
    </div>
  );
}

// styles inchangés (tu peux garder les tiens)
const styles = {
  wrap: { maxWidth: 1100, margin: "0 auto" },
  top: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" },
  h1: { margin: 0, fontSize: 22, fontWeight: 950, color: "rgba(255,255,255,0.92)" },
  sub: { marginTop: 6, color: "rgba(255,255,255,0.65)" },

  actions: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },

  toolbar: {
    marginTop: 14,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
    flexWrap: "wrap",
  },
  filter: { display: "grid", gap: 6 },
  label: { fontSize: 12, color: "rgba(255,255,255,0.65)" },
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
    color: "white",
    textDecoration: "none",
  },
  btnGhost: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.88)",
    cursor: "pointer",
    textDecoration: "none",
  },

  notice: {
    marginTop: 12,
    borderRadius: 16,
    padding: "12px 12px",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  noticeOk: { background: "rgba(34,197,94,0.10)", color: "rgba(255,255,255,0.92)" },
  noticeErr: { background: "rgba(239,68,68,0.10)", color: "rgba(255,255,255,0.92)" },

  card: {
    marginTop: 12,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 12,
  },

  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0 },
  th: {
    textAlign: "left",
    padding: "10px 10px",
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
  },
  tr: { borderBottom: "1px solid rgba(255,255,255,0.06)" },
  td: { padding: "12px 10px", verticalAlign: "top", color: "rgba(255,255,255,0.86)" },
  tdMono: { padding: "12px 10px", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: "rgba(255,255,255,0.78)" },

  titleCell: { display: "flex", gap: 10, alignItems: "center", minWidth: 240 },
  thumb: { width: 44, height: 44, borderRadius: 12, objectFit: "cover", border: "1px solid rgba(255,255,255,0.10)" },
  thumbPlaceholder: { width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" },

  title: { fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 380 },
  excerpt: { fontSize: 12, color: "rgba(255,255,255,0.60)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 380 },

  badge: { padding: "6px 10px", borderRadius: 999, fontSize: 12, border: "1px solid rgba(255,255,255,0.10)" },
  badgeOn: { background: "rgba(34,197,94,0.10)" },
  badgeOff: { background: "rgba(255,255,255,0.06)" },

  rowActions: { display: "flex", gap: 8, flexWrap: "wrap" },
  linkBtn: {
    padding: "8px 10px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.88)",
    textDecoration: "none",
  },
  linkDanger: {
    padding: "8px 10px",
    borderRadius: 12,
    background: "rgba(239,68,68,0.10)",
    border: "1px solid rgba(239,68,68,0.22)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
  },

  empty: { padding: 14, color: "rgba(255,255,255,0.70)" },
  small: { marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.60)" },
};