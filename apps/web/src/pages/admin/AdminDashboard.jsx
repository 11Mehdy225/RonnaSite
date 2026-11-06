import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ quotes: 0, news: 0, projects: 0, foundation: 0 });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [campaignCount, setCampaignCount] = useState(0);
  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // On récupère juste des totaux. Si tu n’as pas d’endpoint stats, on fait simple:
        const [q, n, p, f, a, systemStatus] = await Promise.all([
          fetch("/api/admin/quotes?limit=5&page=1", { credentials: "include" })
            .then(r => r.json()).catch(() => ({})),
          fetch("/api/admin/news?status=ALL&limit=1&page=1", { credentials: "include" })
            .then(r => r.json()).catch(() => ({})),
          fetch("/api/admin/projects?status=ALL&limit=1&page=1", { credentials: "include" })
            .then(r => r.json()).catch(() => ({})),
          fetch("/api/admin/foundation/actions?status=ALL&limit=1&page=1", { credentials: "include" })
            .then(r => r.json()).catch(() => ({})),
          fetch("/api/admin/analytics", { credentials: "include" })
            .then(r => r.json()).catch(() => ({})),
          fetch("/api/admin/system-status", { credentials: "include" })
            .then(r => r.json()).catch(() => ({ ok: false })),
        ]);

        if (!cancelled) {
          setStats({
            quotes: q?.total || 0,
            news: n?.total || 0,
            projects: p?.total || 0,
            foundation: f?.total || 0,
          });
          setRecentQuotes(q?.items || []);
          setAnalytics(Object.fromEntries((a?.byEvent || []).map((item) => [item._id, item.count])));
          setCampaignCount((a?.byCampaign || []).filter((item) => item._id?.name && item._id.name !== "not_set").length);
          setSystem(systemStatus);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

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
          <Kpi title="Fondation" value={stats.foundation} to="/admin/foundation" />
          <Kpi title="Pages vues (30 j)" value={analytics.page_view || 0} to="/admin/activity" />
          <Kpi title="Demandes envoyées (30 j)" value={analytics.quote_submitted || 0} to="/admin/quotes" />
          <Kpi title="Résultats d’outils (30 j)" value={analytics.tool_completed || 0} to="/admin/analytics" />
          <Kpi title="Campagnes détectées" value={campaignCount} to="/admin/analytics" />
        </div>
      )}

      <div style={styles.quick}>
        <Link to="/admin/news/new" style={styles.btn}>+ Nouvelle actu</Link>
        <Link to="/admin/projects/new" style={styles.btnGhost}>+ Nouvelle réalisation</Link>
        <Link to="/admin/foundation/new" style={styles.btnGhost}>+ Nouvelle action</Link>
        <Link to="/admin/media" style={styles.btnGhost}>Médiathèque</Link>
        <Link to="/admin/analytics" style={styles.btnGhost}>Mesure des campagnes</Link>
        <a href="/api/admin/backup" style={styles.btnGhost}>Télécharger une sauvegarde</a>
      </div>

      <div style={styles.system}>
        <strong>État des services</strong>
        <span>Base de données : {system?.database === "connected" ? `connectée (${system.databaseLatencyMs} ms)` : "indisponible"}</span>
        <span>Email : {system?.emailConfigured ? "configuré" : "à vérifier"}</span>
        <span>Surveillance publique : <code>/api/health</code></span>
      </div>

      <section style={styles.recent}>
        <h2 style={styles.h2}>Demandes récentes</h2>
        {recentQuotes.length ? recentQuotes.map((quote) => (
          <Link key={quote._id} to="/admin/quotes" style={styles.quote}>
            <strong>{quote.fullName || "Sans nom"}</strong>
            <span>{quote.subject || quote.service || "Demande de devis"}</span>
            <small>{quote.status || "NEW"} · {quote.createdAt ? new Date(quote.createdAt).toLocaleString("fr-FR") : ""}</small>
          </Link>
        )) : <div style={styles.card}>Aucune demande récente.</div>}
      </section>
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

  grid: { marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 10 },
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
  recent: { marginTop: 28 },
  h2: { fontSize: 18, marginBottom: 10 },
  quote: { display: "grid", gap: 4, padding: 12, marginBottom: 8, borderRadius: 14, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.03)" },
  system: { marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap", padding: 13, borderRadius: 14, border: "1px solid rgba(34,197,94,.2)", background: "rgba(34,197,94,.06)", color: "rgba(255,255,255,.75)" },
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
