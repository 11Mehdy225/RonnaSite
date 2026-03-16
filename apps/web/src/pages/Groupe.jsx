import { useEffect, useMemo, useState } from "react";
import p1 from "../assets/groupe/fondateur-1..jpg";
import p2 from "../assets/groupe/fondateur-2.jpg";
import p3 from "../assets/groupe/fondateur-3.jpg";
import badgePmp from "../assets/badges/pmp.png";
import badgePspo from "../assets/badges/pspo.png";


export default function Groupe() {
  const photos = useMemo(() => [p1, p2, p3], []);
  const [index, setIndex] = useState(0);

 useEffect(() => {
  document.title = "RonnaGroup | Group";
}, []);

  // Auto-slide toutes les 4s
  useEffect(() => {
    if (!photos.length) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 4000);
    return () => clearInterval(t);
  }, [photos.length]);

  const goPrev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);
  const goNext = () => setIndex((i) => (i + 1) % photos.length);

  return (
    <>
    <main style={styles.page}>
      <section className="rg-twoCol" style={styles.container}>
        {/* Colonne gauche */}
        <div className="rg-left" style={styles.left}>
          {/* Slider */}
          <div style={styles.slider} aria-label="Galerie du fondateur">
            <div style={styles.sliderTop}>
              <span style={styles.sliderLabel}>Le Fondateur</span>

              <div style={styles.controls}>
                <button type="button" onClick={goPrev} style={styles.ctrlBtn} aria-label="Photo précédente">
                  ‹
                </button>
                <button type="button" onClick={goNext} style={styles.ctrlBtn} aria-label="Photo suivante">
                  ›
                </button>
              </div>
            </div>

            <div style={styles.photoFrame}>
              <img
                src={photos[index]}
                alt={`Photo du fondateur ${index + 1}`}
                style={styles.photo}
                loading="eager"
              />

              {/* Dots */}
              <div style={styles.dots} aria-label="Indicateurs de photos">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    style={{
                      ...styles.dot,
                      ...(i === index ? styles.dotActive : null),
                    }}
                    aria-label={`Aller à la photo ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Légende */}
          <div style={styles.legend}>
            <h2 style={styles.name}>
              KONAN N’DASSENAN Loïc Harold Mehdy
            </h2>

            <p style={styles.title}>
              <em>Fondateur & Directeur Général – RONNA GROUP</em>
            </p>

            <div style={styles.metaBlock}>
              <ul style={styles.distinctions}>
                <li>
                  <strong>Développeur Web & Mobile , DevOps , Designer web  </strong>
                </li>
                <li>
                  <i>Chef de projet certifié <strong>PMP® (PMI)</strong> || Agile Product Owner certifié <strong>PSPO I</strong></i>
                </li>
              </ul>
            </div>

            <div style={styles.badgesWrap}>
              <img src={badgePmp} alt="Badge PMP" style={styles.badge} />
              <img src={badgePspo} alt="Badge PSPO" style={styles.badge} />
            </div>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="rg-right" style={styles.right}>
          <div style={styles.copyCard}>
            <div style={styles.kicker}>Le Groupe</div>

            <h1 style={styles.heading}>
              Bâtir des solutions numériques durables au service de l’impact
            </h1>

            <p style={styles.text}>
              Ronna Group est né d’une conviction forte : la technologie ne doit pas être une finalité,
              mais un levier stratégique au service de la structuration, de la performance et de l’impact durable.
            </p>

            <p style={styles.text}>
              Dans un environnement en constante évolution, Ronna Group se positionne comme un acteur capable de concevoir,
              développer et accompagner des solutions numériques adaptées aux réalités locales, tout en répondant aux standards internationaux.
            </p>

            <p style={styles.text}>
              À travers ses activités dans le digital, le développement applicatif, l’innovation et les services technologiques,
              Ronna Group ambitionne de contribuer activement à la transformation des organisations, à la montée en compétence des talents
              et à la création de valeur sur le long terme.
            </p>

            <p style={styles.text}>
              Le groupe se construit progressivement, avec une vision claire : structurer aujourd’hui des bases solides pour bâtir demain
              un écosystème technologique fiable, évolutif et porteur d’opportunités.
            </p>

            <div style={styles.signatureWrap}>
              <p style={styles.signature}>
                <em>« La technologie n’a de sens que lorsqu’elle s’inscrit dans une vision claire et un impact mesurable. »</em>
              </p>
            </div>
          </div>

          {/* petit bloc optionnel en bas (sobre) */}
          <div style={styles.note}>
            Besoin d’un accompagnement ? Rendez-vous sur la page <strong>Contact</strong> pour une demande de devis.
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

const styles = {
  page: {
    paddingTop: 110,
    paddingBottom: 70,
    background: "linear-gradient(180deg, rgba(3,10,26,0.98) 0%, rgba(5,18,45,0.98) 55%, rgba(3,10,26,0.98) 100%)",
    minHeight: "100vh",
  },

  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 18px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 44,
    alignItems: "start",
  },

  left: { display: "flex", flexDirection: "column", gap: 18 },
  right: { display: "flex", flexDirection: "column", gap: 16 },

  // Slider
  slider: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    overflow: "hidden",
  },
  sliderTop: {
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  sliderLabel: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.72)",
    fontWeight: 700,
  },
  controls: { display: "flex", gap: 8 },
  ctrlBtn: {
    width: 36,
    height: 32,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    lineHeight: "28px",
    fontSize: 18,
  },

  photoFrame: { position: "relative" },
  photo: {
    width: "100%",
    height: 520,
    objectFit: "cover",
    display: "block",
  },
  dots: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 12,
    display: "flex",
    gap: 8,
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.45)",
    background: "rgba(255,255,255,0.12)",
    cursor: "pointer",
  },
  dotActive: {
    background: "rgba(255,255,255,0.85)",
  },

  // Legend
  legend: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
  },
  name: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: "rgba(255,255,255,0.95)",
    letterSpacing: 0.2,
    lineHeight: 1.15,
    textAlign:"center"
  },
  title: {
    margin: "8px 0 12px",
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    textAlign:"center"
  },
  metaBlock: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: 12,
  display: "flex",
  justifyContent: "center"
  },
  metaTitle: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.70)",
    fontWeight: 800,
    marginBottom: 8,
  },
  distinctions: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: 8,
    color: "rgba(255,255,255,0.88)",
    lineHeight: 1.5,
    fontSize: 14,
    textAlign: "center",
  },
  badgesWrap: {
    marginTop: 14,
    display: "flex",
    gap: 12,
    alignItems: "center",
  justifyContent: "center",
    flexWrap: "wrap",
  },
  badge: { height: 42, width: "auto", objectFit: "contain" },

  // Copy
  copyCard: {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 18,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.72)",
    fontWeight: 800,
    marginBottom: 10,
  },
  heading: {
    margin: 0,
    fontSize: 28,
    fontWeight: 850,
    letterSpacing: -0.4,
    color: "rgba(255,255,255,0.95)",
    lineHeight: 1.15,
  },
  text: {
    margin: "12px 0 0",
    fontSize: 15.5,
    lineHeight: 1.75,
    color: "rgba(255,255,255,0.80)",
  },
  signatureWrap: {
    marginTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: 14,
  },
  signature: {
    margin: 0,
    color: "rgba(255,255,255,0.88)",
    fontSize: 14.5,
    lineHeight: 1.6,
  },
  note: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.02)",
    padding: "12px 14px",
    color: "rgba(255,255,255,0.74)",
    fontSize: 13,
  },
};
