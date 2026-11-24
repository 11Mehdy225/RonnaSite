import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

const JALONIS_URL = "https://jalonis.ronnagroup.net";
const ASSETS = {
  home: "/realisations/jalonis/jalonis-accueil.png",
  login: "/realisations/jalonis/jalonis-connexion.png",
  dashboard: "/realisations/jalonis/jalonis-dashboard.png",
  scrum: "/realisations/jalonis/jalonis-scrum.png",
  suppliers: "/realisations/jalonis/jalonis-fournisseurs.png",
  workspace: "/realisations/jalonis/jalonis-espace.png"
};

const CAPABILITIES = [
  { title: "Gestion complète", text: "Charte, objectifs, livrables, jalons, calendrier, dépendances, risques et clôture." },
  { title: "Agile et Scrum", text: "Backlog, epics, user stories, sprints, Kanban, revues et rétrospectives." },
  { title: "Collaboration", text: "Équipes, responsabilités, commentaires, mentions, notifications et historique d’activité." },
  { title: "Fournisseurs", text: "Consultations, offres, contrats, documents, évaluations et traçabilité des engagements." },
  { title: "Pilotage financier", text: "Budgets, coûts, projections, charge des équipes et indicateurs de progression." },
  { title: "Personnalisation", text: "Identité du projet, champs personnalisés et affichages adaptés à chaque organisation." }
];

const AUDIENCES = [
  "Chefs de projet",
  "Scrum Masters",
  "Product Owners",
  "PME et startups",
  "Cabinets de conseil",
  "Organisations multi-projets"
];

const PLANS = [
  {
    name: "Découverte",
    audience: "Pour découvrir Jalonis et gérer ses premiers projets.",
    price: "Gratuit",
    features: ["1 utilisateur", "Jusqu’à 2 projets personnels", "Gestion prédictive, Scrum et hybride", "Planning, risques et fournisseurs", "Stockage limité"],
    cta: "Commencer gratuitement"
  },
  {
    name: "Personnel Pro",
    audience: "Pour les chefs de projet, consultants, étudiants et indépendants.",
    price: "5 000 FCFA",
    period: "par mois",
    annual: "50 000 FCFA par an",
    features: ["1 utilisateur", "Projets personnels illimités", "Synchronisation Web et Desktop", "Exports et sauvegardes", "Rappels par e-mail", "2 Go de stockage"],
    cta: "Choisir Personnel Pro"
  },
  {
    name: "Équipe",
    audience: "Pour les PME et les équipes projet collaboratives.",
    price: "6 000 FCFA",
    period: "par membre / mois",
    annual: "60 000 FCFA par membre / an",
    featured: true,
    features: ["À partir de 3 membres", "Organisations, invitations et rôles", "Projets collaboratifs", "Scrum en temps réel", "Commentaires, mentions et historique", "Rapports d’équipe et Daily Scrum", "10 Go de stockage partagé"],
    cta: "Choisir l’offre Équipe"
  },
  {
    name: "Business",
    audience: "Pour les organisations qui pilotent plusieurs projets.",
    price: "9 000 FCFA",
    period: "par membre / mois",
    annual: "90 000 FCFA par membre / an",
    features: ["À partir de 10 membres", "Toutes les fonctions de l’offre Équipe", "Portefeuille multi-projets", "Automatisations avancées", "Assistant de pilotage et détection des risques", "Journal d’audit", "Support prioritaire", "50 Go de stockage"],
    cta: "Choisir Business"
  },
  {
    name: "Entreprise",
    audience: "Pour les grandes organisations ayant des exigences particulières.",
    price: "Sur devis",
    features: ["Nombre de membres adapté au besoin", "Hébergement dédié ou installation privée", "Authentification d’entreprise", "Gestion centralisée des identités", "Sauvegardes et migration accompagnée", "Engagements de service personnalisés", "Support et conditions contractuelles sur mesure"],
    cta: "Demander une offre"
  }
];

export default function JalonisDetail() {
  return (
    <>
      <SEO
        title="Jalonis — Logiciel SaaS de gestion de projet hybride | RONNA GROUP"
        description="Découvrez Jalonis, la plateforme SaaS de Ronna Group pour gérer projets, équipes, sprints, budgets, risques, fournisseurs et décisions dans un espace collaboratif."
        canonical="https://www.ronnagroup.net/realisations/jalonis"
        image={ASSETS.home}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Jalonis",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: JALONIS_URL,
          description: "Plateforme SaaS de gestion de projet hybride conçue par Ronna Group.",
          creator: { "@type": "Organization", name: "Ronna Group", url: "https://www.ronnagroup.net" },
          offers: { "@type": "AggregateOffer", lowPrice: "0", highPrice: "9000", priceCurrency: "XOF", offerCount: "5" }
        }}
      />

      <main className="rg-jalonis">
        <section className="rg-jalonis__hero">
          <div className="rg-jalonis__hero-copy">
            <Link className="rg-jalonis__back" to="/realisations">Toutes les réalisations</Link>
            <span className="rg-jalonis__eyebrow">SaaS · Gestion de projet · Collaboration</span>
            <h1>Jalonis</h1>
            <h2>Pilotez vos projets, vos équipes et vos décisions dans un même espace.</h2>
            <p>
              Une plateforme de gestion de projet hybride qui réunit planification prédictive,
              méthodes Agile, collaboration, finances et fournisseurs dans une interface unique.
            </p>
            <div className="rg-jalonis__hero-actions">
              <a href={JALONIS_URL} target="_blank" rel="noreferrer">Créer mon espace</a>
              <a href="#decouvrir">Découvrir Jalonis</a>
            </div>
            <div className="rg-jalonis__status"><i /> Disponible en ligne</div>
          </div>

          <figure className="rg-jalonis__hero-visual">
            <img
              src={ASSETS.home}
              alt="Page d’accueil de Jalonis présentant son identité visuelle et son accès à la plateforme"
              width="2000"
              height="1063"
              fetchPriority="high"
            />
          </figure>
        </section>

        <section className="rg-jalonis__intro" id="decouvrir">
          <div>
            <span className="rg-jalonis__eyebrow">Le produit</span>
            <h2>Du cadrage initial à la clôture du projet.</h2>
          </div>
          <div className="rg-jalonis__intro-copy">
            <p>
              Jalonis accompagne les chefs de projet et leurs équipes pour organiser les tâches,
              construire les plannings, préparer les sprints et suivre les risques, les coûts,
              les fournisseurs, les réunions et les décisions.
            </p>
            <p>
              Chaque organisation peut créer son espace, inviter ses collaborateurs, attribuer
              les responsabilités et suivre l’avancement en temps réel, en mode prédictif,
              Agile/Scrum ou hybride.
            </p>
            <p className="rg-jalonis__ownership">
              Jalonis est une solution conçue et développée par <a href="https://www.ronnagroup.net">Ronna Group</a>.
            </p>
          </div>
        </section>

        <section className="rg-jalonis__showcase">
          <div className="rg-jalonis__section-head">
            <span className="rg-jalonis__eyebrow">Vision d’ensemble</span>
            <h2>Les signaux essentiels pour décider avec clarté.</h2>
            <p>Progression, échéances, budgets, risques et santé du projet sont réunis dans un tableau de bord lisible.</p>
          </div>
          <figure className="rg-jalonis__frame rg-jalonis__frame--large">
            <img
              src={ASSETS.dashboard}
              alt="Tableau de bord sombre de Jalonis avec indicateurs de progression, budget, risques et trajectoire du projet"
              width="2000"
              height="1083"
              loading="lazy"
            />
          </figure>
        </section>

        <section className="rg-jalonis__hybrid">
          <div className="rg-jalonis__hybrid-copy">
            <span className="rg-jalonis__eyebrow">Pilotage hybride</span>
            <h2>La rigueur du prédictif. La souplesse de l’Agile.</h2>
            <p>
              Jalonis permet d’adapter la méthode au projet sans fragmenter les informations.
              Les jalons, activités, user stories, responsabilités et décisions restent reliés.
            </p>
            <div className="rg-jalonis__mode-list">
              <article><strong>Prédictif</strong><span>Planning, dates, dépendances et jalons.</span></article>
              <article><strong>Agile</strong><span>Backlog, sprints, Kanban et rituels Scrum.</span></article>
              <article><strong>Hybride</strong><span>Une trajectoire commune entre les deux approches.</span></article>
            </div>
          </div>
          <figure className="rg-jalonis__frame">
            <img
              src={ASSETS.scrum}
              alt="Espace Scrum de Jalonis avec objectif produit, tableau, backlog, événements et création de sprint"
              width="2000"
              height="1083"
              loading="lazy"
            />
          </figure>
        </section>

        <section className="rg-jalonis__capabilities">
          <div className="rg-jalonis__section-head rg-jalonis__section-head--light">
            <span className="rg-jalonis__eyebrow">Fonctionnalités</span>
            <h2>Un poste de pilotage complet.</h2>
            <p>Les dimensions techniques, humaines, financières et organisationnelles restent visibles dans le même environnement.</p>
          </div>
          <div className="rg-jalonis__capability-grid">
            {CAPABILITIES.map((capability) => (
              <article key={capability.title}>
                <h3>{capability.title}</h3>
                <p>{capability.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rg-jalonis__beyond">
          <div className="rg-jalonis__section-head">
            <span className="rg-jalonis__eyebrow">Au-delà des tâches</span>
            <h2>Fournisseurs, contrats et engagements restent reliés au projet.</h2>
          </div>
          <figure className="rg-jalonis__frame rg-jalonis__frame--large">
            <img
              src={ASSETS.suppliers}
              alt="Module Fournisseurs et Achats de Jalonis avec synthèse, consultations, offres, contrats et évaluations"
              width="2000"
              height="1089"
              loading="lazy"
            />
          </figure>
        </section>

        <section className="rg-jalonis__impact">
          <div>
            <span className="rg-jalonis__eyebrow">Ce qui différencie Jalonis</span>
            <h2>Comprendre les conséquences, pas seulement suivre les tâches.</h2>
          </div>
          <div>
            <p>
              La chaîne d’impact permet de visualiser comment une décision, un retard,
              un risque, une dépense ou un fournisseur influence les autres éléments du projet.
            </p>
            <div className="rg-jalonis__impact-flow" aria-label="Éléments reliés par la chaîne d’impact">
              <span>Décisions</span><span>Délais</span><span>Risques</span><span>Coûts</span><span>Livrables</span>
            </div>
          </div>
        </section>

        <section className="rg-jalonis__gallery">
          <div className="rg-jalonis__section-head">
            <span className="rg-jalonis__eyebrow">Une expérience cohérente</span>
            <h2>De la connexion à l’administration de l’espace.</h2>
          </div>
          <div className="rg-jalonis__gallery-grid">
            <figure className="rg-jalonis__frame rg-jalonis__frame--wide">
              <img
                src={ASSETS.login}
                alt="Écran de connexion de Jalonis avec présentation du produit et accès au mode aperçu"
                width="2000"
                height="1081"
                loading="lazy"
              />
            </figure>
            <figure className="rg-jalonis__frame rg-jalonis__frame--wide">
              <img
                src={ASSETS.workspace}
                alt="Administration d’un espace de travail Jalonis avec membres, projets et offres professionnelles"
                width="2000"
                height="1090"
                loading="lazy"
              />
            </figure>
          </div>
        </section>

        <section className="rg-jalonis__audience">
          <div>
            <span className="rg-jalonis__eyebrow">Pour qui ?</span>
            <h2>Conçu pour les équipes qui doivent avancer ensemble.</h2>
          </div>
          <div className="rg-jalonis__audience-list">
            {AUDIENCES.map((audience) => <span key={audience}>{audience}</span>)}
          </div>
        </section>

        <section className="rg-jalonis__pricing" id="offres">
          <div className="rg-jalonis__pricing-head">
            <span className="rg-jalonis__eyebrow">Offres professionnelles</span>
            <h2>Une offre adaptée à chaque façon de piloter.</h2>
            <p>Commencez gratuitement, puis faites évoluer votre espace selon le nombre de projets, de membres et vos besoins d’administration.</p>
          </div>
          <div className="rg-jalonis__pricing-grid">
            {PLANS.map((plan) => (
              <article className={`rg-jalonis__plan${plan.featured ? " rg-jalonis__plan--featured" : ""}`} key={plan.name}>
                {plan.featured && <span className="rg-jalonis__plan-label">Pour les équipes</span>}
                <h3>{plan.name}</h3>
                <p className="rg-jalonis__plan-audience">{plan.audience}</p>
                <div className="rg-jalonis__plan-price">
                  <strong>{plan.price}</strong>
                  {plan.period && <span>{plan.period}</span>}
                </div>
                {plan.annual && <p className="rg-jalonis__plan-annual">{plan.annual}</p>}
                <ul>
                  {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <a className="rg-jalonis__plan-cta" href={JALONIS_URL} target="_blank" rel="noreferrer">{plan.cta}</a>
              </article>
            ))}
          </div>
          <div className="rg-jalonis__pricing-notes">
            <p>Les offres annuelles correspondent à dix mois facturés, soit deux mois offerts.</p>
            <p>Les observateurs en lecture seule et les fournisseurs externes ne consomment pas de siège payant.</p>
            <small>Applications de bureau bientôt disponibles.</small>
          </div>
        </section>

        <section className="rg-jalonis__cta">
          <div>
            <span className="rg-jalonis__eyebrow">Passez à l’action</span>
            <h2>Donnez à vos projets un cadre clair, une équipe alignée et des décisions traçables.</h2>
            <p>Créez votre espace, configurez votre premier projet et invitez votre équipe.</p>
          </div>
          <a href={JALONIS_URL} target="_blank" rel="noreferrer">Commencer avec Jalonis</a>
        </section>
      </main>
      <style>{css}</style>
    </>
  );
}

const css = `
.rg-jalonis{--violet:#6657ee;--violet-soft:#9a91ff;--cyan:#53d7d2;--ink:#070d20;--panel:#101936;min-height:100vh;padding-top:110px;overflow:hidden;color:#fff;background:#070d20}.rg-jalonis *{box-sizing:border-box;min-width:0}.rg-jalonis a{text-decoration:none}.rg-jalonis__eyebrow{display:block;color:#9a91ff;font-size:13px;font-weight:850;letter-spacing:1.5px;text-transform:uppercase}
.rg-jalonis__hero{max-width:1280px;margin:0 auto;padding:68px 28px 86px;display:grid;grid-template-columns:minmax(360px,.82fr) minmax(0,1.18fr);gap:48px;align-items:center}.rg-jalonis__back{display:inline-flex;margin-bottom:35px;color:rgba(255,255,255,.64);font-size:14px;font-weight:750}.rg-jalonis__back:hover{color:#fff}.rg-jalonis__hero h1{margin:18px 0 6px;font-size:clamp(68px,8vw,108px);line-height:.9;letter-spacing:-5px}.rg-jalonis__hero h2{max-width:590px;margin:24px 0 18px;font-size:clamp(31px,4vw,51px);line-height:1.04;letter-spacing:-1.8px}.rg-jalonis__hero-copy>p{max-width:590px;margin:0;color:rgba(255,255,255,.68);font-size:17px;line-height:1.72}.rg-jalonis__hero-actions{margin-top:30px;display:flex;gap:10px;flex-wrap:wrap}.rg-jalonis__hero-actions a,.rg-jalonis__plan-cta,.rg-jalonis__cta>a{min-height:48px;padding:0 20px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.14);border-radius:12px;background:linear-gradient(135deg,#7162f5,#5141db);color:#fff;font-size:15px;font-weight:800}.rg-jalonis__hero-actions a:last-child{background:rgba(255,255,255,.04)}.rg-jalonis__status{margin-top:20px;display:flex;align-items:center;gap:9px;color:rgba(255,255,255,.64);font-size:14px}.rg-jalonis__status i{width:8px;height:8px;border-radius:50%;background:#50d6a5;box-shadow:0 0 0 5px rgba(80,214,165,.11)}.rg-jalonis__hero-visual{aspect-ratio:16/9;margin:0;display:grid;place-items:center;overflow:hidden;border:1px solid rgba(255,255,255,.13);border-radius:20px;background:#101936;box-shadow:0 36px 100px rgba(0,0,0,.42);transform:perspective(1400px) rotateY(-3deg)}.rg-jalonis__hero-visual img,.rg-jalonis__frame img{width:100%;height:100%;display:block;object-fit:cover}
.rg-jalonis__intro{padding:82px max(28px,calc((100vw - 1120px)/2));display:grid;grid-template-columns:.9fr 1.1fr;gap:90px;background:#f5f7fb;color:#11182d}.rg-jalonis__intro .rg-jalonis__eyebrow,.rg-jalonis__capabilities .rg-jalonis__eyebrow{color:#5c4de2}.rg-jalonis__intro h2,.rg-jalonis__showcase h2,.rg-jalonis__hybrid h2,.rg-jalonis__capabilities h2,.rg-jalonis__beyond h2,.rg-jalonis__impact h2,.rg-jalonis__gallery h2,.rg-jalonis__audience h2,.rg-jalonis__pricing h2,.rg-jalonis__cta h2{margin:12px 0 0;font-size:clamp(34px,4.5vw,54px);line-height:1.05;letter-spacing:-1.8px}.rg-jalonis__intro-copy{display:grid;gap:14px}.rg-jalonis__intro-copy p{margin:0;color:#4e596f;font-size:17px;line-height:1.75}.rg-jalonis__ownership{padding-top:8px;border-top:1px solid #dde2ec}.rg-jalonis__ownership a{color:#5141db;font-weight:800}
.rg-jalonis__showcase,.rg-jalonis__beyond,.rg-jalonis__gallery{padding:90px 28px}.rg-jalonis__section-head{max-width:820px;margin:0 auto 38px;text-align:center}.rg-jalonis__section-head>p{max-width:680px;margin:16px auto 0;color:rgba(255,255,255,.62);font-size:17px;line-height:1.7}.rg-jalonis__frame{margin:0;overflow:hidden;border:1px solid rgba(255,255,255,.13);border-radius:18px;background:#111936;box-shadow:0 30px 90px rgba(0,0,0,.3)}.rg-jalonis__frame--large{max-width:1200px;aspect-ratio:16/8.8;margin:0 auto}.rg-jalonis__hybrid{max-width:1200px;margin:0 auto;padding:90px 28px;display:grid;grid-template-columns:minmax(330px,.78fr) minmax(0,1.22fr);gap:54px;align-items:center;border-top:1px solid rgba(255,255,255,.09)}.rg-jalonis__hybrid-copy>p{margin:18px 0 0;color:rgba(255,255,255,.64);font-size:17px;line-height:1.75}.rg-jalonis__hybrid .rg-jalonis__frame{aspect-ratio:16/9}.rg-jalonis__mode-list{margin-top:28px;display:grid;gap:10px}.rg-jalonis__mode-list article{padding:15px 0;display:grid;grid-template-columns:100px 1fr;gap:16px;border-bottom:1px solid rgba(255,255,255,.1)}.rg-jalonis__mode-list strong{color:#fff;font-size:15px}.rg-jalonis__mode-list span{color:rgba(255,255,255,.58);font-size:15px;line-height:1.5}
.rg-jalonis__capabilities{padding:90px max(28px,calc((100vw - 1120px)/2));background:#f5f7fb;color:#11182d}.rg-jalonis__section-head--light>p{color:#5b667c}.rg-jalonis__capability-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.rg-jalonis__capability-grid article{padding:28px 24px;border:1px solid #dde2ed;border-radius:14px;background:#fff}.rg-jalonis__capability-grid h3{margin:0 0 12px;font-size:20px}.rg-jalonis__capability-grid p{margin:0;color:#5d687d;font-size:16px;line-height:1.65}.rg-jalonis__beyond{background:linear-gradient(180deg,#0a1128,#070d20)}
.rg-jalonis__impact{max-width:1120px;margin:0 auto;padding:90px 28px;display:grid;grid-template-columns:.9fr 1.1fr;gap:80px;border-top:1px solid rgba(255,255,255,.09)}.rg-jalonis__impact>div:last-child>p{margin:0;color:rgba(255,255,255,.65);font-size:17px;line-height:1.75}.rg-jalonis__impact-flow{margin-top:25px;display:flex;flex-wrap:wrap;gap:8px}.rg-jalonis__impact-flow span,.rg-jalonis__audience-list span{padding:10px 13px;border:1px solid rgba(154,145,255,.24);border-radius:999px;background:rgba(102,87,238,.09);color:#c4bfff;font-size:14px;font-weight:750}.rg-jalonis__gallery{background:#0a1128}.rg-jalonis__gallery-grid{max-width:1200px;margin:0 auto;display:grid;gap:18px}.rg-jalonis__frame--wide{aspect-ratio:16/8.8}.rg-jalonis__audience{max-width:1120px;margin:0 auto;padding:90px 28px;display:grid;grid-template-columns:.95fr 1.05fr;gap:70px;align-items:center}.rg-jalonis__audience-list{display:flex;gap:9px;flex-wrap:wrap}.rg-jalonis__pricing{padding:90px 28px;background:linear-gradient(180deg,#0a1128,#070d20)}.rg-jalonis__pricing-head{max-width:1120px;margin:0 auto 38px}.rg-jalonis__pricing-head>p{max-width:760px;margin:16px 0 0;color:rgba(255,255,255,.66);font-size:17px;line-height:1.7}.rg-jalonis__pricing-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(12,1fr);gap:14px}.rg-jalonis__plan{position:relative;grid-column:span 4;padding:29px 24px;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:#111936}.rg-jalonis__plan:nth-child(n+4){grid-column:span 6}.rg-jalonis__plan--featured{border-color:rgba(154,145,255,.72);box-shadow:0 24px 70px rgba(48,37,151,.22)}.rg-jalonis__plan-label{width:max-content;margin-bottom:17px;padding:7px 9px;border-radius:999px;background:rgba(102,87,238,.2);color:#c8c3ff;font-size:13px;font-weight:800}.rg-jalonis__plan h3{margin:0;font-size:25px;letter-spacing:-.5px}.rg-jalonis__plan-audience{min-height:76px;margin:12px 0 22px;color:rgba(255,255,255,.58);font-size:15px;line-height:1.6}.rg-jalonis__plan-price{min-height:66px;display:flex;align-items:flex-end;gap:8px;flex-wrap:wrap}.rg-jalonis__plan-price strong{font-size:clamp(28px,3vw,38px);line-height:1}.rg-jalonis__plan-price span{color:rgba(255,255,255,.5);font-size:14px}.rg-jalonis__plan-annual{margin:9px 0 0;color:#8de0d5;font-size:14px;font-weight:750}.rg-jalonis__plan ul{margin:25px 0 28px;padding:20px 0 0;display:grid;gap:11px;border-top:1px solid rgba(255,255,255,.1);list-style:none}.rg-jalonis__plan li{position:relative;padding-left:21px;color:rgba(255,255,255,.72);font-size:15px;line-height:1.45}.rg-jalonis__plan li::before{content:"✓";position:absolute;left:0;color:#53d7d2;font-weight:900}.rg-jalonis__plan-cta{width:100%;margin-top:auto;text-align:center}.rg-jalonis__pricing-notes{max-width:1200px;margin:18px auto 0;padding:21px 23px;border:1px solid rgba(83,215,210,.18);border-radius:14px;background:rgba(83,215,210,.05)}.rg-jalonis__pricing-notes p{margin:0;color:rgba(255,255,255,.7);font-size:15px;line-height:1.65}.rg-jalonis__pricing-notes p+p{margin-top:4px}.rg-jalonis__pricing-notes small{display:block;margin-top:9px;color:rgba(255,255,255,.47);font-size:13px}.rg-jalonis__cta{max-width:1120px;margin:28px auto 78px;padding:44px 38px;display:flex;align-items:center;justify-content:space-between;gap:45px;border:1px solid rgba(255,255,255,.12);border-radius:20px;background:#111936}.rg-jalonis__cta>div{max-width:760px}.rg-jalonis__cta h2{font-size:clamp(30px,4vw,46px)}.rg-jalonis__cta p{margin:15px 0 0;color:rgba(255,255,255,.62);font-size:17px;line-height:1.65}.rg-jalonis__cta>a{flex:0 0 auto}
@media(max-width:980px){.rg-jalonis__hero{grid-template-columns:1fr}.rg-jalonis__hero-copy{max-width:760px}.rg-jalonis__hero-visual{max-width:900px;transform:none}.rg-jalonis__intro,.rg-jalonis__impact,.rg-jalonis__audience{grid-template-columns:1fr;gap:34px}.rg-jalonis__hybrid{grid-template-columns:1fr}.rg-jalonis__hybrid-copy{max-width:760px}.rg-jalonis__capability-grid{grid-template-columns:1fr 1fr}.rg-jalonis__plan,.rg-jalonis__plan:nth-child(n+4){grid-column:span 6}.rg-jalonis__cta{margin-inline:28px;align-items:flex-start;flex-direction:column}.rg-jalonis__cta>a{align-self:stretch}}
@media(max-width:680px){.rg-jalonis{padding-top:88px}.rg-jalonis__hero{padding:42px 16px 58px;gap:34px}.rg-jalonis__back{margin-bottom:29px}.rg-jalonis__hero h1{font-size:70px;letter-spacing:-3px}.rg-jalonis__hero h2{font-size:34px}.rg-jalonis__hero-copy>p{font-size:16px}.rg-jalonis__hero-actions{flex-direction:column}.rg-jalonis__hero-actions a{width:100%}.rg-jalonis__hero-visual,.rg-jalonis__frame{border-radius:12px}.rg-jalonis__intro{padding:58px 18px}.rg-jalonis__showcase,.rg-jalonis__beyond,.rg-jalonis__gallery{padding:64px 16px}.rg-jalonis__section-head{text-align:left}.rg-jalonis__section-head>p{font-size:16px}.rg-jalonis__hybrid{padding:64px 18px;gap:30px}.rg-jalonis__mode-list article{grid-template-columns:1fr;gap:5px}.rg-jalonis__capabilities{padding:64px 18px}.rg-jalonis__capability-grid{grid-template-columns:1fr}.rg-jalonis__impact,.rg-jalonis__audience{padding:64px 18px}.rg-jalonis__pricing{padding:64px 16px}.rg-jalonis__plan,.rg-jalonis__plan:nth-child(n+4){grid-column:span 12}.rg-jalonis__plan-audience{min-height:0}.rg-jalonis__cta{margin:22px 18px 58px;padding:30px 22px}.rg-jalonis__cta>a{width:100%;text-align:center}}
@media(prefers-reduced-motion:reduce){.rg-jalonis *{scroll-behavior:auto!important;transition:none!important}.rg-jalonis__hero-visual{transform:none}}
`;
