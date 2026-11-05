import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import { apiUrl } from "../lib/api.js";
import { trackEvent } from "../lib/analytics.js";

const PROJECTS = [
  { id: "vitrine", icon: "◫", title: "Site vitrine", text: "Présenter l’entreprise et générer des demandes", min: 350000, max: 900000, weeks: "3 à 6 semaines", service: "RONNA_WEB" },
  { id: "ecommerce", icon: "◇", title: "Site e-commerce", text: "Vendre des produits ou services en ligne", min: 800000, max: 2500000, weeks: "6 à 12 semaines", service: "RONNA_WEB" },
  { id: "webapp", icon: "⌘", title: "Application web", text: "Digitaliser un métier, un portail ou une plateforme", min: 1500000, max: 5000000, weeks: "8 à 16 semaines", service: "RONNA_DEVELOPPEMENT" },
  { id: "mobile", icon: "▯", title: "Application mobile", text: "Créer une expérience iOS et Android", min: 2500000, max: 8000000, weeks: "12 à 24 semaines", service: "RONNA_DEVELOPPEMENT" },
  { id: "digital", icon: "↗", title: "Accompagnement digital", text: "Visibilité, acquisition et stratégie numérique", min: 300000, max: 1200000, weeks: "1 à 3 mois", service: "RONNA_DIGITAL" }
];

const FEATURES = [
  { id: "design", label: "Design sur mesure", min: 150000, max: 400000 },
  { id: "admin", label: "Espace d’administration", min: 250000, max: 700000 },
  { id: "accounts", label: "Comptes utilisateurs", min: 300000, max: 900000 },
  { id: "payment", label: "Paiement en ligne", min: 250000, max: 700000 },
  { id: "booking", label: "Réservation / commande", min: 250000, max: 750000 },
  { id: "integrations", label: "Connexion à des outils externes", min: 300000, max: 1000000 },
  { id: "content", label: "Création de contenus", min: 150000, max: 500000 },
  { id: "support", label: "Maintenance et accompagnement", min: 180000, max: 600000 }
];

const TIMELINES = [
  { id: "URGENT_1_2_WEEKS", label: "Très urgent", text: "Démarrage sous 1 à 2 semaines", factor: 1.18 },
  { id: "ONE_MONTH", label: "Sous un mois", text: "Le besoin est déjà prioritaire", factor: 1.08 },
  { id: "TWO_THREE_MONTHS", label: "Dans 2 à 3 mois", text: "Un calendrier confortable", factor: 1 },
  { id: "GT_3_MONTHS", label: "Plus de 3 mois", text: "Projet encore en préparation", factor: 1 },
  { id: "DISCUSS", label: "À définir", text: "Nous cadrerons le planning ensemble", factor: 1 }
];

const BUDGETS = [
  { id: "LT_300K", label: "Moins de 300 000 FCFA" },
  { id: "300K_1M", label: "300 000 à 1 000 000 FCFA" },
  { id: "1M_3M", label: "1 000 000 à 3 000 000 FCFA" },
  { id: "GT_3M", label: "Plus de 3 000 000 FCFA" },
  { id: "UNKNOWN", label: "Budget à définir" }
];

const CONTACTS = [
  { id: "WHATSAPP", label: "WhatsApp" },
  { id: "CALL", label: "Appel" },
  { id: "EMAIL", label: "Email" },
  { id: "MEETING", label: "Rendez-vous" }
];

const money = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const round = (value) => Math.ceil(value / 50000) * 50000;

export default function DevisExpress() {
  const [step, setStep] = useState(1);
  const [projectId, setProjectId] = useState("");
  const [features, setFeatures] = useState([]);
  const [timeline, setTimeline] = useState("TWO_THREE_MONTHS");
  const [budget, setBudget] = useState("UNKNOWN");
  const [details, setDetails] = useState("");
  const [lead, setLead] = useState({ fullName: "", email: "", phone: "", company: "", role: "", preferredContact: "WHATSAPP", consent: false, honeypot: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const project = PROJECTS.find((item) => item.id === projectId);
  const selectedTimeline = TIMELINES.find((item) => item.id === timeline);
  const estimate = useMemo(() => {
    if (!project) return null;
    const additions = FEATURES.filter((item) => features.includes(item.id));
    const rawMin = project.min + additions.reduce((sum, item) => sum + item.min, 0);
    const rawMax = project.max + additions.reduce((sum, item) => sum + item.max, 0);
    return { min: round(rawMin * selectedTimeline.factor), max: round(rawMax * selectedTimeline.factor) };
  }, [features, project, selectedTimeline]);

  function toggleFeature(id) {
    setFeatures((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function next(nextStep) {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    setStep(1);
    setProjectId("");
    setFeatures([]);
    setTimeline("TWO_THREE_MONTHS");
    setBudget("UNKNOWN");
    setDetails("");
    setSent(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setError("");
    const featureLabels = FEATURES.filter((item) => features.includes(item.id)).map((item) => item.label);
    const budgetLabel = BUDGETS.find((item) => item.id === budget)?.label;
    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "DEVIS",
          ...lead,
          service: project.service,
          subject: `Devis Express — ${project.title} — ${lead.company}`,
          message: [
            "Estimation générée avec Ronna Devis Express",
            "",
            `Projet : ${project.title}`,
            `Fonctionnalités : ${featureLabels.length ? featureLabels.join(", ") : "Base essentielle"}`,
            `Délai souhaité : ${selectedTimeline.label}`,
            `Budget déclaré : ${budgetLabel}`,
            `Estimation indicative : ${money.format(estimate.min)} à ${money.format(estimate.max)} FCFA`,
            `Durée indicative : ${project.weeks}`,
            details.trim() ? `Précisions : ${details.trim()}` : "Précisions : aucune"
          ].join("\n"),
          budgetRange: budget,
          timeline,
          preferredContact: lead.preferredContact
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.ok === false) throw new Error(data?.message || "Impossible d’envoyer la demande.");
      trackEvent("quote_submitted", "/devis-express");
      setSent(true);
    } catch (submissionError) {
      setError(submissionError?.message || "Une erreur est survenue. Réessayez.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <SEO title="Devis Express | Ronna Group" description="Estimez gratuitement votre projet numérique et transmettez un brief qualifié à Ronna Group." canonical="https://www.ronnagroup.net/devis-express" />
      <main className="rg-devis">
        <header className="rg-devis__hero">
          <div>
            <span>Outil gratuit • 2 minutes</span>
            <h1>Estimez votre projet numérique.</h1>
            <p>Décrivez votre besoin en quelques choix et obtenez immédiatement une première fourchette de budget et de délai.</p>
          </div>
          <div className="rg-devis__trust"><strong>Gratuit</strong><span>sans engagement</span><strong>Immédiat</strong><span>résultat à l’écran</span><strong>Confidentiel</strong><span>brief protégé</span></div>
        </header>

        <div className="rg-devis__steps" aria-label="Progression"><i className={step >= 1 ? "active" : ""}>1</i><b /><i className={step >= 2 ? "active" : ""}>2</i><b /><i className={step >= 3 ? "active" : ""}>3</i></div>

        {step === 1 && <section className="rg-devis__panel">
          <div className="rg-devis__heading"><span>Étape 1 sur 3</span><h2>Quel projet souhaitez-vous réaliser ?</h2><p>Choisissez la catégorie la plus proche de votre besoin.</p></div>
          <div className="rg-devis__projects">
            {PROJECTS.map((item) => <button key={item.id} type="button" onClick={() => setProjectId(item.id)} className={projectId === item.id ? "selected" : ""}><em>{item.icon}</em><strong>{item.title}</strong><span>{item.text}</span><small>À partir de {money.format(item.min)} FCFA</small></button>)}
          </div>
          <div className="rg-devis__nav"><span /><button disabled={!projectId} onClick={() => next(2)}>Continuer →</button></div>
        </section>}

        {step === 2 && <section className="rg-devis__panel">
          <div className="rg-devis__heading"><span>Étape 2 sur 3</span><h2>Que doit inclure votre projet ?</h2><p>Sélectionnez les éléments utiles. Vous pourrez préciser le reste avec notre équipe.</p></div>
          <div className="rg-devis__features">
            {FEATURES.map((item) => <label key={item.id} className={features.includes(item.id) ? "selected" : ""}><input type="checkbox" checked={features.includes(item.id)} onChange={() => toggleFeature(item.id)} /><i>{features.includes(item.id) ? "✓" : "+"}</i><span>{item.label}</span></label>)}
          </div>
          <div className="rg-devis__nav"><button className="secondary" onClick={() => next(1)}>← Retour</button><button onClick={() => next(3)}>Continuer →</button></div>
        </section>}

        {step === 3 && !sent && <section className="rg-devis__results">
          <div className="rg-devis__result-card">
            <div><span>Votre estimation indicative</span><h2>{project.title}</h2><p>Sur la base des informations sélectionnées, votre projet se situe probablement dans cette fourchette.</p></div>
            <div className="rg-devis__price"><strong>{money.format(estimate.min)} – {money.format(estimate.max)}</strong><span>FCFA</span><small>Fourchette non contractuelle, hors frais de services tiers</small></div>
            <div className="rg-devis__facts"><p><span>Délai indicatif</span><strong>{project.weeks}</strong></p><p><span>Fonctionnalités</span><strong>{features.length || "Base essentielle"}</strong></p><p><span>Prochaine étape</span><strong>Cadrage gratuit</strong></p></div>
          </div>

          <div className="rg-devis__context">
            <div className="rg-devis__heading"><span>Affiner la demande</span><h2>Votre contexte</h2><p>Ces informations permettent à notre équipe de préparer une réponse plus pertinente.</p></div>
            <div className="rg-devis__context-grid">
              <label><span>Délai souhaité</span><select value={timeline} onChange={(event) => setTimeline(event.target.value)}>{TIMELINES.map((item) => <option key={item.id} value={item.id}>{item.label} — {item.text}</option>)}</select></label>
              <label><span>Budget envisagé</span><select value={budget} onChange={(event) => setBudget(event.target.value)}>{BUDGETS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
              <label className="wide"><span>Une précision utile ? <small>(facultatif)</small></span><textarea maxLength="1000" value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Objectif, utilisateurs, exemple de solution, contrainte particulière…" /></label>
            </div>
          </div>

          <div className="rg-devis__lead">
            <div><span>Recevoir une proposition adaptée</span><h2>Transmettez ce brief à notre équipe.</h2><p>Nous recevons votre estimation et vos choix. Un conseiller vous recontacte pour confirmer le périmètre et établir un devis précis.</p><ul><li>Vos coordonnées ne sont jamais vendues</li><li>Premier échange sans engagement</li><li>Réponse adaptée à votre contexte</li></ul></div>
            <form onSubmit={submit}>
              <input required minLength="2" placeholder="Nom et prénom" value={lead.fullName} onChange={(e) => setLead({ ...lead, fullName: e.target.value })} />
              <input required type="email" placeholder="Email professionnel" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
              <input required minLength="6" placeholder="Téléphone / WhatsApp" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
              <input required minLength="2" placeholder="Entreprise" value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })} />
              <input required minLength="2" placeholder="Fonction" value={lead.role} onChange={(e) => setLead({ ...lead, role: e.target.value })} />
              <select value={lead.preferredContact} onChange={(e) => setLead({ ...lead, preferredContact: e.target.value })} aria-label="Canal de contact préféré">{CONTACTS.map((item) => <option key={item.id} value={item.id}>Me contacter par {item.label}</option>)}</select>
              <input className="rg-devis__trap" tabIndex="-1" autoComplete="off" aria-hidden="true" value={lead.honeypot} onChange={(e) => setLead({ ...lead, honeypot: e.target.value })} />
              <label className="rg-devis__consent"><input required type="checkbox" checked={lead.consent} onChange={(e) => setLead({ ...lead, consent: e.target.checked })} /><span>J’accepte que RONNA GROUP utilise ces informations pour étudier ma demande et me recontacter.</span></label>
              {error && <p className="rg-devis__error">{error}</p>}
              <button disabled={sending}>{sending ? "Transmission…" : "Transmettre mon projet →"}</button>
            </form>
          </div>
          <div className="rg-devis__bottom"><button onClick={() => next(2)}>← Modifier mes choix</button><button onClick={restart}>Recommencer</button></div>
        </section>}

        {sent && <section className="rg-devis__success"><span>Demande transmise</span><h2>Votre projet est maintenant entre de bonnes mains.</h2><p>Notre équipe a reçu votre brief complet. Un accusé de réception vous a été envoyé par email et nous vous recontacterons rapidement.</p><div><Link to="/realisations">Voir nos réalisations</Link><button onClick={restart}>Estimer un autre projet</button></div></section>}
      </main>
      <style>{css}</style>
    </>
  );
}

const css = `
.rg-devis{min-height:100vh;padding:110px 18px 78px;color:#fff;background:linear-gradient(180deg,rgba(3,10,26,.98),rgba(5,18,45,.98) 55%,rgba(3,10,26,.98))}.rg-devis__hero,.rg-devis__panel,.rg-devis__results,.rg-devis__success,.rg-devis__steps{max-width:1060px;margin-inline:auto}.rg-devis__hero{padding:48px 0 30px;display:grid;grid-template-columns:1fr auto;gap:40px;align-items:end}.rg-devis__hero>div>span,.rg-devis__heading>span,.rg-devis__result-card>div>span,.rg-devis__lead>div>span,.rg-devis__success>span{color:#87a9ff;font-size:11px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase}.rg-devis__hero h1{max-width:760px;margin:10px 0 14px;font-size:clamp(40px,6vw,68px);line-height:1;letter-spacing:-2.5px}.rg-devis__hero p{max-width:680px;margin:0;color:rgba(255,255,255,.68);font-size:16px;line-height:1.7}.rg-devis__trust{display:grid;grid-template-columns:auto auto;gap:6px 11px}.rg-devis__trust strong{color:#8cafff;font-size:13px}.rg-devis__trust span{color:rgba(255,255,255,.48);font-size:11px}.rg-devis__steps{display:flex;align-items:center;margin-bottom:18px}.rg-devis__steps i{width:29px;height:29px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.14);border-radius:50%;color:rgba(255,255,255,.48);font-style:normal;font-size:11px;font-weight:800}.rg-devis__steps i.active{border-color:#6089f4;background:#1f4fd8;color:#fff}.rg-devis__steps b{width:55px;height:1px;background:rgba(255,255,255,.12)}.rg-devis__panel,.rg-devis__context,.rg-devis__lead{padding:32px;border:1px solid rgba(255,255,255,.1);border-radius:26px;background:rgba(255,255,255,.03)}.rg-devis__heading h2{margin:7px 0 8px;font-size:clamp(25px,4vw,38px);letter-spacing:-.7px}.rg-devis__heading p{margin:0;color:rgba(255,255,255,.6);line-height:1.6}.rg-devis__projects{margin-top:24px;display:grid;grid-template-columns:repeat(3,1fr);gap:11px}.rg-devis__projects button{min-height:190px;padding:20px;display:flex;align-items:flex-start;flex-direction:column;border:1px solid rgba(255,255,255,.1);border-radius:19px;background:rgba(3,10,26,.38);color:#fff;text-align:left;cursor:pointer;transition:.18s ease}.rg-devis__projects button:hover,.rg-devis__projects button.selected{transform:translateY(-2px);border-color:#628bf5;background:rgba(31,79,216,.17)}.rg-devis__projects em{width:37px;height:37px;display:grid;place-items:center;border-radius:11px;background:rgba(88,128,235,.16);color:#8eafff;font-style:normal;font-size:19px}.rg-devis__projects strong{margin-top:21px;font-size:17px}.rg-devis__projects span{margin-top:7px;color:rgba(255,255,255,.57);font-size:12px;line-height:1.5}.rg-devis__projects small{margin-top:auto;padding-top:14px;color:#8dadff;font-weight:700}.rg-devis__features{margin-top:24px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.rg-devis__features label{padding:17px;display:flex;align-items:center;gap:12px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:rgba(3,10,26,.34);cursor:pointer}.rg-devis__features label.selected{border-color:#5d86ef;background:rgba(31,79,216,.16)}.rg-devis__features input{position:absolute;opacity:0}.rg-devis__features i{width:27px;height:27px;display:grid;place-items:center;flex:0 0 auto;border:1px solid rgba(255,255,255,.18);border-radius:8px;color:#92aff8;font-style:normal}.rg-devis__features span{font-size:13px;font-weight:700}.rg-devis__nav{margin-top:24px;display:flex;justify-content:space-between;gap:10px}.rg-devis button,.rg-devis__success a{padding:13px 18px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:#1f4fd8;color:#fff;font:inherit;font-size:12px;font-weight:850;text-decoration:none;cursor:pointer}.rg-devis button.secondary,.rg-devis__bottom button,.rg-devis__success button{background:rgba(255,255,255,.04)}.rg-devis button:disabled{opacity:.38;cursor:not-allowed}.rg-devis__result-card{padding:34px;display:grid;grid-template-columns:1fr auto;gap:25px;border:1px solid rgba(112,149,244,.3);border-radius:26px;background:linear-gradient(120deg,rgba(31,79,216,.2),rgba(255,255,255,.03))}.rg-devis__result-card h2{margin:8px 0;font-size:34px}.rg-devis__result-card p{max-width:530px;margin:0;color:rgba(255,255,255,.62);line-height:1.6}.rg-devis__price{text-align:right}.rg-devis__price strong{display:block;color:#9db8ff;font-size:clamp(24px,4vw,38px);letter-spacing:-1px}.rg-devis__price>span{display:block;margin-top:3px;font-size:12px;font-weight:800;letter-spacing:1.2px}.rg-devis__price small{display:block;max-width:300px;margin-top:9px;color:rgba(255,255,255,.43);font-size:10px}.rg-devis__facts{grid-column:1/-1;padding-top:20px;display:grid;grid-template-columns:repeat(3,1fr);gap:9px;border-top:1px solid rgba(255,255,255,.1)}.rg-devis__facts p{padding:14px;margin:0;border-radius:14px;background:rgba(3,10,26,.27)}.rg-devis__facts span,.rg-devis__facts strong{display:block}.rg-devis__facts span{color:rgba(255,255,255,.48);font-size:10px;text-transform:uppercase;letter-spacing:.7px}.rg-devis__facts strong{margin-top:5px;font-size:14px}.rg-devis__context{margin-top:15px}.rg-devis__context-grid{margin-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.rg-devis__context-grid label>span{display:block;margin-bottom:7px;color:rgba(255,255,255,.65);font-size:11px;font-weight:700}.rg-devis__context-grid small{font-weight:400}.rg-devis__context-grid select,.rg-devis__context-grid textarea,.rg-devis__lead form>input,.rg-devis__lead form>select{width:100%;box-sizing:border-box;padding:13px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:#07152f;color:#fff;font:inherit}.rg-devis__context-grid .wide{grid-column:1/-1}.rg-devis__context-grid textarea{min-height:100px;resize:vertical}.rg-devis__lead{margin-top:15px;display:grid;grid-template-columns:.85fr 1.15fr;gap:34px;border-color:rgba(112,149,244,.25);background:linear-gradient(120deg,rgba(31,79,216,.12),rgba(255,255,255,.025))}.rg-devis__lead h2{margin:9px 0;font-size:29px}.rg-devis__lead>div>p{margin:0;color:rgba(255,255,255,.62);font-size:13px;line-height:1.7}.rg-devis__lead ul{padding:0;margin:17px 0 0;display:grid;gap:7px;list-style:none;color:rgba(255,255,255,.63);font-size:11px}.rg-devis__lead li:before{content:'✓';margin-right:8px;color:#84a7ff}.rg-devis__lead form{display:grid;grid-template-columns:1fr 1fr;gap:9px}.rg-devis__lead form>input::placeholder{color:rgba(255,255,255,.4)}.rg-devis__consent,.rg-devis__lead form>button,.rg-devis__error{grid-column:1/-1}.rg-devis__consent{display:flex;align-items:flex-start;gap:8px;color:rgba(255,255,255,.58);font-size:10px;line-height:1.5}.rg-devis__consent input{margin-top:2px;accent-color:#527cf0}.rg-devis__trap{position:absolute!important;left:-9999px!important}.rg-devis__error{margin:0;color:#ffa3a3;font-size:11px}.rg-devis__bottom{margin-top:15px;display:flex;justify-content:center;gap:8px}.rg-devis__success{margin-top:40px;padding:52px 30px;border:1px solid rgba(112,149,244,.28);border-radius:28px;background:linear-gradient(120deg,rgba(31,79,216,.18),rgba(255,255,255,.03));text-align:center}.rg-devis__success h2{max-width:700px;margin:10px auto;font-size:clamp(30px,5vw,50px)}.rg-devis__success p{max-width:650px;margin:0 auto;color:rgba(255,255,255,.64);line-height:1.7}.rg-devis__success>div{margin-top:24px;display:flex;justify-content:center;gap:9px;flex-wrap:wrap}
@media(max-width:760px){.rg-devis{padding-top:88px}.rg-devis__hero{padding:36px 0 27px;grid-template-columns:1fr}.rg-devis__hero h1{letter-spacing:-1.5px}.rg-devis__trust{grid-template-columns:auto 1fr}.rg-devis__panel,.rg-devis__context,.rg-devis__lead{padding:22px 17px}.rg-devis__projects{grid-template-columns:1fr}.rg-devis__projects button{min-height:155px}.rg-devis__features{grid-template-columns:1fr}.rg-devis__result-card{padding:24px 18px;grid-template-columns:1fr}.rg-devis__price{text-align:left}.rg-devis__facts{grid-template-columns:1fr}.rg-devis__context-grid,.rg-devis__lead,.rg-devis__lead form{grid-template-columns:1fr}.rg-devis__context-grid>*{grid-column:1!important}.rg-devis__lead form>*{grid-column:1!important}.rg-devis__nav button{flex:1}.rg-devis__bottom{flex-direction:column}}
`;
