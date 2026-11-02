import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "../../lib/adminApi.js";

const LABELS = { CREATE: "Création", UPDATE: "Modification", DELETE: "Suppression", UPLOAD: "Envoi de média", CHANGE_PASSWORD: "Mot de passe modifié" };

export default function AdminActivity() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/activity?limit=100");
      const json = await res.json();
      setItems(json.items || []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div style={styles.wrap}>
      <div style={styles.top}><div><h1 style={styles.h1}>Historique</h1><p style={styles.sub}>Dernières actions effectuées dans l’administration.</p></div><button style={styles.button} onClick={load}>Actualiser</button></div>
      <div style={styles.list}>
        {loading ? <div style={styles.row}>Chargement…</div> : items.map((item) => (
          <div key={item._id} style={styles.row}>
            <div><strong>{LABELS[item.action] || item.action}</strong> · {item.entity}</div>
            <div style={styles.detail}>{item.details?.title || item.details?.filename || item.entityId}</div>
            <div style={styles.meta}>{item.actor} · {new Date(item.createdAt).toLocaleString("fr-FR")}</div>
          </div>
        ))}
        {!loading && !items.length && <div style={styles.row}>Aucune activité enregistrée pour le moment.</div>}
      </div>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 1000, margin: "0 auto" }, top: { display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  h1: { margin: 0, fontSize: 24 }, sub: { color: "rgba(255,255,255,.65)" }, list: { display: "grid", gap: 8, marginTop: 16 },
  row: { padding: 14, borderRadius: 14, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.03)" },
  detail: { marginTop: 5, color: "rgba(255,255,255,.8)" }, meta: { marginTop: 6, fontSize: 12, color: "rgba(255,255,255,.55)" },
  button: { padding: "9px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.05)", color: "white" },
};
