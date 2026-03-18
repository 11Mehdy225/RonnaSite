import HeroVortex from "../components/hero/HeroVortex.jsx";
import ServicesBanners from "../components/home/ServicesBanners.jsx";
import ContactTeaser from "../components/home/ContactTeaser.jsx";
import { useEffect } from "react";
import SEO from "../components/SEO.jsx"; 

export default function Home() {
  useEffect(() => {
  document.title = "RonnaGroup | Acceuil";
}, []);
  return (
    <>
     <SEO
  title="Accueil"
  description="Ronna Group développe des projets stratégiques et des actions solidaires en Côte d’Ivoire."
  canonical="https://ronnagroup.com/"
/>
    <main>
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <HeroVortex/>
          
        </div>
      </section>

      <section id="univers" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.grid}>
            <ServicesBanners/>
          </div>
        </div>
      </section>

      <section id="projets" style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.h2}>Nos realisations</h2>
          <div style={styles.cardBig}>Argos • Servizio • Gboro • Fondation Ronna • Acoeur ouvert podcast</div>
        </div>
      </section>
      <section id="Partenaires" style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.h2}>Nos Partenaires</h2>
          <div style={styles.cardBig}>---------------------------------------------</div>
        </div>
      </section>

      <section id="contact" style={styles.section}>
        <ContactTeaser/>
      </section>
    </main>
    </>
  );
}

const styles = {
  hero: {
    padding: "22px 0 30px",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },
  heroInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 18px",
    display: "grid",
    gap: 18,
    justifyItems: "center"
  },
  heroVisual: { width: "100%" },
  visualFrame: {
    width: "100%",
    maxWidth: 980,
    height: 420,
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "linear-gradient(180deg, rgba(10,31,68,.55), rgba(3,10,26,.2))",
    display: "grid",
    placeItems: "center"
  },
  visualHint: {
    color: "rgba(255,255,255,.75)",
    fontSize: 14,
    textAlign: "center",
    padding: 20
  },
  heroText: { textAlign: "center", maxWidth: 720 },
  h1: { margin: "18px 0 10px", fontSize: 44, letterSpacing: -0.5 },
  p: { margin: 0, color: "rgba(255,255,255,.72)", fontSize: 16, lineHeight: 1.6 },
  actions: { marginTop: 18, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
  primary: {
    padding: "12px 16px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,.10)"
  },
  secondary: {
    padding: "12px 16px",
    borderRadius: 999,
    background: "transparent",
    border: "1px solid rgba(255,255,255,.14)"
  },
  section: { padding: "38px 0" },
  container: { maxWidth: 1200, margin: "0 auto", padding: "0 18px" },
  h2: { margin: "0 0 16px", fontSize: 22 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12
  },
  card: {
    padding: 16,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)"
  },
  cardBig: {
    padding: 18,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)"
  }
};
