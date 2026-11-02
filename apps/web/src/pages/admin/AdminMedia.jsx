import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "../../lib/adminApi.js";

function formatSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

export default function AdminMedia() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setNotice("");
    try {
      const res = await adminFetch("/api/admin/media?limit=200");
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Chargement impossible");
      setItems(json.items || []);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (item) => {
    if (item.referenced) return;
    if (!window.confirm(`Supprimer définitivement « ${item.filename} » ?`)) return;
    try {
      const res = await adminFetch(`/api/admin/media/${item._id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Suppression impossible");
      setItems((current) => current.filter((media) => media._id !== item._id));
    } catch (error) {
      setNotice(error.message);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.top}>
        <div><h1 style={styles.h1}>Médiathèque</h1><p style={styles.sub}>Images envoyées depuis l’administration.</p></div>
        <button type="button" onClick={load} style={styles.button}>Actualiser</button>
      </div>
      {notice && <div style={styles.notice}>{notice}</div>}
      {loading ? <div style={styles.card}>Chargement…</div> : (
        <div style={styles.grid}>
          {items.map((item) => (
            <article key={item._id} style={styles.card}>
              <img src={item.url} alt={item.filename} style={styles.image} loading="lazy" />
              <strong style={styles.name}>{item.filename}</strong>
              <span style={styles.meta}>{formatSize(item.size)} · {item.referenced ? "Utilisée" : "Non utilisée"}</span>
              <div style={styles.actions}>
                <a href={item.url} target="_blank" rel="noreferrer" style={styles.button}>Voir</a>
                <button type="button" onClick={() => remove(item)} disabled={item.referenced} style={styles.danger}>
                  {item.referenced ? "Protégée" : "Supprimer"}
                </button>
              </div>
            </article>
          ))}
          {!items.length && <div style={styles.card}>Aucun média enregistré.</div>}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 1100, margin: "0 auto" },
  top: { display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12, flexWrap: "wrap" },
  h1: { margin: 0, fontSize: 24 }, sub: { color: "rgba(255,255,255,.65)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginTop: 16 },
  card: { border: "1px solid rgba(255,255,255,.1)", borderRadius: 18, padding: 12, background: "rgba(255,255,255,.03)", display: "grid", gap: 9 },
  image: { width: "100%", height: 160, objectFit: "cover", borderRadius: 12, background: "#071127" },
  name: { overflowWrap: "anywhere" }, meta: { color: "rgba(255,255,255,.62)", fontSize: 13 },
  actions: { display: "flex", gap: 8, flexWrap: "wrap" },
  button: { padding: "9px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.05)", color: "white", cursor: "pointer" },
  danger: { padding: "9px 12px", borderRadius: 999, border: "1px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.12)", color: "white", cursor: "pointer" },
  notice: { marginTop: 12, padding: 12, borderRadius: 12, background: "rgba(239,68,68,.12)" },
};
