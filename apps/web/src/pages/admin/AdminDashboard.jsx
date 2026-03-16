import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const token = localStorage.getItem("rg_admin_token");

  const [stats, setStats] = useState({ quotes: 0, news: 0, projects: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // On récupère juste des totaux. Si tu n’as pas d’endpoint stats, on fait simple:
        const [q, n, p] = await Promise.all([
          fetch("/api/admin/quotes?limit=1&page=1", { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json()).catch(() => ({})),
          fetch("/api/admin/news?status=ALL&limit=1&page=1", { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json()).catch(() => ({})),
          fetch("/api/admin/projects?status=ALL&limit=1&page=1", { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json()).catch(() => ({})),
        ]);

        if (!cancelled) {
          setStats({
            quotes: q?.total || 0,
            news: n?.total || 0,
            projects: p?.total || 0,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div style={styles.wrap}>
      <div style={styles.h1}>Dashboard</div>
      <div style={styles.sub}>Vue d’ensemble et accès rapide.</div>

      {loading ? (
        <div style={styles.card}>Chargement…</div>
      ) : (
        <div style={styles.grid}>
          <Kpi title="Demandes de devis" value={stats.quotes} to="/admin/quotes" />
          <Kpi title="Actualités" value={stats.news} to="/admin/news" />
          <Kpi title="Réalisations" value={stats.projects} to="/admin/projects" />
        </div>
      )}

      <div style={styles.quick}>
        <Link to="/admin/news/new" style={styles.btn}>+ Nouvelle actu</Link>
        <Link to="/admin/projects/new" style={styles.btnGhost}>+ Nouvelle réalisation</Link>
      </div>
    </div>
  );
}

function Kpi({ title, value, to }) {
  return (
    <Link to={to} style={styles.kpi}>
      <div style={styles.kpiTitle}>{title}</div>
      <div style={styles.kpiValue}>{value}</div>
    </Link>
  );
}

const styles = {
  wrap: { maxWidth: 1100, margin: "0 auto" },
  h1: { fontSize: 22, fontWeight: 950, margin: 0, color: "rgba(255,255,255,0.92)" },
  sub: { marginTop: 6, color: "rgba(255,255,255,0.65)" },

  grid: { marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 },
  card: {
    marginTop: 14,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 14,
    color: "rgba(255,255,255,0.78)"
  },

  kpi: {
    textDecoration: "none",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 14,
    color: "rgba(255,255,255,0.88)",
    display: "grid",
    gap: 6
  },
  kpiTitle: { color: "rgba(255,255,255,0.70)", fontSize: 13 },
  kpiValue: { fontSize: 30, fontWeight: 950 },
  kpiHint: { color: "rgba(120,170,255,0.90)", fontSize: 12 },

  quick: { marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" },
  btn: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "white",
    textDecoration: "none"
  },
  btnGhost: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.88)",
    textDecoration: "none"
  }
};