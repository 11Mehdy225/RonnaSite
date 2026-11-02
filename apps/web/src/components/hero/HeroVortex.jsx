import { useEffect, useState } from "react";

const WORDS = [
  "Tech & Innovation",
  "L’Afrique en avant",
  "Solutions numériques",
  "Vision • Impact • Performance",
];

export default function HeroVortex() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let transitionTimer;
    const rotationTimer = window.setInterval(() => {
      setVisible(false);
      transitionTimer = window.setTimeout(() => {
        setIndex((current) => (current + 1) % WORDS.length);
        setVisible(true);
      }, 220);
    }, 3800);

    return () => {
      window.clearInterval(rotationTimer);
      window.clearTimeout(transitionTimer);
    };
  }, []);

  return (
    <section style={styles.hero} className="rg-hero-vortex">
      <div style={styles.overlay} />
      <div style={styles.content}>
        <h1 style={styles.title}>
          <span
            style={{
              ...styles.word,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
            }}
          >
            {WORDS[index]}
          </span>
        </h1>
        <div style={styles.heroText}>
          <p style={styles.p}>Groupe digital et innovation. Solutions numériques, services web, médias et accompagnement.</p>
          <p style={styles.p}>Ronna Group accompagne la transformation digitale et l’innovation en Afrique.</p>
        </div>

        <div style={styles.actions}>
          <a href="#univers" style={styles.primary}>Découvrir nos univers</a>
          <a href="#contact" style={styles.secondary}>Demander un devis</a>
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
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(3,10,26,0.22)",
    backdropFilter: "blur(2px)",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at 50% 46%, rgba(31,79,216,0.08), rgba(3,10,26,0.58) 78%)",
  },
  content: { position: "relative", zIndex: 2, textAlign: "center", padding: "0 20px", maxWidth: 900 },
  title: { fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 14 },
  word: { display: "inline-block", transition: "opacity .22s ease, transform .22s ease" },
  heroText: { display: "grid", gap: 5 },
  p: { margin: 0, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 },
  actions: { marginTop: 18, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" },
  primary: { padding: "12px 16px", borderRadius: 999, background: "rgba(31,79,216,.95)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 10px 26px rgba(31,79,216,.22)" },
  secondary: { padding: "12px 16px", borderRadius: 999, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)" },
};
