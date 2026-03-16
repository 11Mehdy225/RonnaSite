import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return iso || "—";
  }
}

export default function ActualiteDetail() {
useEffect(() => {
  document.title = "RonnaGroup | ActualitéDetails";
}, []);

  const { slug } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/news/slug/${encodeURIComponent(slug)}`);
        const json = await res.json().catch(() => ({}));

        if (!res.ok || json?.ok === false) throw new Error(json?.message || "Erreur de chargement");
        if (!cancelled) setItem(json.item);
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
  }, [slug]);

  const safeHtml = DOMPurify.sanitize(item?.content || "");

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <button type="button" style={styles.back} onClick={() => navigate(-1)}>
          ← Retour
        </button>

        {loading && (
          <div style={styles.card}>
            <div style={styles.h1}>Chargement…</div>
            <div style={styles.p}>Récupération de l’actualité.</div>
          </div>
        )}

        {!loading && err && (
          <div style={styles.card}>
            <div style={styles.h1}>Introuvable</div>
            <div style={styles.p}>{err}</div>
          </div>
        )}

        {!loading && !err && item && (
          <article style={styles.article}>
            <div style={styles.meta}>
              <span style={styles.badge}>{item.category || "Actualité"}</span>
              <span style={styles.date}>{formatDate(item.publishedAt || item.createdAt)}</span>
            </div>

            <h1 style={styles.title}>{item.title}</h1>
            {item.excerpt && <p style={styles.excerpt}>{item.excerpt}</p>}

            {item.coverImage && (
              <div style={styles.coverWrap}>
                <img src={item.coverImage} alt={item.title} style={styles.cover} />
              </div>
            )}

            {/* Contenu long */}
          {/* Contenu long (HTML TipTap) */}
{safeHtml ? (
  <div
  className="rgRich"
    style={styles.rich}
    dangerouslySetInnerHTML={{ __html: safeHtml }}
  />
) : (
  <div style={styles.content}>
    <p style={styles.paragraph}>
      Contenu à venir.
    </p>
  </div>
)}
          </article>
        )}
      </div>
    </main>
  );
}

const styles = {
  rich: {
  marginTop: 16,
  color: "rgba(255,255,255,0.82)",
  lineHeight: 1.85,
  fontSize: 15.5
},

  page: {
    paddingTop: 110,
    paddingBottom: 70,
    background:
      "linear-gradient(180deg, rgba(3,10,26,0.98) 0%, rgba(5,18,45,0.98) 55%, rgba(3,10,26,0.98) 100%)",
    minHeight: "100vh"
  },
  container: { maxWidth: 980, margin: "0 auto", padding: "0 18px" },

  back: {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.90)",
    cursor: "pointer",
    marginBottom: 14
  },

  card: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 16
  },
  h1: { fontWeight: 900, color: "rgba(255,255,255,0.92)", marginBottom: 6 },
  p: { color: "rgba(255,255,255,0.76)", lineHeight: 1.6 },

  article: {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 18
  },
  meta: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 10 },
  badge: {
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(3,10,26,0.70)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.90)",
    fontSize: 12
  },
  date: { color: "rgba(255,255,255,0.66)", fontSize: 12 },

  title: { margin: 0, color: "rgba(255,255,255,0.95)", fontSize: 32, lineHeight: 1.15, fontWeight: 950 },
  excerpt: { margin: "12px 0 0", color: "rgba(255,255,255,0.80)", lineHeight: 1.7, fontSize: 16 },

  coverWrap: { marginTop: 14, borderRadius: 22, overflow: "hidden", border: "1px solid rgba(255,255,255,0.10)" },
  cover: { width: "100%", height: 360, objectFit: "cover", display: "block" },

  content: { marginTop: 16 },
  paragraph: { margin: "0 0 12px", color: "rgba(255,255,255,0.80)", lineHeight: 1.8, fontSize: 15.5 }
};

<style>{`
  .rgRich p { margin: 0 0 12px; }
  .rgRich h2 { margin: 18px 0 10px; font-size: 20px; }
  .rgRich h3 { margin: 16px 0 8px; font-size: 18px; }
  .rgRich ul, .rgRich ol { margin: 0 0 12px 18px; }
  .rgRich li { margin: 6px 0; }
  .rgRich a { color: rgba(120,170,255,0.95); text-decoration: underline; }
  .rgRich img { max-width: 100%; border-radius: 16px; margin: 12px 0; border: 1px solid rgba(255,255,255,0.10); }
  .rgRich blockquote {
    margin: 14px 0;
    padding: 10px 12px;
    border-left: 3px solid rgba(255,255,255,0.22);
    background: rgba(255,255,255,0.03);
    border-radius: 12px;
  }
`}</style>
