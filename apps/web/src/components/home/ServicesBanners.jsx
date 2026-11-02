import audit from "../../assets/brands/services/audit.PNG";
import web from "../../assets/brands/services/web.PNG";
import conseil from "../../assets/brands/services/cons-optimized.jpg";
import dev from "../../assets/brands/services/dev.PNG";
import digital from "../../assets/brands/services/digital.PNG";
import formation from "../../assets/brands/services/form.PNG";
import securite from "../../assets/brands/services/sec.PNG";
import tv from "../../assets/brands/services/tv.PNG";
import { Link } from "react-router-dom";

const SERVICES = [
  { name: "Ronna Développement", category: "Produit numérique", code: "ronna-developpement", icon: dev, desc: "Applications web et mobiles, API et solutions métier sur mesure." },
  { name: "Ronna Web", category: "Présence en ligne", code: "ronna-web", icon: web, desc: "Sites institutionnels et plateformes conçus pour informer et convertir." },
  { name: "Ronna Digital", category: "Communication", code: "ronna-digital", icon: digital, desc: "Stratégie, contenus et accompagnement de votre présence numérique." },
  { name: "Ronna Audit", category: "Diagnostic", code: "ronna-audit", icon: audit, desc: "Analyse de l’existant et plan d’amélioration priorisé." },
  { name: "Ronna Conseil & Management", category: "Pilotage", code: "ronna-conseil-management", icon: conseil, desc: "Cadrage, organisation, ressources humaines et gouvernance de projet." },
  { name: "Ronna Formation", category: "Compétences", code: "ronna-formation", icon: formation, desc: "Formations pratiques et accompagnement des équipes." },
  { name: "Ronna TV", category: "Média", code: "ronna-tv", icon: tv, desc: "Production de contenus, podcast et diffusion multicanale." },
  { name: "Ronna Sécurité", category: "Protection", code: "ronna-securite", icon: securite, desc: "Prévention, hygiène numérique et mesures de protection adaptées." },
];

export default function ServicesBanners() {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.head}>
          <div>
            <span style={styles.kicker}>Expertises</span>
            <h2 style={styles.h2}>Des services reliés à vos objectifs</h2>
            <p style={styles.sub}>Choisissez un besoin pour découvrir l’approche, les prestations et lancer une demande ciblée.</p>
          </div>
          <Link to="/services" style={styles.allLink}>Voir tous les services →</Link>
        </div>

        <div style={styles.grid}>
          {SERVICES.map((service) => (
            <Link key={service.name} to={`/services#${service.code}`} style={styles.card} className="rg-home-service-card">
              <div style={styles.iconWrap}>
                <img src={service.icon} alt="" style={styles.icon} loading="lazy" decoding="async" />
              </div>
              <span style={styles.category}>{service.category}</span>
              <h3 style={styles.title}>{service.name}</h3>
              <p style={styles.desc}>{service.desc}</p>
              <span style={styles.discover}>Découvrir <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: { padding: "54px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(3,10,26,0.68), rgba(3,10,26,0.78))" },
  container: { maxWidth: 1200, margin: "0 auto", padding: "0 18px" },
  head: { display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap", marginBottom: 22 },
  kicker: { color: "rgba(95,183,255,.94)", fontSize: 12, fontWeight: 900, letterSpacing: 1.5, textTransform: "uppercase" },
  h2: { margin: "7px 0 0", fontSize: 28, letterSpacing: -0.4 },
  sub: { margin: "9px 0 0", maxWidth: 680, color: "rgba(255,255,255,0.7)", lineHeight: 1.65 },
  allLink: { color: "rgba(147,197,253,.96)", fontWeight: 800, fontSize: 14 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 },
  card: { minHeight: 270, padding: 17, borderRadius: 20, border: "1px solid rgba(255,255,255,.1)", background: "linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.018))", display: "flex", flexDirection: "column", transition: "transform .2s ease,border-color .2s ease,background .2s ease" },
  iconWrap: { width: 68, height: 68, display: "grid", placeItems: "center", padding: 5, borderRadius: 16, background: "rgba(255,255,255,.96)", overflow: "hidden" },
  icon: { width: "100%", height: "100%", objectFit: "contain" },
  category: { marginTop: 16, color: "rgba(95,183,255,.9)", fontSize: 11, fontWeight: 900, letterSpacing: 1.1, textTransform: "uppercase" },
  title: { margin: "7px 0 0", fontSize: 18, lineHeight: 1.25 },
  desc: { margin: "8px 0 14px", color: "rgba(255,255,255,.68)", fontSize: 14, lineHeight: 1.6 },
  discover: { marginTop: "auto", color: "white", fontSize: 13, fontWeight: 800 },
};
