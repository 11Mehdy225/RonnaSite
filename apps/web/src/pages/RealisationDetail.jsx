import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RealisationDetail() {

  useEffect(() => {
  document.title = "RonnaGroup | RealisationDetails";
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
        const res = await fetch(`/api/projects/slug/${encodeURIComponent(slug)}`);
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.ok === false) throw new Error(json?.message || "Erreur chargement projet");
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

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <button type="button" style={styles.back} onClick={() => navigate(-1)}>
          ← Retour
        </button>

        {loading && <div style={styles.card}>Chargement…</div>}
        {!loading && err && <div style={styles.card}>Introuvable — {err}</div>}

        {!loading && !err && item && (
          <article style={styles.article}>
            <div style={styles.top}>
              <div>
                <div style={styles.kicker}>{item.category || "PROJET"}</div>
                <h1 style={styles.title}>{item.title}</h1>
                {/* {item.subtitle && <div style={styles.subtitle}>{item.subtitle}</div>} */}
                {item.excerpt && <p style={styles.lead}>{item.excerpt}</p>}
              </div>
            </div>

            {item.coverImage && (
              <div style={styles.coverWrap}>
                <img src={item.coverImage} alt={item.title} style={styles.cover} />
              </div>
            )}

            {/* {item.short && <p style={styles.lead}>{item.short}</p>} */}

            {/* CTA */}
            <div style={styles.ctaRow}>
              <ProjectCtas item={item} />
            </div>

            {/* contenu */}
            <div style={styles.content}>
              {item.content
                ? String(item.content)
                    .split("\n")
                    .filter(Boolean)
                    .map((p, i) => (
                      <p key={i} style={styles.p}>
                        {p}
                      </p>
                    ))
                : (
                  <p style={styles.p}>
                    Contenu à compléter dans MongoDB (champ <strong>content</strong>).
                  </p>
                )}
            </div>

            {/* galerie */}
            {Array.isArray(item.gallery) && item.gallery.length > 0 && (
              <div style={styles.galleryGrid}>
                {item.gallery.map((url) => (
                  <img key={url} src={url} alt="" style={styles.galleryImg} loading="lazy" />
                ))}
              </div>
            )}
          </article>
        )}
      </div>
    </main>
  );
}

// function ProjectCtas({ item }) {
//   const navigate = useNavigate();
//   const links = item.links || {};
//   const cta = item.cta || { type: "LINKS" };

//   const btnStyle = (primary) => ({
//     padding: "12px 14px",
//     borderRadius: 999,
//     border: "1px solid rgba(255,255,255,0.12)",
//     background: primary ? "rgba(31,79,216,.95)" : "rgba(255,255,255,0.04)",
//     color: "rgba(255,255,255,0.92)",
//     cursor: "pointer"
//   });

//   if (cta.type === "CONTACT") {
//     const service = cta.service || "RONNA_WEB";
//     const subject = cta.subject || `Demande d’infos — ${item.title}`;
//     const url = `/contact?service=${encodeURIComponent(service)}&subject=${encodeURIComponent(subject)}`;
//     return (
//       <button type="button" style={btnStyle(true)} onClick={() => navigate(url)}>
//         {cta.label || "Nous écrire"}
//       </button>
//     );
//   }

//   return (
//     <>
//       {links.website && (
//         <button type="button" style={btnStyle(true)} onClick={() => window.open(links.website, "_blank", "noopener,noreferrer")}>
//           Visiter
//         </button>
//       )}
//       {links.android && (
//         <button type="button" style={btnStyle(false)} onClick={() => window.open(links.android, "_blank", "noopener,noreferrer")}>
//           Android
//         </button>
//       )}
//       {links.ios && (
//         <button type="button" style={btnStyle(false)} onClick={() => window.open(links.ios, "_blank", "noopener,noreferrer")}>
//           iOS
//         </button>
//       )}
//       {!links.website && !links.android && !links.ios && (
//         <button
//           type="button"
//           style={btnStyle(true)}
//           onClick={() =>
//             navigate(
//               `/contact?service=${encodeURIComponent("RONNA_WEB")}&subject=${encodeURIComponent(`Demande d’infos — ${item.title}`)}`
//             )
//           }
//         >
//           En savoir plus
//         </button>
//       )}
//     </>
//   );
// }

// function ProjectCtas({ item }) {
//   const navigate = useNavigate();

//   const btnStyle = (primary) => ({
//     padding: "12px 14px",
//     borderRadius: 999,
//     border: "1px solid rgba(255,255,255,0.12)",
//     background: primary ? "rgba(31,79,216,.95)" : "rgba(255,255,255,0.04)",
//     color: "rgba(255,255,255,0.92)",
//     cursor: "pointer"
//   });

//   if (item.ctaType === "CONTACT") {
//     const subject = `Demande d’infos — ${item.title}`;
//     const url = `/contact?service=${encodeURIComponent("RONNA_WEB")}&subject=${encodeURIComponent(subject)}`;
//     return (
//       <button type="button" style={btnStyle(true)} onClick={() => navigate(url)}>
//         {item.ctaLabel || "Nous écrire"}
//       </button>
//     );
//   }

//   if (item.ctaType === "LINK" && item.ctaUrl) {
//     return (
//       <button type="button" style={btnStyle(true)} onClick={() => window.open(item.ctaUrl, "_blank", "noopener,noreferrer")}>
//         {item.ctaLabel || "Visiter"}
//       </button>
//     );
//   }

//   return (
//     <button
//       type="button"
//       style={btnStyle(true)}
//       onClick={() =>
//         navigate(
//           `/contact?service=${encodeURIComponent("RONNA_WEB")}&subject=${encodeURIComponent(`Demande d’infos — ${item.title}`)}`
//         )
//       }
//     >
//       En savoir plus
//     </button>
//   );
// }

function ProjectCtas({ item }) {
  const navigate = useNavigate();
  const open = (url) => window.open(url, "_blank", "noopener,noreferrer");

  const btnStyle = (primary) => ({
    padding: "12px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: primary ? "rgba(31,79,216,.95)" : "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer"
  });

  const links = item.links || {};
  const hasWebsite = !!links.website;
  const hasAndroid = !!links.android;
  const hasIos = !!links.ios;

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
                  `Demande d’infos — ${item.title}`
                )}`
              )
          };

  return (
    <>
      <button type="button" style={btnStyle(true)} onClick={() => navigate("/realisations")}>
        ← Retour
      </button>

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
    padding: 16,
    color: "rgba(255,255,255,0.86)"
  },
  article: {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 18
  },
  top: { display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  kicker: { fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", color: "rgba(255,255,255,0.72)", fontWeight: 800 },
  title: { margin: "8px 0 0", color: "rgba(255,255,255,0.95)", fontSize: 32, lineHeight: 1.15, fontWeight: 950 },
  subtitle: { marginTop: 8, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 },

  coverWrap: { marginTop: 14, borderRadius: 22, overflow: "hidden", border: "1px solid rgba(255,255,255,0.10)" },
  cover: { width: "100%", height: 360, objectFit: "cover", display: "block" },

  lead: { margin: "14px 0 0", color: "rgba(255,255,255,0.80)", lineHeight: 1.7, fontSize: 16 },

  ctaRow: { marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" },
  content: { marginTop: 14 },
  p: { margin: "0 0 12px", color: "rgba(255,255,255,0.80)", lineHeight: 1.85, fontSize: 15.5 },

  galleryGrid: { marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 },
  galleryImg: { width: "100%", height: 240, objectFit: "cover", borderRadius: 18, border: "1px solid rgba(255,255,255,0.10)" }
};
