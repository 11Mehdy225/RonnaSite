import HeroVortex from "../components/hero/HeroVortex.jsx";
import ServicesBanners from "../components/home/ServicesBanners.jsx";
import ContactTeaser from "../components/home/ContactTeaser.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx"; 
import { apiUrl } from "../lib/api.js";
import acoLogo from "../assets/partners/aco-optimized.jpg";

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetch(apiUrl("/api/projects?limit=3&page=1"))
      .then((response) => response.json())
      .then((json) => {
        if (!cancelled && Array.isArray(json?.items)) {
          setProjects(
            json.items
              .filter((project) => project.slug !== "application-gestion-de-caisse-restaurant")
              .slice(0, 3)
          );
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
     <SEO
  title="Accueil"
  description="Ronna Group développe des projets stratégiques et des actions solidaires en Côte d’Ivoire."
  canonical="https://www.ronnagroup.net/"
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

      <section id="methode" style={styles.sectionAlt}>
        <div style={styles.container}>
          <div style={styles.kicker}>Notre méthode</div>
          <h2 style={styles.h2}>Un accompagnement clair, de l’idée au suivi</h2>
          <div style={styles.methodGrid}>
            {[
              ["01", "Comprendre", "Nous clarifions le besoin, les utilisateurs et les objectifs prioritaires."],
              ["02", "Cadrer", "Nous définissons le périmètre, les étapes, les responsabilités et les critères de réussite."],
              ["03", "Réaliser", "Nous avançons par étapes visibles avec des validations régulières."],
              ["04", "Accompagner", "Nous préparons la mise en service, le transfert et les évolutions utiles."],
            ].map(([number, title, text]) => (
              <article key={number} style={styles.methodCard}>
                <span style={styles.methodNumber}>{number}</span>
                <h3 style={styles.methodTitle}>{title}</h3>
                <p style={styles.methodText}>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projets" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHead}>
            <div>
              <div style={styles.kicker}>Projets livrés</div>
              <h2 style={styles.h2}>Nos réalisations</h2>
            </div>
            <Link to="/realisations" style={styles.textLink}>Voir toutes les réalisations →</Link>
          </div>

          {projects.length > 0 ? (
            <div style={styles.projectsGrid} className="rg-home-projects">
              {projects.map((project) => (
                <Link key={project._id} to={`/realisations/${project.slug}`} style={styles.projectCard}>
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      style={styles.projectImg}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div style={styles.projectPlaceholder}>RONNA GROUP</div>
                  )}
                  <div style={styles.projectBody}>
                    <div style={styles.projectCategory}>{project.category || "Réalisation"}</div>
                    <h3 style={styles.projectTitle}>{project.title}</h3>
                    <p style={styles.projectExcerpt}>{project.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={styles.emptyCard}>
              Découvrez les projets conçus et accompagnés par Ronna Group.
              <Link to="/realisations" style={styles.inlineLink}>Explorer nos réalisations →</Link>
            </div>
          )}
        </div>
      </section>

      <section style={styles.auditSection}>
        <div style={styles.container}>
          <div className="rg-home-audit" style={styles.auditCard}>
            <div>
              <div style={styles.kicker}>Nouvel outil gratuit</div>
              <h2 style={styles.auditTitle}>Mesurez la maturité numérique de votre entreprise.</h2>
              <p style={styles.auditText}>10 questions, un score immédiat et trois priorités concrètes pour progresser.</p>
            </div>
            <Link to="/audit-express" style={styles.auditButton}>Lancer l’Audit Express →</Link>
          </div>
        </div>
      </section>

      <section id="partenaires" style={styles.sectionAlt}>
        <div style={styles.container}>
          <div style={styles.partnerGrid} className="rg-home-partner">
            <div>
              <div style={styles.kicker}>Collaboration</div>
              <h2 style={styles.h2}>Ils nous font confiance</h2>
              <p style={styles.partnerText}>
                Des collaborations fondées sur l’écoute, la qualité d’exécution et la recherche d’un impact durable.
              </p>
            </div>
            <Link
              to="/actualites/partenariat-acoeurouvert-ronna-group"
              style={styles.partnerCard}
              aria-label="Découvrir le partenariat avec A Cœur Ouvert"
            >
              <img src={acoLogo} alt="A Cœur Ouvert" style={styles.partnerLogo} loading="lazy" decoding="async" />
              <div>
                <strong style={styles.partnerName}>A Cœur Ouvert</strong>
                <div style={styles.partnerLabel}>Partenaire</div>
              </div>
            </Link>
          </div>
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
  sectionAlt: { padding: "44px 0", background: "rgba(255,255,255,0.02)", borderBlock: "1px solid rgba(255,255,255,0.08)" },
  sectionHead: { display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", marginBottom: 18, flexWrap: "wrap" },
  kicker: { color: "rgba(95,183,255,0.92)", fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 7 },
  h2: { margin: 0, fontSize: 26 },
  textLink: { color: "rgba(147,197,253,0.95)", fontWeight: 700, fontSize: 14 },
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
  projectsGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 },
  projectCard: {
    minWidth: 0,
    overflow: "hidden",
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)"
  },
  projectImg: { width: "100%", height: 210, objectFit: "cover", display: "block" },
  projectPlaceholder: { height: 210, display: "grid", placeItems: "center", color: "rgba(255,255,255,0.45)", background: "rgba(31,79,216,0.12)", letterSpacing: 2 },
  projectBody: { padding: 16 },
  projectCategory: { color: "rgba(95,183,255,0.9)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 },
  projectTitle: { margin: "8px 0 0", fontSize: 18, lineHeight: 1.3 },
  projectExcerpt: { margin: "8px 0 0", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, fontSize: 14 },
  emptyCard: { padding: 20, borderRadius: 20, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.75)", display: "grid", gap: 10 },
  inlineLink: { color: "rgba(147,197,253,0.95)", fontWeight: 700 },
  partnerGrid: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 28, alignItems: "center" },
  partnerText: { margin: "10px 0 0", color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 650 },
  partnerCard: { display: "flex", alignItems: "center", gap: 16, padding: 16, borderRadius: 22, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" },
  partnerLogo: { width: 86, height: 86, objectFit: "contain", borderRadius: 18, background: "white" },
  partnerName: { display: "block", fontSize: 17 },
  partnerLabel: { marginTop: 5, color: "rgba(255,255,255,0.62)", fontSize: 13 },
  methodGrid: { marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12 },
  methodCard: { padding: 18, borderRadius: 20, border: "1px solid rgba(255,255,255,.1)", background: "rgba(3,10,26,.4)" },
  methodNumber: { color: "rgba(95,183,255,.92)", fontWeight: 900, letterSpacing: ".08em" },
  methodTitle: { margin: "12px 0 6px", fontSize: 18 },
  methodText: { margin: 0, color: "rgba(255,255,255,.7)", lineHeight: 1.65, fontSize: 14 },
  auditSection: { padding: "6px 0 44px" },
  auditCard: { padding: "30px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, borderRadius: 24, border: "1px solid rgba(112,149,244,.28)", background: "linear-gradient(120deg,rgba(31,79,216,.2),rgba(255,255,255,.035))" },
  auditTitle: { maxWidth: 680, margin: "7px 0 8px", fontSize: "clamp(23px,3vw,34px)" },
  auditText: { margin: 0, color: "rgba(255,255,255,.68)", lineHeight: 1.6 },
  auditButton: { flexShrink: 0, padding: "13px 16px", borderRadius: 999, background: "#1f4fd8", border: "1px solid rgba(255,255,255,.14)", color: "white", fontWeight: 800, textDecoration: "none" },
};
