import { useEffect, useState } from "react";
import vortex from "../../assets/hero/vid.mov";

export default function HeroVortex() {
  const words = [
    "Tech & Innovation",
    "L’Afrique en avant",
    "Solutions numériques",
    "Vision • Impact • Performance",
  ];

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 220);
    }, 3800);

    return () => clearInterval(timer);
  }, []);

  return (
    <section style={styles.hero}>
      {/* VIDEO BACKGROUND */}
      <video
        src={vortex}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={styles.video}
      />

      {/* OVERLAY POUR LISIBILITÉ */}
      <div style={styles.overlay} />

      {/* CONTENU */}
      <div style={styles.content}>
        <h1 style={styles.title}>
          <span
            style={{
              ...styles.word,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
            }}
          >
            {words[index]}
          </span>
        </h1>
        <div style={styles.heroText}>
          <p style={styles.p}>
            Groupe digital et innovation. Solutions numériques, services web,
            médias et accompagnement.
          </p>
          <p style={styles.p}>
            Ronna Group accompagne la transformation digitale et l’innovation en
            Afrique.
          </p>
        </div>

        <div style={styles.actions}>
          <a href="#univers" style={styles.primary}>
            Découvrir nos univers
          </a>
          <a href="#contact" style={styles.secondary}>
            Demander un devis
          </a>
        </div>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    position: "relative",
    height: "55vh",
    minHeight: 380,
    width: "85vw",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(3,10,26,0.55) 0%, rgba(3,10,26,0.75) 60%, rgba(3,10,26,0.92) 100%)",
  },
  content: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    padding: "0 20px",
    maxWidth: 900,
  },
  title: {
    fontSize: "clamp(32px, 4.5vw, 56px)",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    marginBottom: 14,
  },
  word: {
    display: "inline-block",
    transition: "opacity .22s ease, transform .22s ease",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 1.6,
  },

  actions: {
    marginTop: 18,
    display: "flex",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  primary: {
    padding: "12px 16px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 10px 26px rgba(31,79,216,.22)",
  },
  secondary: {
    padding: "12px 16px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.18)",
  },
};
