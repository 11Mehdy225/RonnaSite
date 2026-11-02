import { Link } from "react-router-dom";
import portrait from "../assets/groupe/loic1-optimized.jpg";
import badgePmp from "../assets/badges/pmp.png";
import badgePspo from "../assets/badges/pspo.png";
import SEO from "../components/SEO.jsx";

const PILLARS = [
  { number: "01", title: "Innovation utile", text: "Concevoir des solutions qui répondent à des besoins concrets et créent une valeur durable." },
  { number: "02", title: "Excellence d’exécution", text: "Avancer avec méthode, clarté et exigence, de la définition du besoin à la mise en service." },
  { number: "03", title: "Impact durable", text: "Faire de la technologie un levier de structuration, de compétence et d’opportunités." },
];

const AMBITION = [
  ["Structurer", "Poser des bases solides, des objectifs clairs et une organisation adaptée."],
  ["Développer", "Transformer les besoins en produits, services et dispositifs numériques utiles."],
  ["Accompagner", "Transmettre les méthodes et soutenir les équipes dans la durée."],
  ["Créer de l’impact", "Relier la performance des projets à une contribution positive et mesurable."],
];

export default function Groupe() {
  return (
    <>
      <SEO
        title="Le Groupe"
        description="Découvrez la vision, le fondateur et l’ambition de RONNA GROUP en Côte d’Ivoire."
        canonical="https://www.ronnagroup.net/groupe"
      />
      <main style={styles.page}>
        <section style={styles.hero} className="rg-group-hero">
          <div style={styles.portraitCard}>
            <div style={styles.portraitTop}><span>Fondateur & Directeur Général</span><span>Abidjan · Côte d’Ivoire</span></div>
            <img src={portrait} alt="KONAN N’DASSENAN Loïc Harold Mehdy" style={styles.portrait} />
          </div>

          <div style={styles.heroCopy}>
            <div style={styles.kicker}>Direction & vision</div>
            <h1 style={styles.heroTitle}>KONAN N’DASSENAN<br />Loïc Harold Mehdy</h1>
            <p style={styles.role}>Fondateur & Directeur Général de RONNA GROUP</p>
            <p style={styles.heroLead}>
              Bâtir des solutions numériques durables, adaptées aux réalités locales et alignées sur des standards d’exécution exigeants.
            </p>
            <div style={styles.expertise}>
              {['Développement Web & Mobile', 'DevOps', 'Design Web', 'Gestion de projet'].map((label) => <span key={label} style={styles.expertiseItem}>{label}</span>)}
            </div>
            <div style={styles.actions}>
              <Link to="/contact?subject=Prise%20de%20contact%20professionnelle" style={styles.primary}>Prendre contact</Link>
              <Link to="/services" style={styles.secondary}>Découvrir nos services</Link>
            </div>
          </div>
        </section>

        <section style={styles.pillars} className="rg-group-pillars" aria-label="Principes du groupe">
          {PILLARS.map((pillar) => (
            <article key={pillar.number} style={styles.pillarCard}>
              <span style={styles.pillarNumber}>{pillar.number}</span>
              <h2 style={styles.pillarTitle}>{pillar.title}</h2>
              <p style={styles.pillarText}>{pillar.text}</p>
            </article>
          ))}
        </section>

        <section style={styles.story} className="rg-group-story">
          <div style={styles.storyHeading}>
            <div style={styles.kicker}>Le Groupe</div>
            <h2 style={styles.sectionTitle}>La technologie comme levier de structuration et de croissance</h2>
          </div>
          <div style={styles.storyCopy}>
            <p>RONNA GROUP est né d’une conviction : la technologie ne doit pas être une finalité, mais un outil au service de la performance, de l’organisation et de l’impact.</p>
            <p>Le Groupe rassemble des expertises en développement, digital, média, audit, sécurité, formation et conseil afin d’accompagner les organisations avec une vision cohérente, de la stratégie à l’exécution.</p>
            <p>Notre construction est progressive et volontaire : consolider aujourd’hui des fondations fiables pour développer demain un écosystème technologique évolutif et porteur d’opportunités.</p>
          </div>
        </section>

        <section style={styles.leadership} className="rg-group-leadership">
          <blockquote style={styles.quote}>
            <span style={styles.quoteMark}>“</span>
            <p>La technologie n’a de sens que lorsqu’elle s’inscrit dans une vision claire et produit un impact mesurable.</p>
            <footer>— KONAN N’DASSENAN Loïc Harold Mehdy</footer>
          </blockquote>

          <div style={styles.certifications}>
            <div style={styles.kicker}>Méthode & certifications</div>
            <h2 style={styles.certTitle}>Une direction orientée produit et gestion de projet</h2>
            <p style={styles.certText}>Une approche qui associe vision produit, pilotage structuré et exécution technique.</p>
            <div style={styles.badges} className="rg-group-badges">
              <div style={styles.badgeCard}><img src={badgePmp} alt="Certification PMP" style={styles.badgeImage} /><div style={styles.badgeCopy}><strong>PMP®</strong><span>Project Management Professional</span></div></div>
              <div style={styles.badgeCard}><img src={badgePspo} alt="Certification PSPO I" style={styles.badgeImage} /><div style={styles.badgeCopy}><strong>PSPO I</strong><span>Professional Scrum Product Owner</span></div></div>
            </div>
          </div>
        </section>

        <section style={styles.ambition}>
          <div style={styles.ambitionHead}><div style={styles.kicker}>Notre ambition</div><h2 style={styles.sectionTitle}>Construire avec méthode, grandir avec cohérence</h2></div>
          <div style={styles.timeline} className="rg-group-timeline">
            {AMBITION.map(([title, text], index) => (
              <article key={title} style={styles.timelineItem}>
                <span style={styles.timelineIndex}>{String(index + 1).padStart(2, "0")}</span>
                <div><h3 style={styles.timelineTitle}>{title}</h3><p style={styles.timelineText}>{text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section style={styles.cta}>
          <div><div style={styles.kicker}>Collaboration</div><h2 style={styles.ctaTitle}>Construisons une relation professionnelle durable</h2><p>Projet numérique, partenariat ou accompagnement stratégique : échangeons sur votre besoin.</p></div>
          <Link to="/contact" style={styles.ctaLink}>Échanger avec RONNA GROUP →</Link>
        </section>
      </main>
    </>
  );
}

const styles = {
  page: { maxWidth: 1200, margin: "0 auto", padding: "122px 18px 80px" },
  hero: { display: "grid", gridTemplateColumns: "minmax(320px,.82fr) minmax(0,1.18fr)", gap: 42, alignItems: "center" },
  portraitCard: { borderRadius: 28, border: "1px solid rgba(95,183,255,.22)", background: "rgba(255,255,255,.035)", overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,.28)" },
  portraitTop: { minHeight: 48, padding: "12px 15px", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", color: "rgba(255,255,255,.62)", fontSize: 11, letterSpacing: .7, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,.08)" },
  portrait: { width: "100%", height: 570, display: "block", objectFit: "cover", objectPosition: "center 26%" },
  heroCopy: { padding: "18px 0" }, kicker: { color: "rgba(95,183,255,.94)", fontSize: 11, fontWeight: 900, letterSpacing: 1.5, textTransform: "uppercase" },
  heroTitle: { margin: "12px 0 0", fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.04, letterSpacing: -1.5 },
  role: { margin: "13px 0 0", color: "rgba(255,255,255,.65)", fontSize: 15, textTransform: "uppercase", letterSpacing: .8 },
  heroLead: { maxWidth: 680, margin: "24px 0 0", fontSize: 20, lineHeight: 1.6, color: "rgba(255,255,255,.84)" },
  expertise: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 21 },
  expertiseItem: { padding: "8px 11px", borderRadius: 999, border: "1px solid rgba(255,255,255,.11)", background: "rgba(255,255,255,.035)", color: "rgba(255,255,255,.72)", fontSize: 12 },
  actions: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 26 },
  primary: { padding: "12px 17px", borderRadius: 999, background: "#1F4FD8", color: "white", fontWeight: 800 },
  secondary: { padding: "12px 17px", borderRadius: 999, border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.035)", fontWeight: 800 },
  pillars: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12, marginTop: 54 },
  pillarCard: { padding: 20, borderRadius: 20, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.03)" },
  pillarNumber: { color: "rgba(95,183,255,.88)", fontSize: 12, fontWeight: 900 }, pillarTitle: { margin: "12px 0 0", fontSize: 19 },
  pillarText: { margin: "8px 0 0", color: "rgba(255,255,255,.67)", lineHeight: 1.65, fontSize: 14 },
  story: { display: "grid", gridTemplateColumns: ".85fr 1.15fr", gap: 50, marginTop: 78, padding: "42px 0", borderBlock: "1px solid rgba(255,255,255,.08)" },
  sectionTitle: { margin: "10px 0 0", fontSize: "clamp(28px,4vw,42px)", lineHeight: 1.15, letterSpacing: -.8 },
  storyCopy: { color: "rgba(255,255,255,.76)", fontSize: 16, lineHeight: 1.8 },
  leadership: { display: "grid", gridTemplateColumns: ".9fr 1.1fr", gap: 22, marginTop: 56 },
  quote: { margin: 0, padding: 28, borderRadius: 24, background: "linear-gradient(145deg,rgba(31,79,216,.2),rgba(255,255,255,.03))", border: "1px solid rgba(95,183,255,.2)", display: "flex", flexDirection: "column", justifyContent: "center" },
  quoteMark: { fontSize: 70, lineHeight: .7, color: "rgba(95,183,255,.65)" },
  certifications: { padding: 28, borderRadius: 24, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.03)" },
  certTitle: { margin: "9px 0 0", fontSize: 26 }, certText: { color: "rgba(255,255,255,.68)", lineHeight: 1.65 },
  badges: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10, marginTop: 18 },
  badgeCard: { display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 16, background: "rgba(3,10,26,.42)", border: "1px solid rgba(255,255,255,.08)" },
  badgeImage: { width: 52, height: 52, objectFit: "contain", flex: "0 0 52px" },
  badgeCopy: { display: "grid", gap: 4, minWidth: 0, color: "rgba(255,255,255,.66)", fontSize: 11 },
  ambition: { marginTop: 72 }, ambitionHead: { maxWidth: 720 }, timeline: { display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10, marginTop: 24 },
  timelineItem: { padding: 18, borderRadius: 18, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.025)" },
  timelineIndex: { color: "rgba(95,183,255,.85)", fontWeight: 900 },
  timelineTitle: { margin: "10px 0 0", fontSize: 18 }, timelineText: { margin: "7px 0 0", color: "rgba(255,255,255,.65)", lineHeight: 1.6, fontSize: 14 },
  cta: { marginTop: 64, padding: "clamp(24px,4vw,42px)", borderRadius: 26, border: "1px solid rgba(95,183,255,.2)", background: "linear-gradient(135deg,rgba(31,79,216,.2),rgba(255,255,255,.035))", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 22, flexWrap: "wrap" },
  ctaTitle: { margin: "8px 0", fontSize: 28 }, ctaLink: { padding: "12px 17px", borderRadius: 999, background: "white", color: "#071127", fontWeight: 900 },
};
