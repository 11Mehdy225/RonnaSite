import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import s1 from "../assets/brands/services/ronnastudio.jpg";
import s2 from "../assets/brands/services/web.PNG";
import s3 from "../assets/brands/services/tv.PNG";
import s4 from "../assets/brands/services/dev.PNG";
import s5 from "../assets/brands/services/audit.PNG";
import s6 from "../assets/brands/services/sec.PNG";
import s7 from "../assets/brands/services/digital.PNG";
import s8 from "../assets/brands/services/cons-optimized.jpg";
import SEO from "../components/SEO.jsx";

const SERVICES = [
  {
    id: "ronna-digital", code: "RONNA_DIGITAL", category: "Communication numérique", title: "Ronna Digital", image: s1,
    promise: "Construire une présence numérique cohérente et pilotable.",
    description: "Nous structurons votre communication, vos contenus et vos canaux pour rendre votre organisation plus visible et plus lisible.",
    bullets: ["Diagnostic de présence", "Stratégie éditoriale et contenus", "Accompagnement et pilotage"],
    idealFor: "Organisations qui veulent professionnaliser leur communication numérique.", cta: "Parler de votre présence digitale",
  },
  {
    id: "ronna-web", code: "RONNA_WEB", category: "Sites & plateformes", title: "Ronna Web", image: s2,
    promise: "Transformer votre présence en ligne en outil de confiance et de conversion.",
    description: "Nous concevons des sites institutionnels et des plateformes rapides, accessibles et adaptés aux usages mobiles.",
    bullets: ["Cadrage et architecture des contenus", "Conception et développement", "SEO technique et mise en ligne"],
    idealFor: "Entreprises, associations et institutions ayant besoin d’un site professionnel.", cta: "Construire votre site",
  },
  {
    id: "ronna-tv", code: "RONNA_TV", category: "Média & podcast", title: "Ronna TV", image: s3,
    promise: "Donner une forme claire et professionnelle à vos prises de parole.",
    description: "Nous accompagnons la création de capsules, podcasts et formats médias adaptés à vos publics et à vos canaux.",
    bullets: ["Conception de formats", "Production et habillage", "Salon podcast et diffusion multicanale"],
    idealFor: "Marques et organisations qui souhaitent produire des contenus réguliers.", cta: "Préparer votre production média",
  },
  {
    id: "ronna-developpement", code: "RONNA_DEVELOPPEMENT", category: "Solutions métier", title: "Ronna Développement", image: s4,
    promise: "Concevoir un produit numérique adapté à vos opérations.",
    description: "Applications web et mobiles, API et outils internes développés à partir des besoins réels de vos équipes.",
    bullets: ["Cadrage fonctionnel", "Développement web, mobile et API", "Tests, déploiement et accompagnement"],
    idealFor: "Structures qui veulent digitaliser un processus ou lancer un produit.", cta: "Cadrer votre application",
  },
  {
    id: "ronna-audit", code: "RONNA_AUDIT", category: "Diagnostic", title: "Ronna Audit", image: s5,
    promise: "Comprendre l’existant avant d’investir dans les améliorations.",
    description: "Nous analysons les outils, pratiques et risques afin de proposer des priorités compréhensibles et réalisables.",
    bullets: ["Collecte et analyse", "Constats et risques", "Recommandations et plan d’actions"],
    idealFor: "Organisations qui ont besoin d’une vision indépendante de leur situation.", cta: "Demander un diagnostic",
  },
  {
    id: "ronna-securite", code: "RONNA_SECURITE", category: "Prévention", title: "Ronna Sécurité", image: s6,
    promise: "Réduire les risques par des mesures adaptées à votre contexte.",
    description: "Nous renforçons les bonnes pratiques, la protection des accès et la sensibilisation des équipes.",
    bullets: ["Évaluation des pratiques", "Prévention et durcissement", "Sensibilisation des utilisateurs"],
    idealFor: "Équipes qui manipulent des données et des outils numériques au quotidien.", cta: "Renforcer votre protection",
  },
  {
    id: "ronna-formation", code: "RONNA_FORMATION", category: "Compétences", title: "Ronna Formation", image: s7,
    promise: "Faire progresser les équipes avec une formation directement applicable.",
    description: "Des parcours ciblés, des ateliers et du coaching construits autour des outils et méthodes réellement utilisés.",
    bullets: ["Analyse du besoin", "Ateliers et formations ciblées", "Coaching et supports pratiques"],
    idealFor: "Organisations qui souhaitent structurer une montée en compétence.", cta: "Construire une formation",
  },
  {
    id: "ronna-conseil-management", code: "RONNA_CONSEIL_MANAGEMENT", category: "Organisation & pilotage", title: "Ronna Conseil & Management", image: s8,
    promise: "Transformer une intention en feuille de route pilotable.",
    description: "Nous aidons à cadrer les projets, organiser les responsabilités et installer des méthodes de suivi adaptées.",
    bullets: ["Cadrage et feuille de route", "Organisation et gouvernance", "Pilotage et accompagnement"],
    idealFor: "Dirigeants et équipes qui doivent structurer ou relancer un projet.", cta: "Structurer votre projet",
  },
];

function ServiceCard({ item, onOpen }) {
  const navigate = useNavigate();
  const subject = `Demande — ${item.title}`;
  return (
    <article id={item.id} style={styles.card} className="rg-compact-service">
      <div style={styles.cardHead}>
        <div style={styles.media}><img src={item.image} alt="" style={styles.image} loading="lazy" decoding="async" /></div>
        <div>
        <div style={styles.kicker}>{item.category}</div>
        <h2 style={styles.title}>{item.title}</h2>
        </div>
      </div>
      <p style={styles.promise}>{item.promise}</p>
      <div style={styles.cardActions}>
        <button type="button" style={styles.detailsBtn} onClick={() => onOpen(item)}>Voir les détails</button>
        <button type="button" style={styles.ctaBtn} onClick={() => navigate(`/contact?service=${item.code}&subject=${encodeURIComponent(subject)}`)}>Demander →</button>
      </div>
    </article>
  );
}

function ServiceModal({ item, onClose }) {
  const navigate = useNavigate();
  if (!item) return null;
  return (
    <div style={styles.overlay} role="dialog" aria-modal="true" aria-label={`Détails de ${item.title}`} onClick={onClose}>
      <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div style={styles.modalTop}>
          <div><div style={styles.kicker}>{item.category}</div><h2 style={styles.modalTitle}>{item.title}</h2></div>
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Fermer">×</button>
        </div>
        <p style={styles.modalPromise}>{item.promise}</p>
        <p style={styles.desc}>{item.description}</p>
        <strong style={styles.smallTitle}>Ce que nous pouvons prendre en charge</strong>
        <ul style={styles.bullets}>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
        <p style={styles.ideal}><strong>Idéal pour :</strong> {item.idealFor}</p>
        <button type="button" style={styles.modalCta} onClick={() => navigate(`/contact?service=${item.code}&subject=${encodeURIComponent(`Demande — ${item.title}`)}`)}>{item.cta} →</button>
      </div>
    </div>
  );
}

export default function Services() {
  const [activeService, setActiveService] = useState(null);
  return (
    <>
      <SEO title="Services" description="Découvrez les services numériques, médias, conseil, formation et sécurité proposés par RONNA GROUP." canonical="https://www.ronnagroup.net/services" />
      <main style={styles.page}>
        <header style={styles.hero}>
          <div style={styles.heroInner}>
            <div style={styles.heroKicker}>Nos services</div>
            <h1 style={styles.heroTitle}>Une expertise adaptée à chaque étape de votre projet</h1>
            <p style={styles.heroText}>Du diagnostic à la réalisation, RONNA GROUP rassemble des compétences complémentaires pour vous donner un interlocuteur clair et un accompagnement structuré.</p>
            <div style={styles.principles}>
              <span>Cadrage clair</span><span>Exécution par étapes</span><span>Suivi après livraison</span>
            </div>
          </div>
        </header>

        <section style={styles.section}>
          <div style={styles.list} className="rg-services-compact-grid">{SERVICES.map((item) => <ServiceCard key={item.id} item={item} onOpen={setActiveService} />)}</div>
        </section>

        <section style={styles.finalCta}>
          <div><div style={styles.heroKicker}>Vous hésitez entre plusieurs services ?</div><h2 style={styles.finalTitle}>Décrivez simplement votre besoin</h2><p style={styles.heroText}>Nous vous aiderons à identifier le bon point de départ et à cadrer la suite.</p></div>
          <Link to="/contact" style={styles.finalLink}>Parler à l’équipe →</Link>
        </section>
        <ServiceModal item={activeService} onClose={() => setActiveService(null)} />
      </main>
    </>
  );
}

const styles = {
  page: { paddingTop: 92, paddingBottom: 80, minHeight: "100vh" },
  hero: { borderBottom: "1px solid rgba(255,255,255,.08)" },
  heroInner: { maxWidth: 1100, margin: "0 auto", padding: "54px 18px 38px", textAlign: "center" },
  heroKicker: { fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", color: "rgba(95,183,255,.92)", fontWeight: 900 },
  heroTitle: { maxWidth: 850, margin: "12px auto 0", fontSize: "clamp(32px,5vw,52px)", lineHeight: 1.08, letterSpacing: -1 },
  heroText: { maxWidth: 760, margin: "15px auto 0", color: "rgba(255,255,255,.72)", fontSize: 16, lineHeight: 1.75 },
  principles: { display: "flex", justifyContent: "center", gap: 9, flexWrap: "wrap", marginTop: 22 },
  section: { maxWidth: 1200, margin: "0 auto", padding: "28px 18px 0" },
  list: { display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12 },
  card: { minWidth: 0, minHeight: 220, padding: 16, borderRadius: 20, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.035)", display: "flex", flexDirection: "column" },
  cardHead: { display: "flex", alignItems: "center", gap: 12, minWidth: 0 },
  media: { width: 58, height: 58, flex: "0 0 58px", padding: 4, borderRadius: 14, background: "rgba(255,255,255,.96)", overflow: "hidden" },
  image: { width: "100%", height: "100%", objectFit: "contain", display: "block" },
  kicker: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: "rgba(95,183,255,.9)", fontWeight: 900 },
  title: { margin: "5px 0 0", fontSize: 18, lineHeight: 1.2 }, promise: { margin: "15px 0", fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,.76)" },
  desc: { margin: "10px 0 0", color: "rgba(255,255,255,.72)", lineHeight: 1.7 },
  deliverables: { marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.08)" }, smallTitle: { fontSize: 13 },
  bullets: { margin: "9px 0 0", paddingLeft: 19, color: "rgba(255,255,255,.75)", lineHeight: 1.7 },
  ideal: { margin: "14px 0 0", color: "rgba(255,255,255,.68)", lineHeight: 1.6, fontSize: 14 },
  cardActions: { marginTop: "auto", display: "flex", gap: 7, flexWrap: "wrap" },
  detailsBtn: { padding: "9px 11px", borderRadius: 999, border: "1px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.04)", color: "white", fontSize: 12, cursor: "pointer" },
  ctaBtn: { padding: "9px 11px", borderRadius: 999, border: "1px solid rgba(255,255,255,.12)", background: "#1F4FD8", color: "white", fontWeight: 800, fontSize: 12, cursor: "pointer" },
  overlay: { position: "fixed", inset: 0, zIndex: 200, padding: 18, background: "rgba(0,0,0,.78)", display: "grid", placeItems: "center" },
  modal: { width: "min(620px,100%)", maxHeight: "90vh", overflowY: "auto", padding: "clamp(20px,4vw,34px)", borderRadius: 24, border: "1px solid rgba(255,255,255,.16)", background: "#071127", boxShadow: "0 30px 90px rgba(0,0,0,.55)" },
  modalTop: { display: "flex", justifyContent: "space-between", alignItems: "start", gap: 16 }, modalTitle: { margin: "7px 0 0", fontSize: 28 },
  closeBtn: { width: 40, height: 40, borderRadius: 999, border: "1px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.05)", color: "white", fontSize: 25, cursor: "pointer" },
  modalPromise: { margin: "18px 0 0", fontSize: 18, fontWeight: 800, lineHeight: 1.45 },
  modalCta: { marginTop: 8, padding: "11px 15px", borderRadius: 999, border: 0, background: "#1F4FD8", color: "white", fontWeight: 800, cursor: "pointer" },
  finalCta: { maxWidth: 1164, margin: "34px auto 0", padding: "clamp(22px,4vw,38px)", borderRadius: 26, border: "1px solid rgba(95,183,255,.2)", background: "linear-gradient(135deg,rgba(31,79,216,.18),rgba(255,255,255,.035))", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 22, flexWrap: "wrap" },
  finalTitle: { margin: "8px 0 0", fontSize: 28 }, finalLink: { padding: "12px 17px", borderRadius: 999, background: "white", color: "#071127", fontWeight: 900 },
};
