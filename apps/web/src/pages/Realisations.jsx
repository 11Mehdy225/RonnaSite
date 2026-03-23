import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO"; 
import { apiUrl } from "../lib/api.js";

const CATEGORIES = [
  { value: "TOUT", label: "Tout" },
  { value: "WEB", label: "Web" },
  { value: "MOBILE", label: "Mobile" },
  { value: "SECURITE", label: "Sécurité" },
  { value: "DIGITAL", label: "Digital" },
  { value: "MEDIA", label: "Média" },
  { value: "AUTRE", label: "Autre" },
];

export default function Realisations() {

  useEffect(() => {
  document.title = "RonnaGroup | Realisations";
}, []);

  const navigate = useNavigate();

  const [activeCat, setActiveCat] = useState("TOUT");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const limit = 9;

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("page", String(page));
    if (activeCat !== "TOUT") params.set("category", activeCat);
    return params.toString();
  }, [activeCat, page]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(apiUrl(`/api/projects?${query}`));
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.ok === false)
          throw new Error(json?.message || "Erreur chargement projets");

        if (cancelled) return;
        setItems((prev) =>
          page === 1 ? json.items || [] : [...prev, ...(json.items || [])],
        );
        setTotalPages(json.totalPages || 1);
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Erreur réseau");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [query, page]);

  // reset quand change catégorie
  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [activeCat]);

  const canLoadMore = page < totalPages && !loading;
  // const goDetail = (p) => {
  //   if (!p?.slug) return;
  //   navigate(`/realisations/${p.slug}`);
  // };

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
     <SEO
  title="Realisations"
  description="Nos realisations , projets ."
  canonical="https://ronnagroup.com/realisations"
/>
    <main style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.kicker}>Nos réalisations</div>
          <h1 style={styles.h1}>Applications, plateformes & solutions</h1>
          <p style={styles.lead}>
            Découvrez nos produits et projets : utilité, contexte, accès et
            possibilités de démo.
          </p>

          <div style={styles.filters}>
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setActiveCat(c.value)}
                style={{
                  ...styles.chip,
                  ...(activeCat === c.value ? styles.chipActive : null),
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section style={styles.section}>
        {err && (
          <div style={styles.stateCard}>
            <div style={styles.stateTitle}>
              Impossible de charger les réalisations
            </div>
            <div style={styles.stateText}>{err}</div>
          </div>
        )}

        {!err && loading && items.length === 0 && (
          <div style={styles.stateCard}>
            <div style={styles.stateTitle}>Chargement…</div>
            <div style={styles.stateText}>
              Récupération des projets en cours.
            </div>
          </div>
        )}

        {!err && !loading && items.length === 0 && (
          <div style={styles.stateCard}>
            <div style={styles.stateTitle}>Aucune réalisation</div>
            <div style={styles.stateText}>
              Ajoute des documents dans <strong>projects</strong>{" "}
              (published=true) pour les afficher ici.
            </div>
          </div>
        )}

        <div className="rg-projGrid" style={styles.grid}>
          {items.map((p) => (
            <article
              key={p._id}
              className="rg-projCard"
              style={styles.card}
              onClick={() => p.slug && navigate(`/realisations/${p.slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && p.slug)
                  navigate(`/realisations/${p.slug}`);
              }}
            >
              <div style={styles.media}>
                {p.coverImage ? (
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    style={styles.img}
                    loading="lazy"
                  />
                ) : (
                  <div style={styles.imgFallback} />
                )}
                <span style={styles.badge}>{p.category || "PROJET"}</span>
              </div>

              <div style={styles.body}>
                <h2 style={styles.title}>{p.title}</h2>
                {/* CTA row (on stoppe la propagation pour éviter d’ouvrir le détail) */}
                {p.excerpt && <p style={styles.short}>{p.excerpt}</p>}

                {/* Actions */}
                <div style={styles.ctaRow} onClick={stop}>
                  {/* Bouton 1 : Voir le détail (toujours) */}
                  {/* <button
                    type="button"
                    style={{ ...styles.btn, ...styles.btnPrimary }}
                    onClick={() => goDetail(p)}
                  >
                    Voir le détail
                  </button> */}

                  {/* Bouton 2 : Liens / Nous écrire selon le projet */}
                  <Ctas project={p} />
                </div>
              </div>
            </article>
          ))}
        </div>

        {!err && items.length > 0 && (
          <div style={styles.moreWrap}>
            <button
              type="button"
              style={{
                ...styles.moreBtn,
                ...(canLoadMore ? null : styles.moreBtnDisabled),
              }}
              disabled={!canLoadMore}
              onClick={() => setPage((x) => x + 1)}
            >
              {loading ? "Chargement…" : canLoadMore ? "Charger plus" : "Fin"}
            </button>
          </div>
        )}

        <style>{css}</style>
      </section>
    </main>
    </>
  );
}

// function Ctas({ project }) {
//   const navigate = useNavigate();
//   const links = project.links || {};
//   const cta = project.cta || { type: "LINKS" };

//   const btn = (label, onClick, variant = "ghost") => (
//     <button
//       type="button"
//       style={{ ...styles.btn, ...(variant === "primary" ? styles.btnPrimary : styles.btnGhost) }}
//       onClick={onClick}
//     >
//       {label}
//     </button>
//   );

//   if (cta.type === "CONTACT") {
//     const service = cta.service || "RONNA_WEB";
//     const subject = cta.subject || `Demande d'infos — ${project.title}`;
//     const url = `/contact?service=${encodeURIComponent(service)}&subject=${encodeURIComponent(subject)}`;
//     return btn(cta.label || "Nous écrire", () => navigate(url), "primary");
//   }

//   // LINKS
//   const actions = [];
//   if (links.website) actions.push(btn("Visiter", () => window.open(links.website, "_blank", "noopener,noreferrer")));
//   if (links.android) actions.push(btn("Android", () => window.open(links.android, "_blank", "noopener,noreferrer")));
//   if (links.ios) actions.push(btn("iOS", () => window.open(links.ios, "_blank", "noopener,noreferrer")));

//   if (actions.length === 0) {
//     const url = `/contact?service=${encodeURIComponent("RONNA_WEB")}&subject=${encodeURIComponent(
//       `Demande d’infos — ${project.title}`
//     )}`;
//     actions.push(btn("En savoir plus", () => navigate(url), "primary"));
//   }

//   return <>{actions.slice(0, 3)}</>;
// }

function Ctas({ project }) {
  const navigate = useNavigate();

  const btnStyle = (primary) => ({
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: primary ? "rgba(31,79,216,.95)" : "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    fontSize: 13
  });

  const open = (url) => window.open(url, "_blank", "noopener,noreferrer");

  const links = project.links || {}; // { website, android, ios }
  const hasWebsite = !!links.website;
  const hasAndroid = !!links.android;
  const hasIos = !!links.ios;

  // SECOND CTA = priorité : website > android > ios > fallback contact
  const secondary = hasWebsite
    ? { label: "Visiter", action: () => open(links.website) }
    : hasAndroid
      ? { label: "Android", action: () => open(links.android) }
      : hasIos
        ? { label: "iOS", action: () => open(links.ios) }
        : {
            label: "Nous écrire",
            action: () =>
              navigate(
                `/contact?service=${encodeURIComponent("RONNA_WEB")}&subject=${encodeURIComponent(
                  `Demande d’infos — ${project.title}`
                )}`
              )
          };

  return (
    <>
      {/* Bouton 1 : Voir le détail (toujours) */}
      <button
        type="button"
        style={btnStyle(true)}
        onClick={() => project.slug && navigate(`/realisations/${project.slug}`)}
      >
        Voir le détail
      </button>

      {/* Bouton 2 : conditionnel */}
      <button type="button" style={btnStyle(false)} onClick={secondary.action}>
        {secondary.label}
      </button>
    </>
  );
}

const styles = {
  page: {
    paddingTop: 110,
    paddingBottom: 70,
    background:
      "linear-gradient(180deg, rgba(3,10,26,0.98) 0%, rgba(5,18,45,0.98) 55%, rgba(3,10,26,0.98) 100%)",
    minHeight: "100vh",
  },

  hero: { borderBottom: "1px solid rgba(255,255,255,0.08)" },
  heroInner: { maxWidth: 1200, margin: "0 auto", padding: "36px 18px 28px" },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.72)",
    fontWeight: 800,
    marginBottom: 10,
  },
  h1: {
    margin: 0,
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: -0.6,
    color: "rgba(255,255,255,0.95)",
  },
  lead: {
    margin: "12px 0 0",
    maxWidth: 820,
    color: "rgba(255,255,255,0.78)",
    fontSize: 16,
    lineHeight: 1.7,
  },

  filters: { marginTop: 16, display: "flex", flexWrap: "wrap", gap: 10 },
  chip: {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.84)",
    cursor: "pointer",
    fontSize: 13,
  },
  chipActive: {
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 10px 26px rgba(31,79,216,.18)",
    color: "white",
  },

  section: { maxWidth: 1200, margin: "0 auto", padding: "22px 18px 0" },

  stateCard: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
    marginBottom: 16,
  },
  stateTitle: {
    fontWeight: 900,
    color: "rgba(255,255,255,0.92)",
    marginBottom: 6,
  },
  stateText: { color: "rgba(255,255,255,0.76)", lineHeight: 1.6 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
  },

  card: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  },

  media: { position: "relative" },
  img: { width: "100%", height: 190, objectFit: "cover", display: "block" },
  imgFallback: {
    width: "100%",
    height: 190,
    background: "rgba(255,255,255,0.04)",
  },
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
  },

  body: { padding: 14, display: "grid", gap: 10 },
  title: {
    margin: 0,
    color: "rgba(255,255,255,0.95)",
    fontSize: 18,
    lineHeight: 1.2,
    fontWeight: 950,
  },
  subtitle: { color: "rgba(255,255,255,0.78)", fontSize: 13.5 },
  short: {
    margin: 0,
    color: "rgba(255,255,255,0.74)",
    fontSize: 14.5,
    lineHeight: 1.65,
  },

  tags: { display: "flex", gap: 8, flexWrap: "wrap" },
  tag: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.84)",
    fontSize: 12,
  },

  ctaRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 2 },

  btn: {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    cursor: "pointer",
    fontSize: 13,
  },
  btnGhost: {
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.90)",
  },
  btnPrimary: {
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 10px 26px rgba(31,79,216,.18)",
    color: "white",
  },

  moreWrap: { marginTop: 18, display: "flex", justifyContent: "center" },
  moreBtn: {
    padding: "12px 16px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
  },
  moreBtnDisabled: { opacity: 0.6, cursor: "not-allowed" },
};

const css = `
@media (hover:hover) {
  .rg-projCard {
    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
    will-change: transform;
  }
  .rg-projCard:hover {
    transform: translateY(-4px);
    border-color: rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.05);
    box-shadow: 0 22px 60px rgba(0,0,0,0.28);
  }
}

@media (max-width: 1024px) {
  .rg-projGrid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
}
@media (max-width: 700px) {
  .rg-projGrid { grid-template-columns: 1fr !important; }
}
`;
