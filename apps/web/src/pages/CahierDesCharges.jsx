import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import { apiUrl } from "../lib/api.js";
import { trackEvent } from "../lib/analytics.js";

const PROJECT_TYPES = [
  { id: "SITE_VITRINE", label: "Site vitrine", service: "RONNA_WEB", delivery: "3 à 6 semaines" },
  { id: "ECOMMERCE", label: "Site e-commerce", service: "RONNA_WEB", delivery: "6 à 12 semaines" },
  { id: "WEB_APP", label: "Application web", service: "RONNA_DEVELOPPEMENT", delivery: "8 à 16 semaines" },
  { id: "MOBILE_APP", label: "Application mobile", service: "RONNA_DEVELOPPEMENT", delivery: "12 à 24 semaines" },
  { id: "DIGITAL", label: "Projet digital / communication", service: "RONNA_DIGITAL", delivery: "1 à 3 mois" },
  { id: "OTHER", label: "Autre projet", service: "AUTRE", delivery: "À définir" }
];

const OBJECTIVES = ["Présenter l’entreprise", "Générer des prospects", "Vendre en ligne", "Automatiser une activité", "Fidéliser les clients", "Améliorer la visibilité", "Créer un service numérique", "Centraliser des données"];
const FEATURES = ["Formulaire de contact", "Espace d’administration", "Comptes utilisateurs", "Paiement en ligne", "Réservation / commande", "Notifications email / SMS", "Tableau de bord", "Connexion à des outils externes", "Multilingue", "Recherche avancée"];
const BUDGETS = [
  { id: "LT_300K", label: "Moins de 300 000 FCFA" },
  { id: "300K_1M", label: "300 000 à 1 000 000 FCFA" },
  { id: "1M_3M", label: "1 000 000 à 3 000 000 FCFA" },
  { id: "GT_3M", label: "Plus de 3 000 000 FCFA" },
  { id: "UNKNOWN", label: "À définir avec l’équipe" }
];
const TIMELINES = [
  { id: "URGENT_1_2_WEEKS", label: "Très urgent — 1 à 2 semaines" },
  { id: "ONE_MONTH", label: "Sous un mois" },
  { id: "TWO_THREE_MONTHS", label: "Dans 2 à 3 mois" },
  { id: "GT_3_MONTHS", label: "Dans plus de 3 mois" },
  { id: "DISCUSS", label: "À définir" }
];
const CONTACTS = [{ id: "WHATSAPP", label: "WhatsApp" }, { id: "CALL", label: "Appel" }, { id: "EMAIL", label: "Email" }, { id: "MEETING", label: "Rendez-vous" }];

const initialProject = {
  type: "", name: "", company: "", sector: "", context: "", objectives: [], audience: "", features: [], customFeatures: "",
  contentStatus: "À produire", visualStatus: "À créer", adminNeeds: "", integrations: "", budget: "UNKNOWN", timeline: "DISCUSS",
  hosting: "RONNA GROUP gère le domaine, l’hébergement et la mise en ligne", security: "Sécurité et sauvegardes standards", maintenance: "À définir avec l’équipe"
};

function optionLabel(options, value) {
  return options.find((item) => item.id === value)?.label || "À définir";
}

export default function CahierDesCharges() {
  const [step, setStep] = useState(1);
  const [project, setProject] = useState(initialProject);
  const [lead, setLead] = useState({ fullName: "", email: "", phone: "", role: "", preferredContact: "WHATSAPP", consent: false, honeypot: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const projectType = PROJECT_TYPES.find((item) => item.id === project.type);
  const completion = useMemo(() => {
    const values = [project.type, project.name, project.company, project.sector, project.context, project.audience];
    return Math.round((values.filter(Boolean).length / values.length) * 100);
  }, [project]);

  function toggle(field, value) {
    setProject((current) => ({ ...current, [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value] }));
  }

  function next(value) {
    setStep(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const documentText = useMemo(() => [
    `CAHIER DES CHARGES — ${project.name || "PROJET À NOMMER"}`,
    `Entreprise : ${project.company || "À préciser"}`,
    `Secteur : ${project.sector || "À préciser"}`,
    `Type : ${projectType?.label || "À préciser"}`,
    "",
    "1. CONTEXTE ET BESOIN",
    project.context || "Le contexte détaillé sera précisé pendant le cadrage.",
    "",
    "2. OBJECTIFS",
    project.objectives.length ? project.objectives.map((item) => `- ${item}`).join("\n") : "- Objectifs à préciser avec l’équipe RONNA GROUP",
    "",
    "3. UTILISATEURS CIBLES",
    project.audience || "Public cible à préciser.",
    "",
    "4. FONCTIONNALITÉS",
    project.features.length ? project.features.map((item) => `- ${item}`).join("\n") : "- Base essentielle du projet",
    project.customFeatures ? `- Besoins complémentaires : ${project.customFeatures}` : "",
    project.adminNeeds ? `- Administration : ${project.adminNeeds}` : "",
    project.integrations ? `- Connexions externes : ${project.integrations}` : "",
    "",
    "5. CONTENUS ET IDENTITÉ VISUELLE",
    `Contenus : ${project.contentStatus}. Identité visuelle : ${project.visualStatus}.`,
    "",
    "6. INFRASTRUCTURE ET SÉCURITÉ",
    `${project.hosting}. ${project.security}. Maintenance : ${project.maintenance}.`,
    "",
    "7. BUDGET ET CALENDRIER",
    `Budget envisagé : ${optionLabel(BUDGETS, project.budget)}. Délai souhaité : ${optionLabel(TIMELINES, project.timeline)}. Durée indicative après cadrage : ${projectType?.delivery || "à définir"}.`,
    "",
    "8. PROCHAINES ÉTAPES",
    "Validation du besoin, atelier de cadrage, proposition technique et financière, planification, réalisation, tests, mise en ligne et accompagnement.",
    "",
    "Document préparatoire généré par RONNA GROUP. Le périmètre et les conditions définitives seront confirmés dans une proposition commerciale."
  ].filter(Boolean).join("\n"), [project, projectType]);

  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "DEVIS", fullName: lead.fullName, email: lead.email, phone: lead.phone, company: project.company, role: lead.role,
          service: projectType.service, subject: `Cahier des charges — ${project.name} — ${project.company}`, message: documentText.slice(0, 4000),
          budgetRange: project.budget, timeline: project.timeline, preferredContact: lead.preferredContact, consent: lead.consent, honeypot: lead.honeypot
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.ok === false) throw new Error(data?.message || "Impossible de transmettre le document.");
      trackEvent("quote_submitted", "/cahier-des-charges");
      setSent(true);
    } catch (submissionError) {
      setError(submissionError?.message || "Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  }

  return <>
    <SEO title="Cahier des charges Express | Ronna Group" description="Créez gratuitement le cahier des charges de votre site ou application et transmettez-le à Ronna Group." canonical="https://www.ronnagroup.net/cahier-des-charges" />
    <main className="rg-spec">
      <header className="rg-spec__hero">
        <div><span>Outil gratuit • 5 minutes</span><h1>Créez votre cahier des charges.</h1><p>Structurez votre idée, clarifiez vos besoins et obtenez un document professionnel prêt à télécharger ou à transmettre.</p></div>
        <div className="rg-spec__benefits"><strong>Sans IA payante</strong><span>génération immédiate</span><strong>Confidentiel</strong><span>vous contrôlez l’envoi</span><strong>Professionnel</strong><span>document structuré</span></div>
      </header>

      {step < 4 && <div className="rg-spec__progress"><div><span>Étape {step} sur 3</span><strong>{step === 1 ? completion : step === 2 ? 67 : 100}%</strong></div><i><b style={{ width: `${step === 1 ? 33 : step === 2 ? 67 : 100}%` }} /></i></div>}

      {step === 1 && <section className="rg-spec__panel">
        <div className="rg-spec__heading"><span>Votre projet</span><h2>Commençons par l’essentiel.</h2><p>Ces informations donnent au document son contexte et sa direction.</p></div>
        <div className="rg-spec__types">{PROJECT_TYPES.map((item) => <button type="button" key={item.id} onClick={() => setProject({ ...project, type: item.id })} className={project.type === item.id ? "selected" : ""}><i>{String(PROJECT_TYPES.indexOf(item) + 1).padStart(2, "0")}</i><strong>{item.label}</strong><span>{item.delivery}</span></button>)}</div>
        <div className="rg-spec__fields">
          <label><span>Nom du projet</span><input value={project.name} onChange={(e) => setProject({ ...project, name: e.target.value })} placeholder="Ex. Plateforme de réservation" /></label>
          <label><span>Entreprise / organisation</span><input value={project.company} onChange={(e) => setProject({ ...project, company: e.target.value })} placeholder="Nom de l’entreprise" /></label>
          <label><span>Secteur d’activité</span><input value={project.sector} onChange={(e) => setProject({ ...project, sector: e.target.value })} placeholder="Ex. Commerce, restauration, éducation…" /></label>
          <label className="wide"><span>Contexte et problème à résoudre</span><textarea value={project.context} onChange={(e) => setProject({ ...project, context: e.target.value })} placeholder="Expliquez brièvement la situation actuelle et ce que le projet doit améliorer." /></label>
        </div>
        <div className="rg-spec__nav"><span /><button disabled={!project.type || project.name.trim().length < 2 || project.company.trim().length < 2 || project.sector.trim().length < 2 || project.context.trim().length < 10} onClick={() => next(2)}>Continuer →</button></div>
      </section>}

      {step === 2 && <section className="rg-spec__panel">
        <div className="rg-spec__heading"><span>Objectifs et fonctions</span><h2>Que doit accomplir la solution ?</h2><p>Sélectionnez plusieurs réponses si nécessaire.</p></div>
        <h3 className="rg-spec__label">Objectifs prioritaires</h3><div className="rg-spec__choices">{OBJECTIVES.map((item) => <label key={item} className={project.objectives.includes(item) ? "selected" : ""}><input type="checkbox" checked={project.objectives.includes(item)} onChange={() => toggle("objectives", item)} /><i>{project.objectives.includes(item) ? "✓" : "+"}</i>{item}</label>)}</div>
        <h3 className="rg-spec__label">Fonctionnalités envisagées</h3><div className="rg-spec__choices">{FEATURES.map((item) => <label key={item} className={project.features.includes(item) ? "selected" : ""}><input type="checkbox" checked={project.features.includes(item)} onChange={() => toggle("features", item)} /><i>{project.features.includes(item) ? "✓" : "+"}</i>{item}</label>)}</div>
        <div className="rg-spec__fields">
          <label className="wide"><span>Utilisateurs ciblés</span><input value={project.audience} onChange={(e) => setProject({ ...project, audience: e.target.value })} placeholder="Ex. particuliers à Abidjan, équipes internes, restaurants…" /></label>
          <label className="wide"><span>Autres fonctionnalités <small>(facultatif)</small></span><textarea value={project.customFeatures} onChange={(e) => setProject({ ...project, customFeatures: e.target.value })} placeholder="Décrivez un parcours ou une fonction particulière." /></label>
          <label><span>Besoins d’administration</span><input value={project.adminNeeds} onChange={(e) => setProject({ ...project, adminNeeds: e.target.value })} placeholder="Gestion des contenus, utilisateurs…" /></label>
          <label><span>Outils à connecter</span><input value={project.integrations} onChange={(e) => setProject({ ...project, integrations: e.target.value })} placeholder="Paiement, CRM, WhatsApp…" /></label>
        </div>
        <div className="rg-spec__nav"><button className="secondary" onClick={() => next(1)}>← Retour</button><button disabled={!project.objectives.length || project.audience.trim().length < 2} onClick={() => next(3)}>Continuer →</button></div>
      </section>}

      {step === 3 && <section className="rg-spec__panel">
        <div className="rg-spec__heading"><span>Cadre du projet</span><h2>Contenus, budget et exploitation.</h2><p>Ces choix permettent de produire un document réellement exploitable.</p></div>
        <div className="rg-spec__fields rg-spec__fields--selects">
          <label><span>État des contenus</span><select value={project.contentStatus} onChange={(e) => setProject({ ...project, contentStatus: e.target.value })}><option>Déjà disponibles</option><option>Partiellement disponibles</option><option>À produire</option><option>À définir</option></select></label>
          <label><span>Identité visuelle</span><select value={project.visualStatus} onChange={(e) => setProject({ ...project, visualStatus: e.target.value })}><option>Déjà disponible</option><option>À moderniser</option><option>À créer</option><option>À définir</option></select></label>
          <label><span>Budget envisagé</span><select value={project.budget} onChange={(e) => setProject({ ...project, budget: e.target.value })}>{BUDGETS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <label><span>Délai souhaité</span><select value={project.timeline} onChange={(e) => setProject({ ...project, timeline: e.target.value })}>{TIMELINES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <label><span>Hébergement et domaine</span><select value={project.hosting} onChange={(e) => setProject({ ...project, hosting: e.target.value })}><option>RONNA GROUP gère le domaine, l’hébergement et la mise en ligne</option><option>Infrastructure déjà disponible</option><option>À définir avec l’équipe</option></select></label>
          <label><span>Sécurité</span><select value={project.security} onChange={(e) => setProject({ ...project, security: e.target.value })}><option>Sécurité et sauvegardes standards</option><option>Sécurité renforcée et audit</option><option>Exigences réglementaires particulières</option><option>À définir avec l’équipe</option></select></label>
          <label className="wide"><span>Maintenance après lancement</span><select value={project.maintenance} onChange={(e) => setProject({ ...project, maintenance: e.target.value })}><option>Maintenance mensuelle souhaitée</option><option>Accompagnement ponctuel</option><option>Gestion en interne</option><option>À définir avec l’équipe</option></select></label>
        </div>
        <div className="rg-spec__nav"><button className="secondary" onClick={() => next(2)}>← Retour</button><button onClick={() => next(4)}>Générer mon document →</button></div>
      </section>}

      {step === 4 && <section className="rg-spec__results">
        <div className="rg-spec__document">
          <div className="rg-spec__doc-head"><div><span>RONNA GROUP</span><small>Innovation • Technologie • Impact</small></div><strong>DOCUMENT PRÉPARATOIRE</strong></div>
          <p className="rg-spec__eyebrow">Cahier des charges</p><h1>{project.name}</h1><p className="rg-spec__doc-intro">Préparé pour <strong>{project.company}</strong> • {project.sector}</p>
          <div className="rg-spec__doc-grid">
            <article><span>01</span><h2>Contexte et besoin</h2><p>{project.context}</p></article>
            <article><span>02</span><h2>Objectifs</h2><ul>{project.objectives.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article><span>03</span><h2>Utilisateurs ciblés</h2><p>{project.audience}</p></article>
            <article><span>04</span><h2>Fonctionnalités</h2><ul>{(project.features.length ? project.features : ["Base essentielle du projet"]).map((item) => <li key={item}>{item}</li>)}</ul>{project.customFeatures && <p>{project.customFeatures}</p>}</article>
            <article><span>05</span><h2>Contenus et design</h2><p>Contenus : {project.contentStatus}. Identité visuelle : {project.visualStatus}.</p></article>
            <article><span>06</span><h2>Technique et sécurité</h2><p>{project.hosting}. {project.security}. Maintenance : {project.maintenance}.</p></article>
            <article><span>07</span><h2>Budget et calendrier</h2><p>Budget : {optionLabel(BUDGETS, project.budget)}. Délai : {optionLabel(TIMELINES, project.timeline)}. Durée indicative : {projectType.delivery}.</p></article>
            <article><span>08</span><h2>Prochaines étapes</h2><p>Cadrage, proposition technique et financière, planification, réalisation, tests, mise en ligne et accompagnement.</p></article>
          </div>
          <p className="rg-spec__disclaimer">Ce document prépare le cadrage. Le périmètre, le calendrier et le prix définitifs seront confirmés après échange avec RONNA GROUP.</p>
        </div>

        <div className="rg-spec__actions"><button onClick={() => window.print()}>Télécharger / imprimer en PDF</button><button className="secondary" onClick={() => next(1)}>Modifier mes réponses</button><Link to={`/contact?service=${projectType.service}&subject=${encodeURIComponent(`Échange sur le cahier des charges — ${project.name}`)}`}>Parler à quelqu’un de l’équipe</Link></div>

        <div className="rg-spec__lead">
          {!sent ? <><div><span>Nous transmettre le projet</span><h2>Envoyez ce cahier des charges à notre équipe.</h2><p>Notre équipe recevra le document complet et pourra préparer un premier échange adapté à votre besoin.</p><ul><li>Document enregistré dans votre espace de demandes</li><li>Accusé de réception par email</li><li>Premier échange sans engagement</li></ul></div>
          <form onSubmit={submit}>
            <input required minLength="2" placeholder="Nom et prénom" value={lead.fullName} onChange={(e) => setLead({ ...lead, fullName: e.target.value })} />
            <input required type="email" placeholder="Email professionnel" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
            <input required minLength="6" placeholder="Téléphone / WhatsApp" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
            <input required minLength="2" placeholder="Fonction" value={lead.role} onChange={(e) => setLead({ ...lead, role: e.target.value })} />
            <select value={lead.preferredContact} onChange={(e) => setLead({ ...lead, preferredContact: e.target.value })}>{CONTACTS.map((item) => <option key={item.id} value={item.id}>Me contacter par {item.label}</option>)}</select>
            <input className="rg-spec__trap" tabIndex="-1" autoComplete="off" aria-hidden="true" value={lead.honeypot} onChange={(e) => setLead({ ...lead, honeypot: e.target.value })} />
            <label className="rg-spec__consent"><input required type="checkbox" checked={lead.consent} onChange={(e) => setLead({ ...lead, consent: e.target.checked })} /><span>J’accepte que RONNA GROUP utilise ces informations pour étudier mon projet et me recontacter.</span></label>
            {error && <p className="rg-spec__error">{error}</p>}<button disabled={sending}>{sending ? "Transmission…" : "Nous transmettre le projet →"}</button>
          </form></> : <div className="rg-spec__success"><span>Document transmis</span><h2>Votre cahier des charges a bien été reçu.</h2><p>Un accusé de réception vous a été envoyé. Notre équipe reviendra vers vous rapidement.</p></div>}
        </div>
      </section>}
    </main>
    <style>{css}</style>
  </>;
}

const css = `
.rg-spec{min-height:100vh;padding:110px 18px 78px;color:#fff;background:linear-gradient(180deg,rgba(3,10,26,.98),rgba(5,18,45,.98) 55%,rgba(3,10,26,.98));overflow-x:hidden}.rg-spec *{box-sizing:border-box;min-width:0}.rg-spec__hero,.rg-spec__progress,.rg-spec__panel,.rg-spec__results{max-width:1080px;margin-inline:auto}.rg-spec__hero{padding:48px 0 34px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end}.rg-spec__hero>div>span,.rg-spec__heading>span,.rg-spec__lead>div>span,.rg-spec__success>span{color:#87a9ff;font-size:11px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase}.rg-spec__hero h1{max-width:780px;margin:10px 0 14px;font-size:clamp(40px,6vw,68px);line-height:1;letter-spacing:-2.5px}.rg-spec__hero p{max-width:700px;margin:0;color:rgba(255,255,255,.68);font-size:16px;line-height:1.7}.rg-spec__benefits{display:grid;grid-template-columns:auto auto;gap:6px 12px}.rg-spec__benefits strong{color:#8cafff;font-size:12px}.rg-spec__benefits span{color:rgba(255,255,255,.46);font-size:10px}.rg-spec__progress{position:sticky;z-index:5;top:78px;padding:14px 17px;margin-bottom:16px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:rgba(5,18,45,.94);backdrop-filter:blur(14px)}.rg-spec__progress>div{display:flex;justify-content:space-between;margin-bottom:8px;font-size:11px}.rg-spec__progress span{color:rgba(255,255,255,.55)}.rg-spec__progress i{display:block;height:5px;overflow:hidden;border-radius:99px;background:rgba(255,255,255,.08)}.rg-spec__progress b{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#315fe0,#83a7ff)}.rg-spec__panel{padding:32px;border:1px solid rgba(255,255,255,.1);border-radius:26px;background:rgba(255,255,255,.03)}.rg-spec__heading h2{margin:7px 0 8px;font-size:clamp(26px,4vw,39px);letter-spacing:-.8px}.rg-spec__heading p{margin:0;color:rgba(255,255,255,.58);line-height:1.6}.rg-spec__types{margin-top:23px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.rg-spec__types button{min-height:125px;padding:17px;display:flex;flex-direction:column;align-items:flex-start;border:1px solid rgba(255,255,255,.1);border-radius:17px;background:rgba(3,10,26,.36);color:#fff;text-align:left;cursor:pointer}.rg-spec__types button.selected{border-color:#628bf5;background:rgba(31,79,216,.18)}.rg-spec__types i{color:#87a9ff;font-style:normal;font-size:10px;font-weight:900}.rg-spec__types strong{margin-top:18px;font-size:15px}.rg-spec__types span{margin-top:5px;color:rgba(255,255,255,.45);font-size:10px}.rg-spec__fields{margin-top:22px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.rg-spec__fields label>span{display:block;margin:0 0 7px;color:rgba(255,255,255,.65);font-size:11px;font-weight:750}.rg-spec__fields small{font-weight:400}.rg-spec__fields .wide{grid-column:1/-1}.rg-spec input,.rg-spec textarea,.rg-spec select{width:100%;padding:13px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:#07152f;color:#fff;font:inherit}.rg-spec textarea{min-height:105px;resize:vertical}.rg-spec input::placeholder,.rg-spec textarea::placeholder{color:rgba(255,255,255,.36)}.rg-spec__label{margin:25px 0 10px;color:rgba(255,255,255,.72);font-size:12px;text-transform:uppercase;letter-spacing:.8px}.rg-spec__choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.rg-spec__choices label{padding:13px;display:flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,.1);border-radius:13px;background:rgba(3,10,26,.32);color:rgba(255,255,255,.7);font-size:12px;cursor:pointer}.rg-spec__choices label.selected{border-color:#628bf5;background:rgba(31,79,216,.16);color:#fff}.rg-spec__choices input{position:absolute;opacity:0;width:auto}.rg-spec__choices i{width:23px;height:23px;display:grid;place-items:center;flex:0 0 auto;border:1px solid rgba(255,255,255,.16);border-radius:7px;color:#8eadff;font-style:normal}.rg-spec__nav{margin-top:24px;display:flex;justify-content:space-between;gap:9px}.rg-spec button,.rg-spec__actions a{padding:13px 18px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:#1f4fd8;color:#fff;font:inherit;font-size:12px;font-weight:850;text-decoration:none;cursor:pointer}.rg-spec button.secondary,.rg-spec__actions .secondary{background:rgba(255,255,255,.04)}.rg-spec button:disabled{opacity:.38;cursor:not-allowed}.rg-spec__document{padding:48px;border:1px solid rgba(112,149,244,.25);border-radius:26px;background:#f7f9fd;color:#0c1830}.rg-spec__doc-head{padding-bottom:20px;display:flex;justify-content:space-between;gap:20px;border-bottom:1px solid #d9dfeb}.rg-spec__doc-head span,.rg-spec__doc-head small{display:block}.rg-spec__doc-head span{font-weight:900;letter-spacing:2px}.rg-spec__doc-head small{margin-top:4px;color:#667085;font-size:9px}.rg-spec__doc-head>strong{color:#315fd8;font-size:10px;letter-spacing:1px}.rg-spec__eyebrow{margin:42px 0 8px;color:#315fd8;font-size:11px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase}.rg-spec__document>h1{margin:0;font-size:clamp(35px,5vw,58px);line-height:1;letter-spacing:-2px}.rg-spec__doc-intro{margin:13px 0 0;color:#667085}.rg-spec__doc-grid{margin-top:38px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.rg-spec__doc-grid article{padding:20px;border:1px solid #dfe4ee;border-radius:15px;background:#fff}.rg-spec__doc-grid article>span{color:#315fd8;font-size:9px;font-weight:900}.rg-spec__doc-grid h2{margin:10px 0 8px;font-size:17px}.rg-spec__doc-grid p,.rg-spec__doc-grid li{color:#4b5567;font-size:11px;line-height:1.65}.rg-spec__doc-grid p{margin:0}.rg-spec__doc-grid ul{padding-left:17px;margin:0}.rg-spec__disclaimer{margin:20px 0 0;padding-top:18px;border-top:1px solid #d9dfeb;color:#667085;font-size:9px;line-height:1.6}.rg-spec__actions{margin-top:14px;display:flex;gap:8px;flex-wrap:wrap}.rg-spec__actions a{background:rgba(255,255,255,.04)}.rg-spec__lead{margin-top:15px;padding:30px;display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:34px;border:1px solid rgba(112,149,244,.25);border-radius:24px;background:linear-gradient(120deg,rgba(31,79,216,.13),rgba(255,255,255,.025))}.rg-spec__lead h2{margin:9px 0;font-size:29px}.rg-spec__lead>div>p,.rg-spec__success p{margin:0;color:rgba(255,255,255,.62);font-size:13px;line-height:1.7}.rg-spec__lead ul{padding:0;margin:16px 0 0;display:grid;gap:7px;list-style:none;color:rgba(255,255,255,.6);font-size:11px}.rg-spec__lead li:before{content:'✓';margin-right:8px;color:#84a7ff}.rg-spec__lead form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.rg-spec__lead form>select,.rg-spec__consent,.rg-spec__lead form>button,.rg-spec__error{grid-column:1/-1}.rg-spec__consent{display:flex;gap:8px;color:rgba(255,255,255,.6);font-size:10px;line-height:1.5}.rg-spec__consent input{width:auto;margin-top:2px;accent-color:#527cf0}.rg-spec__trap{position:absolute!important;left:-9999px!important}.rg-spec__error{margin:0;color:#ffa3a3;font-size:11px}.rg-spec__success{grid-column:1/-1;padding:18px;text-align:center}.rg-spec__success h2{margin:9px 0}
@media(max-width:760px){.rg-spec{padding:88px 12px 68px}.rg-spec__hero{padding:35px 4px 27px;grid-template-columns:1fr}.rg-spec__hero h1{letter-spacing:-1.5px}.rg-spec__benefits{grid-template-columns:auto 1fr}.rg-spec__progress{top:69px}.rg-spec__panel{padding:22px 15px}.rg-spec__types{grid-template-columns:1fr 1fr}.rg-spec__types button{min-height:115px}.rg-spec__fields,.rg-spec__choices,.rg-spec__doc-grid,.rg-spec__lead,.rg-spec__lead form{grid-template-columns:1fr}.rg-spec__fields>*{grid-column:1!important}.rg-spec__nav button{flex:1}.rg-spec__document{padding:28px 17px}.rg-spec__doc-head{align-items:flex-start;flex-direction:column}.rg-spec__actions{display:grid}.rg-spec__actions>*{text-align:center}.rg-spec__lead{padding:22px 15px}.rg-spec__lead form>*{grid-column:1!important}}
@media print{body{background:#fff!important}.rg-spec{padding:0;background:#fff;color:#111}.rg-spec__hero,.rg-spec__progress,.rg-spec__actions,.rg-spec__lead,.rg-footer,header[role=banner]{display:none!important}.rg-spec__results{max-width:none}.rg-spec__document{padding:20px;border:0;border-radius:0}.rg-spec__doc-grid{gap:8px}.rg-spec__doc-grid article{break-inside:avoid}}
`;
