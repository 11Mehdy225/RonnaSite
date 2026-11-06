import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import { apiUrl } from "../lib/api.js";
import { trackEvent } from "../lib/analytics.js";

const MATURITY = [
  { value: 0, label: "Principalement manuel" },
  { value: 1, label: "Quelques outils isolés" },
  { value: 2, label: "Processus partiellement structurés" },
  { value: 3, label: "Organisation déjà digitalisée" }
];

const OBJECTIVES = [
  { id: "sales", label: "Développer les ventes" },
  { id: "visibility", label: "Améliorer la visibilité" },
  { id: "operations", label: "Automatiser les opérations" },
  { id: "customer", label: "Améliorer l’expérience client" },
  { id: "data", label: "Mieux exploiter les données" },
  { id: "security", label: "Renforcer la sécurité" },
  { id: "collaboration", label: "Fluidifier le travail d’équipe" },
  { id: "innovation", label: "Lancer de nouveaux services" }
];

const PRIORITIES = [
  { id: "website", label: "Site et présence en ligne" },
  { id: "crm", label: "Prospection et relation client" },
  { id: "workflow", label: "Processus internes" },
  { id: "analytics", label: "Données et pilotage" },
  { id: "security", label: "Sécurité et sauvegardes" },
  { id: "skills", label: "Compétences des équipes" }
];

const BUDGETS = [
  { id: "LT_300K", label: "Moins de 300 000 FCFA" },
  { id: "300K_1M", label: "300 000 à 1 000 000 FCFA" },
  { id: "1M_3M", label: "1 000 000 à 3 000 000 FCFA" },
  { id: "GT_3M", label: "Plus de 3 000 000 FCFA" },
  { id: "UNKNOWN", label: "À définir" }
];

const CONTACTS = [
  { id: "WHATSAPP", label: "WhatsApp" },
  { id: "CALL", label: "Appel" },
  { id: "EMAIL", label: "Email" },
  { id: "MEETING", label: "Rendez-vous" }
];

const ADVICE = {
  sales: "Structurer l’acquisition, le suivi des opportunités et les relances commerciales.",
  visibility: "Clarifier le positionnement, renforcer les contenus et mesurer les canaux d’acquisition.",
  operations: "Cartographier les tâches répétitives puis automatiser les flux les plus rentables.",
  customer: "Unifier les points de contact et réduire les délais de réponse aux clients.",
  data: "Définir des indicateurs fiables et un tableau de bord simple pour les décisions.",
  security: "Sécuriser les accès, les sauvegardes et la continuité de l’activité.",
  collaboration: "Centraliser documents, responsabilités et suivi des projets.",
  innovation: "Tester un service numérique pilote avant d’investir dans un déploiement complet."
};

function labelOf(list, id) {
  return list.find((item) => item.id === id)?.label || "À définir";
}

export default function PlanTransformation() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    company: "", sector: "", teamSize: "1 à 10 personnes", maturity: null, objectives: [], priorities: [],
    budget: "UNKNOWN", horizon: "SIX_MONTHS", sponsor: "", constraints: ""
  });
  const [lead, setLead] = useState({ fullName: "", email: "", phone: "", role: "", preferredContact: "WHATSAPP", consent: false, honeypot: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function toggle(field, id, max = 8) {
    setData((current) => {
      const values = current[field];
      if (values.includes(id)) return { ...current, [field]: values.filter((value) => value !== id) };
      if (values.length >= max) return current;
      return { ...current, [field]: [...values, id] };
    });
  }

  function go(value) {
    setStep(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const roadmap = useMemo(() => {
    const focus = data.objectives.slice(0, 3);
    const selectedPriorities = data.priorities.slice(0, 3);
    const quickActions = [
      "Nommer un responsable et valider les objectifs mesurables.",
      selectedPriorities[0] ? `Auditer le chantier « ${labelOf(PRIORITIES, selectedPriorities[0])} » et définir un premier périmètre.` : "Cartographier les processus, les outils et les irritants actuels.",
      "Installer un tableau de bord de départ et une routine de suivi bimensuelle."
    ];
    const phases = data.horizon === "NINETY_DAYS" ? [
      { period: "Jours 1–30", title: "Cadrer et sécuriser", text: "État des lieux, objectifs, responsabilités, données critiques et choix du chantier pilote." },
      { period: "Jours 31–60", title: "Tester une solution pilote", text: `Mise en œuvre d’un premier cas d’usage autour de ${labelOf(PRIORITIES, selectedPriorities[0])}. Formation des utilisateurs concernés.` },
      { period: "Jours 61–90", title: "Mesurer et généraliser", text: "Analyse des résultats, corrections, documentation puis décision de déploiement à plus grande échelle." }
    ] : [
      { period: "Mois 1–2", title: "Diagnostic et fondations", text: "Cartographie, gouvernance, sécurité essentielle, indicateurs et priorisation du portefeuille." },
      { period: "Mois 3–4", title: "Premiers gains visibles", text: `Pilote opérationnel sur ${labelOf(PRIORITIES, selectedPriorities[0])}, accompagnement des équipes et mesure des résultats.` },
      { period: "Mois 5–6", title: "Déploiement structuré", text: "Extension des pratiques validées, intégration des outils et standardisation des processus." },
      { period: "Mois 7–12", title: "Optimisation continue", text: "Automatisations avancées, amélioration par la donnée et lancement de nouveaux cas d’usage." }
    ];
    return {
      focus,
      quickActions,
      phases,
      kpis: ["Taux d’adoption des outils", "Temps économisé par processus", "Nombre de prospects qualifiés", "Délai moyen de traitement", "Incidents et disponibilité des données"],
      governance: `Un sponsor (${data.sponsor || "à nommer"}), un responsable opérationnel et un point de pilotage toutes les deux semaines.`
    };
  }, [data]);

  const reportText = useMemo(() => [
    `PLAN DE TRANSFORMATION NUMÉRIQUE — ${data.company}`,
    `Secteur : ${data.sector} | Équipe : ${data.teamSize}`,
    `Maturité déclarée : ${MATURITY.find((item) => item.value === data.maturity)?.label || "À préciser"}`,
    `Budget envisagé : ${labelOf(BUDGETS, data.budget)}`,
    "",
    "OBJECTIFS PRIORITAIRES",
    ...roadmap.focus.map((id) => `- ${labelOf(OBJECTIVES, id)} : ${ADVICE[id]}`),
    "",
    "ACTIONS IMMÉDIATES",
    ...roadmap.quickActions.map((item, index) => `${index + 1}. ${item}`),
    "",
    "FEUILLE DE ROUTE",
    ...roadmap.phases.map((phase) => `${phase.period} — ${phase.title} : ${phase.text}`),
    "",
    "INDICATEURS",
    ...roadmap.kpis.map((item) => `- ${item}`),
    "",
    `GOUVERNANCE : ${roadmap.governance}`,
    data.constraints ? `Contraintes signalées : ${data.constraints}` : "",
    "",
    "Plan indicatif à confirmer lors d’un atelier de cadrage avec RONNA GROUP."
  ].filter(Boolean).join("\n"), [data, roadmap]);

  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "DEVIS", fullName: lead.fullName, email: lead.email, phone: lead.phone, company: data.company, role: lead.role,
          service: "RONNA_CONSEIL_MANAGEMENT", subject: `Plan de transformation — ${data.company}`, message: reportText.slice(0, 4000),
          budgetRange: data.budget, timeline: data.horizon === "NINETY_DAYS" ? "ONE_MONTH" : "TWO_THREE_MONTHS",
          preferredContact: lead.preferredContact, consent: lead.consent, honeypot: lead.honeypot
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result?.ok === false) throw new Error(result?.message || "Impossible de transmettre le plan.");
      trackEvent("quote_submitted", "/plan-transformation");
      setSent(true);
    } catch (submissionError) {
      setError(submissionError?.message || "Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  }

  return <>
    <SEO title="Plan de transformation numérique | Ronna Group" description="Générez gratuitement une feuille de route numérique priorisée pour votre entreprise." canonical="https://www.ronnagroup.net/plan-transformation" />
    <main className="rg-plan">
      <header className="rg-plan__hero"><div><span>Outil gratuit • 5 minutes</span><h1>Construisez votre plan de transformation numérique.</h1><p>Définissez vos priorités et obtenez une feuille de route concrète, des premières actions jusqu’au pilotage des résultats.</p></div><div className="rg-plan__promise"><strong>Priorisé</strong><span>selon vos objectifs</span><strong>Actionnable</strong><span>phases et indicateurs</span><strong>Immédiat</strong><span>sans engagement</span></div></header>

      {step < 4 && <div className="rg-plan__progress"><span>Étape {step} sur 3</span><i><b style={{ width: `${step * 33.34}%` }} /></i></div>}

      {step === 1 && <section className="rg-plan__panel"><div className="rg-plan__heading"><span>Votre organisation</span><h2>Où en êtes-vous aujourd’hui ?</h2><p>Quelques informations suffisent pour adapter la feuille de route.</p></div>
        <div className="rg-plan__fields"><label><span>Entreprise</span><input value={data.company} onChange={(e) => setData({ ...data, company: e.target.value })} placeholder="Nom de l’entreprise" /></label><label><span>Secteur</span><input value={data.sector} onChange={(e) => setData({ ...data, sector: e.target.value })} placeholder="Secteur d’activité" /></label><label><span>Taille de l’équipe</span><select value={data.teamSize} onChange={(e) => setData({ ...data, teamSize: e.target.value })}><option>1 à 10 personnes</option><option>11 à 50 personnes</option><option>51 à 200 personnes</option><option>Plus de 200 personnes</option></select></label><label><span>Sponsor ou responsable pressenti</span><input value={data.sponsor} onChange={(e) => setData({ ...data, sponsor: e.target.value })} placeholder="Nom, fonction ou à définir" /></label></div>
        <h3 className="rg-plan__label">Niveau numérique actuel</h3><div className="rg-plan__options">{MATURITY.map((item) => <button type="button" key={item.value} className={data.maturity === item.value ? "selected" : ""} onClick={() => setData({ ...data, maturity: item.value })}><i>0{item.value + 1}</i>{item.label}</button>)}</div>
        <div className="rg-plan__nav"><span /><button disabled={data.company.trim().length < 2 || data.sector.trim().length < 2 || data.maturity === null} onClick={() => go(2)}>Continuer →</button></div>
      </section>}

      {step === 2 && <section className="rg-plan__panel"><div className="rg-plan__heading"><span>Ambitions et priorités</span><h2>Quels résultats recherchez-vous ?</h2><p>Choisissez jusqu’à trois objectifs et trois chantiers prioritaires.</p></div>
        <h3 className="rg-plan__label">Objectifs stratégiques</h3><div className="rg-plan__checks">{OBJECTIVES.map((item) => <label key={item.id} className={data.objectives.includes(item.id) ? "selected" : ""}><input type="checkbox" checked={data.objectives.includes(item.id)} onChange={() => toggle("objectives", item.id, 3)} /><i>{data.objectives.includes(item.id) ? "✓" : "+"}</i>{item.label}</label>)}</div>
        <h3 className="rg-plan__label">Chantiers à traiter</h3><div className="rg-plan__checks">{PRIORITIES.map((item) => <label key={item.id} className={data.priorities.includes(item.id) ? "selected" : ""}><input type="checkbox" checked={data.priorities.includes(item.id)} onChange={() => toggle("priorities", item.id, 3)} /><i>{data.priorities.includes(item.id) ? "✓" : "+"}</i>{item.label}</label>)}</div>
        <div className="rg-plan__nav"><button className="secondary" onClick={() => go(1)}>← Retour</button><button disabled={!data.objectives.length || !data.priorities.length} onClick={() => go(3)}>Continuer →</button></div>
      </section>}

      {step === 3 && <section className="rg-plan__panel"><div className="rg-plan__heading"><span>Cadre de réalisation</span><h2>Quel rythme convient à votre entreprise ?</h2><p>La feuille de route s’adapte à votre horizon et à vos moyens.</p></div>
        <div className="rg-plan__horizons"><button type="button" className={data.horizon === "NINETY_DAYS" ? "selected" : ""} onClick={() => setData({ ...data, horizon: "NINETY_DAYS" })}><strong>Plan accéléré</strong><span>90 jours • un chantier pilote</span></button><button type="button" className={data.horizon === "SIX_MONTHS" ? "selected" : ""} onClick={() => setData({ ...data, horizon: "SIX_MONTHS" })}><strong>Transformation structurée</strong><span>6 à 12 mois • déploiement progressif</span></button></div>
        <div className="rg-plan__fields"><label><span>Budget envisagé</span><select value={data.budget} onChange={(e) => setData({ ...data, budget: e.target.value })}>{BUDGETS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label className="wide"><span>Contraintes particulières <small>(facultatif)</small></span><textarea value={data.constraints} onChange={(e) => setData({ ...data, constraints: e.target.value })} placeholder="Disponibilités, outils existants, réglementation, calendrier…" /></label></div>
        <div className="rg-plan__nav"><button className="secondary" onClick={() => go(2)}>← Retour</button><button onClick={() => go(4)}>Générer ma feuille de route →</button></div>
      </section>}

      {step === 4 && <section className="rg-plan__results"><div className="rg-plan__report"><div className="rg-plan__report-head"><div><span>RONNA GROUP</span><small>Plan de transformation numérique</small></div><strong>{data.horizon === "NINETY_DAYS" ? "90 JOURS" : "6–12 MOIS"}</strong></div><p className="rg-plan__eyebrow">Feuille de route pour</p><h1>{data.company}</h1><p className="rg-plan__intro">Une trajectoire priorisée pour produire des gains visibles, accompagner les équipes et installer une amélioration continue.</p>
        <div className="rg-plan__focus">{roadmap.focus.map((id, index) => <article key={id}><span>0{index + 1}</span><h2>{labelOf(OBJECTIVES, id)}</h2><p>{ADVICE[id]}</p></article>)}</div>
        <div className="rg-plan__quick"><span>À lancer dans les 15 premiers jours</span><h2>Trois actions immédiates</h2><ol>{roadmap.quickActions.map((item) => <li key={item}>{item}</li>)}</ol></div>
        <div className="rg-plan__timeline">{roadmap.phases.map((phase, index) => <article key={phase.period}><i>{String(index + 1).padStart(2, "0")}</i><div><span>{phase.period}</span><h2>{phase.title}</h2><p>{phase.text}</p></div></article>)}</div>
        <div className="rg-plan__management"><article><span>Indicateurs recommandés</span><ul>{roadmap.kpis.map((item) => <li key={item}>{item}</li>)}</ul></article><article><span>Gouvernance</span><p>{roadmap.governance}</p><p>Budget déclaré : <strong>{labelOf(BUDGETS, data.budget)}</strong></p></article></div>
        <p className="rg-plan__disclaimer">Plan indicatif généré à partir de vos réponses. Les priorités, moyens, coûts et délais définitifs doivent être confirmés pendant un cadrage détaillé.</p></div>
        <div className="rg-plan__actions"><button onClick={() => window.print()}>Télécharger / imprimer en PDF</button><button className="secondary" onClick={() => go(1)}>Modifier mes réponses</button><Link to={`/contact?service=RONNA_CONSEIL_MANAGEMENT&subject=${encodeURIComponent(`Échange sur le plan de transformation — ${data.company}`)}`}>Parler à quelqu’un de l’équipe</Link></div>
        <div className="rg-plan__lead">{!sent ? <><div><span>Nous transmettre votre plan</span><h2>Préparez la prochaine étape avec notre équipe.</h2><p>RONNA GROUP recevra votre feuille de route et pourra vous aider à confirmer les priorités, les moyens et le calendrier.</p></div><form onSubmit={submit}><input required minLength="2" placeholder="Nom et prénom" value={lead.fullName} onChange={(e) => setLead({ ...lead, fullName: e.target.value })} /><input required type="email" placeholder="Email professionnel" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} /><input required minLength="6" placeholder="Téléphone / WhatsApp" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} /><input required minLength="2" placeholder="Fonction" value={lead.role} onChange={(e) => setLead({ ...lead, role: e.target.value })} /><select value={lead.preferredContact} onChange={(e) => setLead({ ...lead, preferredContact: e.target.value })}>{CONTACTS.map((item) => <option key={item.id} value={item.id}>Me contacter par {item.label}</option>)}</select><input className="rg-plan__trap" tabIndex="-1" autoComplete="off" aria-hidden="true" value={lead.honeypot} onChange={(e) => setLead({ ...lead, honeypot: e.target.value })} /><label className="rg-plan__consent"><input required type="checkbox" checked={lead.consent} onChange={(e) => setLead({ ...lead, consent: e.target.checked })} /><span>J’accepte que RONNA GROUP utilise ces informations pour étudier mon plan et me recontacter.</span></label>{error && <p className="rg-plan__error">{error}</p>}<button disabled={sending}>{sending ? "Transmission…" : "Nous transmettre le plan →"}</button></form></> : <div className="rg-plan__success"><span>Plan transmis</span><h2>Votre feuille de route a bien été reçue.</h2><p>Un accusé de réception vous a été envoyé. Notre équipe reviendra vers vous rapidement.</p></div>}</div>
      </section>}
    </main><style>{css}</style>
  </>;
}

const css = `
.rg-plan{min-height:100vh;padding:110px 18px 78px;color:#fff;background:linear-gradient(180deg,rgba(3,10,26,.98),rgba(5,18,45,.98) 55%,rgba(3,10,26,.98));overflow-x:hidden}.rg-plan *{box-sizing:border-box;min-width:0}.rg-plan__hero,.rg-plan__progress,.rg-plan__panel,.rg-plan__results{max-width:1080px;margin-inline:auto}.rg-plan__hero{padding:48px 0 34px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end}.rg-plan__hero>div>span,.rg-plan__heading>span,.rg-plan__lead>div>span,.rg-plan__success>span{color:#87a9ff;font-size:11px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase}.rg-plan__hero h1{max-width:800px;margin:10px 0 14px;font-size:clamp(40px,6vw,68px);line-height:1;letter-spacing:-2.5px}.rg-plan__hero p{max-width:700px;margin:0;color:rgba(255,255,255,.68);font-size:16px;line-height:1.7}.rg-plan__promise{display:grid;grid-template-columns:auto auto;gap:6px 12px}.rg-plan__promise strong{color:#8cafff;font-size:12px}.rg-plan__promise span{color:rgba(255,255,255,.46);font-size:10px}.rg-plan__progress{position:sticky;z-index:5;top:78px;padding:14px 17px;margin-bottom:16px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:rgba(5,18,45,.94)}.rg-plan__progress>span{display:block;margin-bottom:8px;color:rgba(255,255,255,.58);font-size:11px}.rg-plan__progress i{display:block;height:5px;overflow:hidden;border-radius:99px;background:rgba(255,255,255,.08)}.rg-plan__progress b{display:block;height:100%;background:linear-gradient(90deg,#315fe0,#83a7ff)}.rg-plan__panel{padding:32px;border:1px solid rgba(255,255,255,.1);border-radius:26px;background:rgba(255,255,255,.03)}.rg-plan__heading h2{margin:7px 0 8px;font-size:clamp(27px,4vw,40px)}.rg-plan__heading p{margin:0;color:rgba(255,255,255,.58)}.rg-plan__fields{margin-top:23px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.rg-plan__fields label>span{display:block;margin-bottom:7px;color:rgba(255,255,255,.65);font-size:11px;font-weight:750}.rg-plan__fields .wide{grid-column:1/-1}.rg-plan input,.rg-plan select,.rg-plan textarea{width:100%;padding:13px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:#07152f;color:#fff;font:inherit}.rg-plan textarea{min-height:100px;resize:vertical}.rg-plan input::placeholder,.rg-plan textarea::placeholder{color:rgba(255,255,255,.37)}.rg-plan__label{margin:25px 0 10px;color:rgba(255,255,255,.68);font-size:11px;text-transform:uppercase;letter-spacing:.9px}.rg-plan__options,.rg-plan__checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.rg-plan__options button,.rg-plan__checks label{padding:14px;display:flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(3,10,26,.34);color:rgba(255,255,255,.68);font-size:12px;text-align:left;cursor:pointer}.rg-plan__options button.selected,.rg-plan__checks label.selected,.rg-plan__horizons button.selected{border-color:#628bf5;background:rgba(31,79,216,.17);color:#fff}.rg-plan__options i,.rg-plan__checks i{width:25px;height:25px;display:grid;place-items:center;flex:0 0 auto;color:#8faeff;font-style:normal;font-size:10px}.rg-plan__checks input{position:absolute;opacity:0;width:auto}.rg-plan__horizons{margin-top:23px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.rg-plan__horizons button{padding:24px;display:flex;flex-direction:column;align-items:flex-start;border:1px solid rgba(255,255,255,.1);border-radius:19px;background:rgba(3,10,26,.34);color:#fff;text-align:left}.rg-plan__horizons strong{font-size:17px}.rg-plan__horizons span{margin-top:6px;color:rgba(255,255,255,.5);font-size:11px}.rg-plan__nav{margin-top:24px;display:flex;justify-content:space-between;gap:9px}.rg-plan button,.rg-plan__actions a{padding:13px 18px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:#1f4fd8;color:#fff;font:inherit;font-size:12px;font-weight:850;text-decoration:none;cursor:pointer}.rg-plan button.secondary,.rg-plan__actions .secondary{background:rgba(255,255,255,.04)}.rg-plan button:disabled{opacity:.38}.rg-plan__report{padding:48px;border:1px solid #dfe4ef;border-radius:27px;background:#f8f9fd;color:#0c1830}.rg-plan__report-head{padding-bottom:20px;display:flex;justify-content:space-between;border-bottom:1px solid #dbe1ec}.rg-plan__report-head span,.rg-plan__report-head small{display:block}.rg-plan__report-head span{font-weight:900;letter-spacing:2px}.rg-plan__report-head small{margin-top:4px;color:#697386;font-size:9px}.rg-plan__report-head>strong{color:#315fd8;font-size:11px}.rg-plan__eyebrow{margin:40px 0 8px;color:#315fd8;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.3px}.rg-plan__report>h1{margin:0;font-size:clamp(38px,5vw,58px);line-height:1}.rg-plan__intro{max-width:720px;color:#657086;line-height:1.6}.rg-plan__focus{margin-top:30px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.rg-plan__focus article,.rg-plan__quick,.rg-plan__management article{padding:20px;border:1px solid #dfe4ee;border-radius:15px;background:#fff}.rg-plan__focus span,.rg-plan__quick>span,.rg-plan__management article>span{color:#315fd8;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.7px}.rg-plan__focus h2,.rg-plan__quick h2{margin:12px 0 7px;font-size:17px}.rg-plan__focus p,.rg-plan__quick li,.rg-plan__timeline p,.rg-plan__management p,.rg-plan__management li{color:#536075;font-size:11px;line-height:1.65}.rg-plan__quick{margin-top:10px}.rg-plan__quick ol{padding-left:18px;margin-bottom:0}.rg-plan__timeline{margin-top:10px;display:grid;gap:8px}.rg-plan__timeline article{padding:18px;display:grid;grid-template-columns:auto 1fr;gap:16px;border:1px solid #dfe4ee;border-radius:15px;background:#fff}.rg-plan__timeline i{width:35px;height:35px;display:grid;place-items:center;border-radius:10px;background:#e9efff;color:#315fd8;font-style:normal;font-size:10px;font-weight:900}.rg-plan__timeline span{color:#315fd8;font-size:9px;font-weight:900;text-transform:uppercase}.rg-plan__timeline h2{margin:5px 0;font-size:17px}.rg-plan__timeline p{margin:0}.rg-plan__management{margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.rg-plan__management ul{padding-left:17px;margin-bottom:0}.rg-plan__disclaimer{margin:18px 0 0;padding-top:16px;border-top:1px solid #dbe1ec;color:#697386;font-size:9px}.rg-plan__actions{margin-top:14px;display:flex;gap:8px;flex-wrap:wrap}.rg-plan__actions a{background:rgba(255,255,255,.04)}.rg-plan__lead{margin-top:15px;padding:30px;display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:34px;border:1px solid rgba(112,149,244,.25);border-radius:24px;background:linear-gradient(120deg,rgba(31,79,216,.13),rgba(255,255,255,.025))}.rg-plan__lead h2{margin:9px 0;font-size:29px}.rg-plan__lead>div>p,.rg-plan__success p{color:rgba(255,255,255,.62);line-height:1.65}.rg-plan__lead form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.rg-plan__lead form>select,.rg-plan__consent,.rg-plan__lead form>button,.rg-plan__error{grid-column:1/-1}.rg-plan__consent{display:flex;gap:8px;color:rgba(255,255,255,.58);font-size:10px;line-height:1.5}.rg-plan__consent input{width:auto;margin-top:2px}.rg-plan__trap{position:absolute!important;left:-9999px!important}.rg-plan__error{margin:0;color:#ffa3a3;font-size:11px}.rg-plan__success{grid-column:1/-1;text-align:center}.rg-plan__success h2{margin:9px 0}
@media(max-width:760px){.rg-plan{padding:88px 12px 68px}.rg-plan__hero{padding:35px 4px 27px;grid-template-columns:1fr}.rg-plan__hero h1{letter-spacing:-1.5px}.rg-plan__promise{grid-template-columns:auto 1fr}.rg-plan__progress{top:69px}.rg-plan__panel{padding:22px 15px}.rg-plan__fields,.rg-plan__options,.rg-plan__checks,.rg-plan__horizons,.rg-plan__focus,.rg-plan__management,.rg-plan__lead,.rg-plan__lead form{grid-template-columns:1fr}.rg-plan__fields>*{grid-column:1!important}.rg-plan__nav button{flex:1}.rg-plan__report{padding:28px 16px}.rg-plan__report-head{flex-direction:column;gap:10px}.rg-plan__actions{display:grid}.rg-plan__actions>*{text-align:center}.rg-plan__lead{padding:22px 15px}.rg-plan__lead form>*{grid-column:1!important}}
@media print{body{background:#fff!important}.rg-plan{padding:0;background:#fff;color:#111}.rg-plan__hero,.rg-plan__progress,.rg-plan__actions,.rg-plan__lead,.rg-footer,header[role=banner]{display:none!important}.rg-plan__results{max-width:none}.rg-plan__report{padding:18px;border:0}.rg-plan__report article{break-inside:avoid}}
`;
