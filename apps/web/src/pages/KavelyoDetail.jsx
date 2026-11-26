import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

const KAVELYO_URL = "https://kavelyo.ronnagroup.net";
const KAVELYO_PRICING_URL = `${KAVELYO_URL}/?page=pricing`;
const ASSETS = {
  logo: "/realisations/kavelyo/kavelyo-logo.png",
  home: "/realisations/kavelyo/kavelyo-accueil.jpg",
  login: "/realisations/kavelyo/kavelyo-connexion.jpg",
  dashboard: "/realisations/kavelyo/kavelyo-dashboard.jpg",
  scrum: "/realisations/kavelyo/kavelyo-scrum.jpg",
  suppliers: "/realisations/kavelyo/kavelyo-fournisseurs.jpg",
  workspace: "/realisations/kavelyo/kavelyo-espace.jpg"
};

const CAPABILITIES = [
  { title: "Gestion complète des projets", text: "Plusieurs projets, charte, objectifs, livrables, jalons, calendrier, dépendances, risques, décisions, changements, budgets, projections et clôture." },
  { title: "Agile, Scrum et Kanban", text: "Product backlog, epics, user stories, tâches, anomalies, sprints, Kanban, Refinement, Daily Scrum, Review, rétrospectives et historique." },
  { title: "Collaboration sécurisée", text: "Comptes individuels, organisations, invitations, rôles, accès autorisés, attribution des tâches, commentaires, mentions, notifications et traçabilité." },
  { title: "Gestion des fournisseurs", text: "Fiches fournisseurs, demandes de cotation, documents, contrats, évaluations, achats, livrables et suivi des engagements." },
  { title: "Pilotage et décisions", text: "Tableaux de bord, progression, coûts, délais, charge des équipes, risques, chaîne d’impact et indicateurs d’utilisation." },
  { title: "Personnalisation", text: "Logo et couleur par projet, champs personnalisables, vues tableau, liste, calendrier et planning sur ordinateur, tablette et mobile." }
];

const AUDIENCES = [
  "Chefs de projet",
  "Consultants et indépendants",
  "Étudiants",
  "Scrum Masters",
  "Product Owners",
  "Équipes techniques",
  "PME et startups",
  "Cabinets de conseil",
  "Entreprises multi-projets",
  "Grandes organisations"
];

const PLANS = [
  {
    name: "Découverte",
    audience: "Pour découvrir Kavelyo et gérer ses premiers projets.",
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
    features: ["À partir de 10 membres", "Toutes les fonctions de l’offre Équipe", "Portefeuille multi-projets", "Automatisations avancées", "Assistant de pilotage", "Détection des risques", "Journal d’audit", "Support prioritaire", "50 Go de stockage"],
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

export default function KavelyoDetail() {
  return (
    <>
      <SEO
        title="Kavelyo — Logiciel SaaS de gestion de projet hybride | Ronna Group"
        description="Découvrez Kavelyo, la plateforme SaaS de Ronna Group pour gérer projets, équipes, sprints, budgets, risques, fournisseurs et décisions dans un espace collaboratif sécurisé."
        canonical="https://www.ronnagroup.net/realisations/kavelyo"
        keywords="Kavelyo, logiciel de gestion de projet Côte d’Ivoire, outil de gestion de projet Afrique francophone, logiciel Scrum, gestion fournisseurs, gestion de projet hybride Agile et PMP, suivi de projet budget risques fournisseurs, logiciel chef de projet, Ronna Group"
        image={ASSETS.home}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Kavelyo",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: KAVELYO_URL,
          image: "https://www.ronnagroup.net/realisations/kavelyo/kavelyo-accueil.jpg",
          description: "Plateforme SaaS de gestion de projet hybride conçue par Ronna Group pour piloter projets, équipes, sprints, budgets, risques, fournisseurs et décisions.",
          creator: { "@type": "Organization", name: "Ronna Group", url: "https://www.ronnagroup.net" },
          offers: { "@type": "AggregateOffer", lowPrice: "0", highPrice: "9000", priceCurrency: "XOF", offerCount: "5" }
        }}
      />

      <main className="rg-kavelyo">
        <section className="rg-kavelyo__hero">
          <div className="rg-kavelyo__hero-copy">
            <Link className="rg-kavelyo__back" to="/realisations">Toutes les réalisations</Link>
            <span className="rg-kavelyo__eyebrow">SaaS · Gestion de projet · Collaboration</span>
            <div className="rg-kavelyo__brand">
              <img src={ASSETS.logo} alt="Logo officiel Kavelyo" width="72" height="72" />
              <div><h1>Kavelyo</h1><p>Du plan à l’impact.</p></div>
            </div>
            <h2>Pilotez vos projets, vos équipes et vos décisions dans un même espace.</h2>
            <p>
              Kavelyo est une plateforme SaaS de gestion de projet conçue par Ronna Group. Elle
              réunit la planification prédictive, les méthodes Agile et Scrum, la collaboration
              d’équipe, le suivi financier, les fournisseurs et le pilotage stratégique.
            </p>
            <div className="rg-kavelyo__hero-actions">
              <a href={KAVELYO_URL} target="_blank" rel="noreferrer">Créer mon espace</a>
              <a href={KAVELYO_URL} target="_blank" rel="noreferrer">Découvrir Kavelyo</a>
              <a href={KAVELYO_PRICING_URL} target="_blank" rel="noreferrer">Voir les offres</a>
            </div>
            <div className="rg-kavelyo__status"><i /> Disponible en ligne</div>
          </div>

          <figure className="rg-kavelyo__hero-visual">
            <img
              src={ASSETS.home}
              alt="Page d’accueil de Kavelyo présentant son identité visuelle et son accès à la plateforme"
              width="2000"
              height="1063"
              fetchPriority="high"
            />
          </figure>
        </section>

        <section className="rg-kavelyo__intro" id="decouvrir">
          <div>
            <span className="rg-kavelyo__eyebrow">Le produit</span>
            <h2>Du cadrage initial à la clôture du projet.</h2>
          </div>
          <div className="rg-kavelyo__intro-copy">
            <p>
              Kavelyo accompagne les chefs de projet et leurs équipes depuis le cadrage initial
              jusqu’à la clôture. La plateforme permet de gérer plusieurs projets, d’organiser les
              tâches, de construire un backlog, de préparer les sprints et de suivre les risques,
              les coûts, les fournisseurs, les réunions et les décisions.
            </p>
            <p>
              Chaque organisation peut créer son espace, inviter ses collaborateurs, attribuer
              des rôles et suivre l’avancement en temps réel, en mode prédictif, Agile/Scrum ou
              hybride. Chaque collaborateur dispose de son propre compte et de ses autorisations :
              aucun membre ne partage le mot de passe du chef de projet.
            </p>
            <p>
              Les couleurs, le logo et l’environnement de travail sont personnalisables par projet.
              Les commentaires, mentions, notifications et résumés automatiques facilitent la
              circulation de l’information dans un espace sécurisé.
            </p>
            <p className="rg-kavelyo__ownership">
              Kavelyo est une solution conçue et développée par <a href="https://www.ronnagroup.net">Ronna Group</a>.
            </p>
          </div>
        </section>

        <section className="rg-kavelyo__showcase">
          <div className="rg-kavelyo__section-head">
            <span className="rg-kavelyo__eyebrow">Vision d’ensemble</span>
            <h2>Les signaux essentiels pour décider avec clarté.</h2>
            <p>Progression, échéances, budgets, risques et santé du projet sont réunis dans un tableau de bord lisible.</p>
          </div>
          <figure className="rg-kavelyo__frame rg-kavelyo__frame--large">
            <img
              src={ASSETS.dashboard}
              alt="Tableau de bord sombre de Kavelyo avec indicateurs de progression, budget, risques et trajectoire du projet"
              width="2000"
              height="1083"
              loading="lazy"
            />
          </figure>
        </section>

        <section className="rg-kavelyo__hybrid">
          <div className="rg-kavelyo__hybrid-copy">
            <span className="rg-kavelyo__eyebrow">Pilotage hybride</span>
            <h2>La rigueur du prédictif. La souplesse de l’Agile.</h2>
            <p>
              Kavelyo permet d’adapter la méthode au projet sans fragmenter les informations.
              Les jalons, activités, user stories, responsabilités et décisions restent reliés.
            </p>
            <div className="rg-kavelyo__mode-list">
              <article><strong>Prédictif</strong><span>Planning, dates, dépendances et jalons.</span></article>
              <article><strong>Agile</strong><span>Backlog, sprints, Kanban et rituels Scrum.</span></article>
              <article><strong>Hybride</strong><span>Une trajectoire commune entre les deux approches.</span></article>
            </div>
          </div>
          <figure className="rg-kavelyo__frame">
            <img
              src={ASSETS.scrum}
              alt="Espace Scrum de Kavelyo avec objectif produit, tableau, backlog, événements et création de sprint"
              width="2000"
              height="1083"
              loading="lazy"
            />
          </figure>
        </section>

        <section className="rg-kavelyo__capabilities">
          <div className="rg-kavelyo__section-head rg-kavelyo__section-head--light">
            <span className="rg-kavelyo__eyebrow">Fonctionnalités</span>
            <h2>Un poste de pilotage complet.</h2>
            <p>Les dimensions techniques, humaines, financières et organisationnelles restent visibles dans le même environnement.</p>
          </div>
          <div className="rg-kavelyo__capability-grid">
            {CAPABILITIES.map((capability) => (
              <article key={capability.title}>
                <h3>{capability.title}</h3>
                <p>{capability.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rg-kavelyo__beyond">
          <div className="rg-kavelyo__section-head">
            <span className="rg-kavelyo__eyebrow">Au-delà des tâches</span>
            <h2>Fournisseurs, contrats et engagements restent reliés au projet.</h2>
          </div>
          <figure className="rg-kavelyo__frame rg-kavelyo__frame--large">
            <img
              src={ASSETS.suppliers}
              alt="Module Fournisseurs et Achats de Kavelyo avec synthèse, consultations, offres, contrats et évaluations"
              width="2000"
              height="1089"
              loading="lazy"
            />
          </figure>
        </section>

        <section className="rg-kavelyo__impact">
          <div>
            <span className="rg-kavelyo__eyebrow">Ce qui différencie Kavelyo</span>
            <h2>Comprendre les conséquences, pas seulement suivre les tâches.</h2>
          </div>
          <div>
            <p>
              La chaîne d’impact permet de visualiser comment une décision, un retard,
              un risque, une dépense ou un fournisseur influence les autres éléments du projet.
            </p>
            <div className="rg-kavelyo__impact-flow" aria-label="Éléments reliés par la chaîne d’impact">
              <span>Décisions</span><span>Délais</span><span>Risques</span><span>Coûts</span><span>Livrables</span>
            </div>
          </div>
        </section>

        <section className="rg-kavelyo__gallery">
          <div className="rg-kavelyo__section-head">
            <span className="rg-kavelyo__eyebrow">Une expérience cohérente</span>
            <h2>De la connexion à l’administration de l’espace.</h2>
          </div>
          <div className="rg-kavelyo__gallery-grid">
            <figure className="rg-kavelyo__frame rg-kavelyo__frame--wide">
              <img
                src={ASSETS.login}
                alt="Écran de connexion de Kavelyo avec présentation du produit et accès au mode aperçu"
                width="2000"
                height="1081"
                loading="lazy"
              />
            </figure>
            <figure className="rg-kavelyo__frame rg-kavelyo__frame--wide">
              <img
                src={ASSETS.workspace}
                alt="Administration d’un espace de travail Kavelyo avec membres, projets et offres professionnelles"
                width="2000"
                height="1090"
                loading="lazy"
              />
            </figure>
          </div>
        </section>

        <section className="rg-kavelyo__audience">
          <div>
            <span className="rg-kavelyo__eyebrow">Pour qui ?</span>
            <h2>Conçu pour les équipes qui doivent avancer ensemble.</h2>
          </div>
          <div className="rg-kavelyo__audience-list">
            {AUDIENCES.map((audience) => <span key={audience}>{audience}</span>)}
          </div>
        </section>

        <section className="rg-kavelyo__pricing" id="offres">
          <div className="rg-kavelyo__pricing-head">
            <span className="rg-kavelyo__eyebrow">Offres professionnelles</span>
            <h2>Une offre adaptée à chaque façon de piloter.</h2>
            <p>Commencez gratuitement, puis faites évoluer votre espace selon le nombre de projets, de membres et vos besoins d’administration.</p>
          </div>
          <div className="rg-kavelyo__pricing-grid">
            {PLANS.map((plan) => (
              <article className={`rg-kavelyo__plan${plan.featured ? " rg-kavelyo__plan--featured" : ""}`} key={plan.name}>
                {plan.featured && <span className="rg-kavelyo__plan-label">Pour les équipes</span>}
                <h3>{plan.name}</h3>
                <p className="rg-kavelyo__plan-audience">{plan.audience}</p>
                <div className="rg-kavelyo__plan-price">
                  <strong>{plan.price}</strong>
                  {plan.period && <span>{plan.period}</span>}
                </div>
                {plan.annual && <p className="rg-kavelyo__plan-annual">{plan.annual}</p>}
                <ul>
                  {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <a className="rg-kavelyo__plan-cta" href={KAVELYO_PRICING_URL} target="_blank" rel="noreferrer">{plan.cta}</a>
              </article>
            ))}
          </div>
          <div className="rg-kavelyo__pricing-notes">
            <p>Les offres annuelles correspondent à dix mois facturés, soit deux mois offerts.</p>
            <p>Les observateurs en lecture seule et les fournisseurs externes ne consomment pas de siège payant.</p>
            <small>Applications de bureau bientôt disponibles.</small>
          </div>
        </section>

        <section className="rg-kavelyo__cta">
          <div>
            <span className="rg-kavelyo__eyebrow">Passez à l’action</span>
            <h2>Donnez à vos projets un cadre clair, une équipe alignée et des décisions traçables.</h2>
            <p>Créez votre espace, configurez votre premier projet et invitez votre équipe.</p>
          </div>
          <a href={KAVELYO_URL} target="_blank" rel="noreferrer">Commencer avec Kavelyo</a>
        </section>
      </main>
      <style>{css}</style>
    </>
  );
}

const css = `
.rg-kavelyo{--violet:#1556ff;--violet-soft:#78a6ff;--cyan:#ff8a1f;--ink:#070d20;--panel:#101936;min-height:100vh;padding-top:110px;overflow:hidden;color:#fff;background:#070d20}.rg-kavelyo *{box-sizing:border-box;min-width:0}.rg-kavelyo a{text-decoration:none}.rg-kavelyo__eyebrow{display:block;color:#78a6ff;font-size:13px;font-weight:850;letter-spacing:1.5px;text-transform:uppercase}
.rg-kavelyo__hero{max-width:1280px;margin:0 auto;padding:68px 28px 86px;display:grid;grid-template-columns:minmax(360px,.82fr) minmax(0,1.18fr);gap:48px;align-items:center}.rg-kavelyo__back{display:inline-flex;margin-bottom:35px;color:rgba(255,255,255,.64);font-size:14px;font-weight:750}.rg-kavelyo__back:hover{color:#fff}.rg-kavelyo__brand{margin:18px 0 6px;display:flex;align-items:center;gap:18px}.rg-kavelyo__brand>img{width:72px;height:72px;flex:0 0 auto;object-fit:contain}.rg-kavelyo__hero h1{margin:0;font-size:clamp(64px,7vw,96px);line-height:.9;letter-spacing:-5px}.rg-kavelyo__brand p{margin:12px 0 0;color:#78a6ff;font-size:16px;font-weight:800;letter-spacing:.3px}.rg-kavelyo__hero h2{max-width:590px;margin:24px 0 18px;font-size:clamp(31px,4vw,51px);line-height:1.04;letter-spacing:-1.8px}.rg-kavelyo__hero-copy>p{max-width:590px;margin:0;color:rgba(255,255,255,.68);font-size:17px;line-height:1.72}.rg-kavelyo__hero-actions{margin-top:30px;display:flex;gap:10px;flex-wrap:wrap}.rg-kavelyo__hero-actions a,.rg-kavelyo__plan-cta,.rg-kavelyo__cta>a{min-height:48px;padding:0 20px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.14);border-radius:12px;background:linear-gradient(135deg,#1266ff,#0a49c8);color:#fff;font-size:15px;font-weight:800}.rg-kavelyo__hero-actions a:nth-child(2){background:rgba(255,255,255,.04)}.rg-kavelyo__hero-actions a:nth-child(3){border-color:rgba(255,138,31,.52);background:rgba(255,138,31,.1);color:#ffbd7b}.rg-kavelyo__status{margin-top:20px;display:flex;align-items:center;gap:9px;color:rgba(255,255,255,.64);font-size:14px}.rg-kavelyo__status i{width:8px;height:8px;border-radius:50%;background:#50d6a5;box-shadow:0 0 0 5px rgba(80,214,165,.11)}.rg-kavelyo__hero-visual{aspect-ratio:16/9;margin:0;display:grid;place-items:center;overflow:hidden;border:1px solid rgba(255,255,255,.13);border-radius:20px;background:#101936;box-shadow:0 36px 100px rgba(0,0,0,.42);transform:perspective(1400px) rotateY(-3deg)}.rg-kavelyo__hero-visual img,.rg-kavelyo__frame img{width:100%;height:100%;display:block;object-fit:cover}
.rg-kavelyo__intro{padding:82px max(28px,calc((100vw - 1120px)/2));display:grid;grid-template-columns:.9fr 1.1fr;gap:90px;background:#f5f7fb;color:#11182d}.rg-kavelyo__intro .rg-kavelyo__eyebrow,.rg-kavelyo__capabilities .rg-kavelyo__eyebrow{color:#154fd1}.rg-kavelyo__intro h2,.rg-kavelyo__showcase h2,.rg-kavelyo__hybrid h2,.rg-kavelyo__capabilities h2,.rg-kavelyo__beyond h2,.rg-kavelyo__impact h2,.rg-kavelyo__gallery h2,.rg-kavelyo__audience h2,.rg-kavelyo__pricing h2,.rg-kavelyo__cta h2{margin:12px 0 0;font-size:clamp(34px,4.5vw,54px);line-height:1.05;letter-spacing:-1.8px}.rg-kavelyo__intro-copy{display:grid;gap:14px}.rg-kavelyo__intro-copy p{margin:0;color:#4e596f;font-size:17px;line-height:1.75}.rg-kavelyo__ownership{padding-top:8px;border-top:1px solid #dde2ec}.rg-kavelyo__ownership a{color:#0a49c8;font-weight:800}
.rg-kavelyo__showcase,.rg-kavelyo__beyond,.rg-kavelyo__gallery{padding:90px 28px}.rg-kavelyo__section-head{max-width:820px;margin:0 auto 38px;text-align:center}.rg-kavelyo__section-head>p{max-width:680px;margin:16px auto 0;color:rgba(255,255,255,.62);font-size:17px;line-height:1.7}.rg-kavelyo__frame{margin:0;overflow:hidden;border:1px solid rgba(255,255,255,.13);border-radius:18px;background:#111936;box-shadow:0 30px 90px rgba(0,0,0,.3)}.rg-kavelyo__frame--large{max-width:1200px;aspect-ratio:16/8.8;margin:0 auto}.rg-kavelyo__hybrid{max-width:1200px;margin:0 auto;padding:90px 28px;display:grid;grid-template-columns:minmax(330px,.78fr) minmax(0,1.22fr);gap:54px;align-items:center;border-top:1px solid rgba(255,255,255,.09)}.rg-kavelyo__hybrid-copy>p{margin:18px 0 0;color:rgba(255,255,255,.64);font-size:17px;line-height:1.75}.rg-kavelyo__hybrid .rg-kavelyo__frame{aspect-ratio:16/9}.rg-kavelyo__mode-list{margin-top:28px;display:grid;gap:10px}.rg-kavelyo__mode-list article{padding:15px 0;display:grid;grid-template-columns:100px 1fr;gap:16px;border-bottom:1px solid rgba(255,255,255,.1)}.rg-kavelyo__mode-list strong{color:#fff;font-size:15px}.rg-kavelyo__mode-list span{color:rgba(255,255,255,.58);font-size:15px;line-height:1.5}
.rg-kavelyo__capabilities{padding:90px max(28px,calc((100vw - 1120px)/2));background:#f5f7fb;color:#11182d}.rg-kavelyo__section-head--light>p{color:#5b667c}.rg-kavelyo__capability-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.rg-kavelyo__capability-grid article{padding:28px 24px;border:1px solid #dde2ed;border-radius:14px;background:#fff}.rg-kavelyo__capability-grid h3{margin:0 0 12px;font-size:20px}.rg-kavelyo__capability-grid p{margin:0;color:#5d687d;font-size:16px;line-height:1.65}.rg-kavelyo__beyond{background:linear-gradient(180deg,#0a1128,#070d20)}
.rg-kavelyo__impact{max-width:1120px;margin:0 auto;padding:90px 28px;display:grid;grid-template-columns:.9fr 1.1fr;gap:80px;border-top:1px solid rgba(255,255,255,.09)}.rg-kavelyo__impact>div:last-child>p{margin:0;color:rgba(255,255,255,.65);font-size:17px;line-height:1.75}.rg-kavelyo__impact-flow{margin-top:25px;display:flex;flex-wrap:wrap;gap:8px}.rg-kavelyo__impact-flow span,.rg-kavelyo__audience-list span{padding:10px 13px;border:1px solid rgba(62,125,255,.24);border-radius:999px;background:rgba(20,93,255,.09);color:#b8ceff;font-size:14px;font-weight:750}.rg-kavelyo__gallery{background:#0a1128}.rg-kavelyo__gallery-grid{max-width:1200px;margin:0 auto;display:grid;gap:18px}.rg-kavelyo__frame--wide{aspect-ratio:16/8.8}.rg-kavelyo__audience{max-width:1120px;margin:0 auto;padding:90px 28px;display:grid;grid-template-columns:.95fr 1.05fr;gap:70px;align-items:center}.rg-kavelyo__audience-list{display:flex;gap:9px;flex-wrap:wrap}.rg-kavelyo__pricing{padding:90px 28px;background:linear-gradient(180deg,#0a1128,#070d20)}.rg-kavelyo__pricing-head{max-width:1120px;margin:0 auto 38px}.rg-kavelyo__pricing-head>p{max-width:760px;margin:16px 0 0;color:rgba(255,255,255,.66);font-size:17px;line-height:1.7}.rg-kavelyo__pricing-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(12,1fr);gap:14px}.rg-kavelyo__plan{position:relative;grid-column:span 4;padding:29px 24px;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:#111936}.rg-kavelyo__plan:nth-child(n+4){grid-column:span 6}.rg-kavelyo__plan--featured{border-color:rgba(62,125,255,.72);box-shadow:0 24px 70px rgba(48,37,151,.22)}.rg-kavelyo__plan-label{width:max-content;margin-bottom:17px;padding:7px 9px;border-radius:999px;background:rgba(20,93,255,.2);color:#b8ceff;font-size:13px;font-weight:800}.rg-kavelyo__plan h3{margin:0;font-size:25px;letter-spacing:-.5px}.rg-kavelyo__plan-audience{min-height:76px;margin:12px 0 22px;color:rgba(255,255,255,.58);font-size:15px;line-height:1.6}.rg-kavelyo__plan-price{min-height:66px;display:flex;align-items:flex-end;gap:8px;flex-wrap:wrap}.rg-kavelyo__plan-price strong{font-size:clamp(28px,3vw,38px);line-height:1}.rg-kavelyo__plan-price span{color:rgba(255,255,255,.5);font-size:14px}.rg-kavelyo__plan-annual{margin:9px 0 0;color:#ffbd7b;font-size:14px;font-weight:750}.rg-kavelyo__plan ul{margin:25px 0 28px;padding:20px 0 0;display:grid;gap:11px;border-top:1px solid rgba(255,255,255,.1);list-style:none}.rg-kavelyo__plan li{position:relative;padding-left:21px;color:rgba(255,255,255,.72);font-size:15px;line-height:1.45}.rg-kavelyo__plan li::before{content:"✓";position:absolute;left:0;color:#ff8a1f;font-weight:900}.rg-kavelyo__plan-cta{width:100%;margin-top:auto;text-align:center}.rg-kavelyo__pricing-notes{max-width:1200px;margin:18px auto 0;padding:21px 23px;border:1px solid rgba(255,138,31,.18);border-radius:14px;background:rgba(255,138,31,.05)}.rg-kavelyo__pricing-notes p{margin:0;color:rgba(255,255,255,.7);font-size:15px;line-height:1.65}.rg-kavelyo__pricing-notes p+p{margin-top:4px}.rg-kavelyo__pricing-notes small{display:block;margin-top:9px;color:rgba(255,255,255,.47);font-size:13px}.rg-kavelyo__cta{max-width:1120px;margin:28px auto 78px;padding:44px 38px;display:flex;align-items:center;justify-content:space-between;gap:45px;border:1px solid rgba(255,255,255,.12);border-radius:20px;background:#111936}.rg-kavelyo__cta>div{max-width:760px}.rg-kavelyo__cta h2{font-size:clamp(30px,4vw,46px)}.rg-kavelyo__cta p{margin:15px 0 0;color:rgba(255,255,255,.62);font-size:17px;line-height:1.65}.rg-kavelyo__cta>a{flex:0 0 auto}
@media(max-width:980px){.rg-kavelyo__hero{grid-template-columns:1fr}.rg-kavelyo__hero-copy{max-width:760px}.rg-kavelyo__hero-visual{max-width:900px;transform:none}.rg-kavelyo__intro,.rg-kavelyo__impact,.rg-kavelyo__audience{grid-template-columns:1fr;gap:34px}.rg-kavelyo__hybrid{grid-template-columns:1fr}.rg-kavelyo__hybrid-copy{max-width:760px}.rg-kavelyo__capability-grid{grid-template-columns:1fr 1fr}.rg-kavelyo__plan,.rg-kavelyo__plan:nth-child(n+4){grid-column:span 6}.rg-kavelyo__cta{margin-inline:28px;align-items:flex-start;flex-direction:column}.rg-kavelyo__cta>a{align-self:stretch}}
@media(max-width:680px){.rg-kavelyo{padding-top:88px}.rg-kavelyo__hero{padding:42px 16px 58px;gap:34px}.rg-kavelyo__back{margin-bottom:29px}.rg-kavelyo__brand{gap:12px}.rg-kavelyo__brand>img{width:54px;height:54px}.rg-kavelyo__hero h1{font-size:56px;letter-spacing:-3px}.rg-kavelyo__brand p{font-size:14px}.rg-kavelyo__hero h2{font-size:34px}.rg-kavelyo__hero-copy>p{font-size:16px}.rg-kavelyo__hero-actions{flex-direction:column}.rg-kavelyo__hero-actions a{width:100%}.rg-kavelyo__hero-visual,.rg-kavelyo__frame{border-radius:12px}.rg-kavelyo__intro{padding:58px 18px}.rg-kavelyo__showcase,.rg-kavelyo__beyond,.rg-kavelyo__gallery{padding:64px 16px}.rg-kavelyo__section-head{text-align:left}.rg-kavelyo__section-head>p{font-size:16px}.rg-kavelyo__hybrid{padding:64px 18px;gap:30px}.rg-kavelyo__mode-list article{grid-template-columns:1fr;gap:5px}.rg-kavelyo__capabilities{padding:64px 18px}.rg-kavelyo__capability-grid{grid-template-columns:1fr}.rg-kavelyo__impact,.rg-kavelyo__audience{padding:64px 18px}.rg-kavelyo__pricing{padding:64px 16px}.rg-kavelyo__plan,.rg-kavelyo__plan:nth-child(n+4){grid-column:span 12}.rg-kavelyo__plan-audience{min-height:0}.rg-kavelyo__cta{margin:22px 18px 58px;padding:30px 22px}.rg-kavelyo__cta>a{width:100%;text-align:center}}
@media(prefers-reduced-motion:reduce){.rg-kavelyo *{scroll-behavior:auto!important;transition:none!important}.rg-kavelyo__hero-visual{transform:none}}
`;
