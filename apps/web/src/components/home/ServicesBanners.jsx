import audit from "../../assets/brands/services/audit.PNG" ;
import web from "../../assets/brands/services/web.PNG";
import conseil from "../../assets/brands/services/cons.PNG";
import dev from "../../assets/brands/services/dev.PNG";
import digital from "../../assets/brands/services/digital.PNG";
import formation from "../../assets/brands/services/form.PNG";
import securite from "../../assets/brands/services/sec.PNG";
import tv from "../../assets/brands/services/tv.PNG";


const SERVICES = [
  { name: "Ronna Développement", icon: dev, desc: "Applications et produits numériques robustes." },
  { name: "Ronna Web", icon: web, desc: "Sites vitrines, plateformes web et solutions sur mesure." },
  { name: "Ronna Digital", icon: digital, desc: "Stratégie digitale, présence en ligne et croissance,community management." },
{ name: "Ronna Audit", icon: audit, desc: "Audit, conformité, diagnostic et amélioration continue." },
{ name: "Ronna Conseil & Management", icon: conseil, desc: "Conseil, pilotage,Ressources Humaines, management et exécution." },
  { name: "Ronna Formation", icon: formation, desc: "Formation pratique et montée en compétences." },
  { name: "Ronna TV", icon: tv, desc: "Médias, contenus, diffusion et communication d’impact." },
  { name: "Ronna Sécurité", icon: securite, desc: "Sécurité électronique et solutions de protection." },
];

export default function ServicesBanners() {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.head}>
          <h2 style={styles.h2}>Nos services</h2>
          <p style={styles.sub}>
            Des pôles spécialisés, une seule exigence : la qualité d’exécution.
          </p>
        </div>

        <div style={styles.grid}>
          {SERVICES.map((s) => (
            <article key={s.name} style={styles.card}>
              <div style={styles.cardTop}>
                <img src={s.icon} alt={s.name} style={styles.icon} />
                <div style={styles.cardText}>
                  <div style={styles.title}>{s.name}</div>
                  <div style={styles.desc}>{s.desc}</div>
                </div>
              </div>

              <div style={styles.cardBottom}>
                {/* lien plus tard vers /services */}
                <a href="/services" style={styles.link}>Découvrir</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "54px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "linear-gradient(180deg, rgba(3,10,26,0.92), rgba(3,10,26,1))"
  },
  container: { maxWidth: 1200, margin: "0 auto", padding: "0 18px" },
  head: { maxWidth: 760, margin: "0 auto 18px", textAlign: "center" },
  h2: { margin: 0, fontSize: 26, letterSpacing: -0.3 },
  sub: { margin: "10px 0 0", color: "rgba(255,255,255,0.72)", lineHeight: 1.6 },

  grid: {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 12
  },

  card: {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 140
  },
  cardTop: { display: "flex", gap: 16, alignItems: "center" },

icon: {
  width: 130,             
  height: 130,
  objectFit: "contain",
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  padding: 2,
  flexShrink: 0         
},

  cardText: { minWidth: 0 },
 title: {
  fontSize: 17,
  fontWeight: 700
},
desc: {
  marginTop: 6,
  fontSize: 14,
  color: "rgba(255,255,255,0.72)",
  lineHeight: 1.55
},


  cardBottom: { marginTop: 12, display: "flex", justifyContent: "flex-end" },
  link: {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.03)",
    fontSize: 13
  }
};
