import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO"; 


const CATEGORIES = [
  { value: "TOUT", label: "Tout" },
  { value: "COMMUNIQUE", label: "Communiqués" },
  { value: "PROJET", label: "Projets" },
  { value: "MEDIA", label: "Média" },
  { value: "EVENEMENT", label: "Événements" },
  { value: "FONDATION", label: "Fondation" }
];

function labelFor(cat) {
  const map = {
    COMMUNIQUE: "Communiqué",
    PROJET: "Projet",
    MEDIA: "Média",
    EVENEMENT: "Événement",
    FONDATION: "Fondation"
  };
  return map[cat] || cat || "Actualité";
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return iso || "—";
  }
}

export default function Actualites() {

  useEffect(() => {
  document.title = "RonnaGroup | Actualités";
}, []);

    const navigate = useNavigate();

  const [activeCat, setActiveCat] = useState("TOUT");

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 9;

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("page", String(page));
    if (activeCat && activeCat !== "TOUT") params.set("category", activeCat);
    return params.toString();
  }, [activeCat, page]);

  // Load data
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/news?${query}`);
        const json = await res.json().catch(() => ({}));

        if (!res.ok || json?.ok === false) {
          throw new Error(json?.message || "Erreur lors du chargement des actualités.");
        }

        if (cancelled) return;

        // Si page = 1, on remplace. Sinon on concatène.
        setItems((prev) => (page === 1 ? json.items || [] : [...prev, ...(json.items || [])]));
        setTotalPages(json.totalPages || 1);
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Erreur réseau.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [query, page]);

  // Quand on change de catégorie : reset page + items
  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [activeCat]);

  const canLoadMore = page < totalPages && !loading;

  return (
    <>
         <SEO
  title="Actualite"
  description="informations."
  canonical="https://ronnagroup.com/actualites"
/>
    <main style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.kicker}>Nos actualités</div>
          <h1 style={styles.h1}>Projets, annonces & contenus média</h1>
          <p style={styles.lead}>
            Ici, tu retrouveras les informations importantes de Ronna Group : communiqués, projets, événements et initiatives.
          </p>

          <div style={styles.filters} aria-label="Filtres par catégorie">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setActiveCat(c.value)}
                style={{
                  ...styles.chip,
                  ...(activeCat === c.value ? styles.chipActive : null)
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section style={styles.section}>
        {/* États */}
        {error && (
          <div style={styles.stateCard}>
            <div style={styles.stateTitle}>Impossible de charger les actualités</div>
            <div style={styles.stateText}>{error}</div>
            <button
              type="button"
              style={styles.retryBtn}
              onClick={() => {
                // simple retry
                setPage(1);
              }}
            >
              Réessayer
            </button>
          </div>
        )}

        {!error && loading && items.length === 0 && (
          <div style={styles.stateCard}>
            <div style={styles.stateTitle}>Chargement…</div>
            <div style={styles.stateText}>Récupération des actualités en cours.</div>
          </div>
        )}

        {!error && !loading && items.length === 0 && (
          <div style={styles.stateCard}>
            <div style={styles.stateTitle}>Aucune actualité</div>
            <div style={styles.stateText}>
              Ajoute des documents dans la collection <strong>news</strong> (published=true) pour les afficher ici.
            </div>
          </div>
        )}

        {/* Grille */}
        <div className="rg-newsGrid" style={styles.grid}>
          {items.map((n) => (
            <article key={n._id} style={styles.card} className="rg-newsCard">
              <div style={styles.media}>
                <img
                  src={n.coverImage}
                  alt={n.title}
                  style={styles.img}
                  loading="lazy"
                  onError={(e) => {
                    // fallback simple si URL image cassée
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span style={styles.badge}>{labelFor(n.category)}</span>
              </div>

              <div style={styles.body}>
                <div style={styles.meta}>
                  <span style={styles.date}>{formatDate(n.publishedAt || n.createdAt)}</span>
                </div>

                <h2 style={styles.title}>{n.title}</h2>
                <p style={styles.excerpt}>{n.excerpt}</p>

                <button
                  type="button"
                  style={styles.readMore}
                onClick={() => n.slug && navigate(`/actualites/${n.slug}`)}
                >
                  Lire la suite →
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Load more */}
        {!error && items.length > 0 && (
          <div style={styles.moreWrap}>
            <button
              type="button"
              style={{ ...styles.moreBtn, ...(canLoadMore ? null : styles.moreBtnDisabled) }}
              disabled={!canLoadMore}
              onClick={() => setPage((p) => p + 1)}
            >
              {loading ? "Chargement…" : canLoadMore ? "Charger plus" : "Fin des actualités"}
            </button>
          </div>
        )}

        <style>{css}</style>
      </section>
    </main>
    </>
  );
}

const styles = {
  page: {
    paddingTop: 110,
    paddingBottom: 70,
    background:
      "linear-gradient(180deg, rgba(3,10,26,0.98) 0%, rgba(5,18,45,0.98) 55%, rgba(3,10,26,0.98) 100%)",
    minHeight: "100vh"
  },

  hero: { borderBottom: "1px solid rgba(255,255,255,0.08)" },
  heroInner: { maxWidth: 1200, margin: "0 auto", padding: "36px 18px 28px" },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.72)",
    fontWeight: 800,
    marginBottom: 10
  },
  h1: {
    margin: 0,
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: -0.6,
    color: "rgba(255,255,255,0.95)",
    lineHeight: 1.1
  },
  lead: {
    margin: "12px 0 0",
    maxWidth: 820,
    color: "rgba(255,255,255,0.78)",
    fontSize: 16,
    lineHeight: 1.7
  },

  filters: {
    marginTop: 16,
    display: "flex",
    flexWrap: "wrap",
    gap: 10
  },
  chip: {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.84)",
    cursor: "pointer",
    fontSize: 13
  },
  chipActive: {
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 10px 26px rgba(31,79,216,.18)",
    color: "white"
  },

  section: { maxWidth: 1200, margin: "0 auto", padding: "22px 18px 0" },

  stateCard: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
    marginBottom: 16
  },
  stateTitle: { fontWeight: 900, color: "rgba(255,255,255,0.92)", marginBottom: 6 },
  stateText: { color: "rgba(255,255,255,0.76)", lineHeight: 1.6 },
  retryBtn: {
    marginTop: 12,
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(31,79,216,.20)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer"
  },

  grid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 },

  card: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },

  media: { position: "relative" },
  img: { width: "100%", height: 190, objectFit: "cover", display: "block" },
  badge: {
    position: "absolute",
    left: 12,
    top: 12,
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(3,10,26,0.70)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.90)",
    fontSize: 12,
    letterSpacing: 0.2
  },

  body: { padding: 14, display: "grid", gap: 10 },
  meta: { display: "flex", alignItems: "center", gap: 10 },
  date: { color: "rgba(255,255,255,0.66)", fontSize: 12 },

  title: {
    margin: 0,
    color: "rgba(255,255,255,0.95)",
    fontSize: 18,
    lineHeight: 1.25,
    fontWeight: 900
  },
  excerpt: { margin: 0, color: "rgba(255,255,255,0.78)", fontSize: 14.5, lineHeight: 1.65 },

  readMore: {
    marginTop: 2,
    alignSelf: "flex-start",
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.90)",
    cursor: "pointer",
    fontSize: 13
  },

  moreWrap: { marginTop: 18, display: "flex", justifyContent: "center" },
  moreBtn: {
    padding: "12px 16px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer"
  },
  moreBtnDisabled: { opacity: 0.6, cursor: "not-allowed" }
};

const css = `
@media (hover:hover) {
  .rg-newsCard {
    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
    will-change: transform;
  }
  .rg-newsCard:hover {
    transform: translateY(-4px);
    border-color: rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.05);
    box-shadow: 0 22px 60px rgba(0,0,0,0.28);
  }
  .rg-newsCard:hover button {
    background: rgba(31,79,216,.16);
    border-color: rgba(255,255,255,0.14);
  }
}

@media (max-width: 1024px) {
  .rg-newsGrid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
}
@media (max-width: 700px) {
  .rg-newsGrid { grid-template-columns: 1fr !important; }
}
`;
