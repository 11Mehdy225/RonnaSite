import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import { apiUrl } from "../lib/api.js";
import { trackEvent } from "../lib/analytics.js";

const QUESTIONS = [
  { id: "site", category: "Site web", text: "Votre entreprise dispose-t-elle d’un site professionnel accessible sur mobile ?" },
  { id: "speed", category: "Site web", text: "Le site se charge-t-il rapidement et présente-t-il clairement votre offre ?" },
  { id: "conversion", category: "Site web", text: "Le site facilite-t-il la prise de contact, l’appel ou la demande de devis ?" },
  { id: "profile", category: "Google", text: "Votre fiche Google Business est-elle complète et à jour ?" },
  { id: "search", category: "Google", text: "Votre entreprise apparaît-elle sur Google pour les recherches liées à votre activité ?" },
  { id: "reviews", category: "Google", text: "Collectez-vous régulièrement des avis clients et y répondez-vous ?" },
  { id: "networks", category: "Réseaux sociaux", text: "Êtes-vous actif sur les réseaux réellement utilisés par vos clients ?" },
  { id: "regularity", category: "Réseaux sociaux", text: "Publiez-vous avec régularité selon un calendrier défini ?" },
  { id: "engagement", category: "Réseaux sociaux", text: "Vos publications génèrent-elles des échanges et des demandes qualifiées ?" },
  { id: "strategy", category: "Contenu", text: "Vos contenus répondent-ils aux questions et problèmes de vos clients ?" },
  { id: "proof", category: "Contenu", text: "Présentez-vous des réalisations, témoignages ou preuves de votre expertise ?" },
  { id: "measure", category: "Mesure", text: "Suivez-vous les visites, clics, messages et demandes générés en ligne ?" }
];

const OPTIONS = [
  { value: 0, label: "Non" },
  { value: 1, label: "Un peu" },
  { value: 2, label: "En partie" },
  { value: 3, label: "Oui, clairement" }
];

const ADVICE = {
  "Site web": "Clarifier votre offre, accélérer l’affichage mobile et placer des appels à l’action visibles.",
  Google: "Optimiser votre fiche Google, vos informations locales et la collecte d’avis clients.",
  "Réseaux sociaux": "Concentrer vos efforts sur les bons réseaux avec un calendrier éditorial réaliste.",
  Contenu: "Publier des contenus utiles, des cas clients et des preuves qui renforcent la confiance.",
  Mesure: "Installer des indicateurs simples pour savoir quels canaux produisent réellement des demandes."
};

function level(score) {
  if (score >= 80) return { title: "Visibilité performante", text: "Votre présence en ligne est solide. Vous pouvez maintenant optimiser la conversion et accélérer l’acquisition." };
  if (score >= 55) return { title: "Visibilité en progression", text: "Vos bases sont présentes. Quelques améliorations ciblées peuvent augmenter rapidement votre portée et vos demandes." };
  if (score >= 30) return { title: "Visibilité fragile", text: "Votre entreprise est présente, mais son potentiel commercial en ligne reste insuffisamment exploité." };
  return { title: "Visibilité à construire", text: "Votre activité a une forte marge de progression. Commencez par des fondations simples et cohérentes." };
}

export default function DiagnosticVisibilite() {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(false);
  const [lead, setLead] = useState({ fullName: "", email: "", phone: "", company: "", role: "", preferredContact: "WHATSAPP", consent: false, honeypot: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const answered = Object.keys(answers).length;
  const score = Math.round((Object.values(answers).reduce((sum, value) => sum + value, 0) / (QUESTIONS.length * 3)) * 100);
  const diagnosis = level(score);
  const categories = useMemo(() => {
    const grouped = {};
    QUESTIONS.forEach((question) => {
      if (!grouped[question.category]) grouped[question.category] = { value: 0, max: 0 };
      grouped[question.category].value += answers[question.id] ?? 0;
      grouped[question.category].max += 3;
    });
    return Object.entries(grouped).map(([name, values]) => ({ name, score: Math.round((values.value / values.max) * 100) }));
  }, [answers]);
  const priorities = [...categories].sort((a, b) => a.score - b.score).slice(0, 3);

  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setError("");
    const breakdown = categories.map((item) => `- ${item.name} : ${item.score}%`).join("\n");
    const actions = priorities.map((item, index) => `${index + 1}. ${item.name} — ${ADVICE[item.name]}`).join("\n");
    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "DEVIS", ...lead, service: "RONNA_DIGITAL", subject: `Diagnostic visibilité — ${lead.company} — ${score}/100`,
          message: `Diagnostic de visibilité en ligne\n\nScore : ${score}/100 — ${diagnosis.title}\n\nRésultats :\n${breakdown}\n\nPriorités :\n${actions}`,
          budgetRange: "UNKNOWN", timeline: "DISCUSS"
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.ok === false) throw new Error(data?.message || "Impossible de transmettre le diagnostic.");
      trackEvent("quote_submitted", "/diagnostic-visibilite");
      setSent(true);
    } catch (submissionError) {
      setError(submissionError?.message || "Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  }

  function restart() {
    setAnswers({}); setResults(false); setSent(false); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <>
    <SEO title="Diagnostic de visibilité en ligne | Ronna Group" description="Évaluez gratuitement la visibilité en ligne de votre entreprise et obtenez trois priorités concrètes." canonical="https://www.ronnagroup.net/diagnostic-visibilite" />
    <main className="rg-vis">
      <header className="rg-vis__hero"><div><span>Outil gratuit • 4 minutes</span><h1>Votre entreprise est-elle vraiment visible en ligne ?</h1><p>Évaluez votre site, Google, vos réseaux et vos contenus. Obtenez un score clair et un plan d’action prioritaire.</p></div><div className="rg-vis__facts"><strong>12</strong><span>questions</span><strong>5</strong><span>domaines</span><strong>3</strong><span>priorités</span></div></header>

      {!results ? <section className="rg-vis__form">
        <div className="rg-vis__progress"><p><span>Progression</span><strong>{answered}/{QUESTIONS.length}</strong></p><i><b style={{ width: `${Math.round(answered / QUESTIONS.length * 100)}%` }} /></i></div>
        <div className="rg-vis__questions">{QUESTIONS.map((question, index) => <fieldset key={question.id}><legend><span>{String(index + 1).padStart(2, "0")} • {question.category}</span>{question.text}</legend><div>{OPTIONS.map((option) => <label key={option.value} className={answers[question.id] === option.value ? "selected" : ""}><input type="radio" name={question.id} checked={answers[question.id] === option.value} onChange={() => setAnswers({ ...answers, [question.id]: option.value })} />{option.label}</label>)}</div></fieldset>)}</div>
        <div className="rg-vis__submit"><p>{answered === QUESTIONS.length ? "Votre diagnostic est prêt." : `Encore ${QUESTIONS.length - answered} réponse${QUESTIONS.length - answered > 1 ? "s" : ""}.`}</p><button disabled={answered < QUESTIONS.length} onClick={() => { setResults(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Voir mon diagnostic →</button></div>
      </section> : <section className="rg-vis__results">
        <div className="rg-vis__result"><div className="rg-vis__score" style={{ "--score": `${score * 3.6}deg` }}><div><strong>{score}</strong><span>/100</span></div></div><div><span>Diagnostic de visibilité</span><h1>{diagnosis.title}</h1><p>{diagnosis.text}</p></div></div>
        <div className="rg-vis__breakdown"><span>Résultats détaillés</span><h2>Votre visibilité par domaine</h2>{categories.map((item) => <div key={item.name}><p><span>{item.name}</span><strong>{item.score}%</strong></p><i><b style={{ width: `${item.score}%` }} /></i></div>)}</div>
        <div className="rg-vis__priorities"><span>Plan d’action</span><h2>Vos trois priorités</h2><div>{priorities.map((item, index) => <article key={item.name}><strong>0{index + 1}</strong><h3>{item.name}</h3><p>{ADVICE[item.name]}</p></article>)}</div></div>
        <div className="rg-vis__actions"><a href="#transmettre-visibilite">Nous transmettre le diagnostic →</a><Link to={`/contact?service=RONNA_DIGITAL&subject=${encodeURIComponent(`Échange sur le diagnostic visibilité — ${score}/100`)}`}>Parler à quelqu’un de l’équipe</Link><button onClick={() => window.print()}>Télécharger / imprimer en PDF</button><button onClick={restart}>Recommencer</button></div>
        <div className="rg-vis__lead" id="transmettre-visibilite">{!sent ? <><div><span>Analyse personnalisée</span><h2>Transmettez vos résultats à notre équipe.</h2><p>Nous recevrons votre score et vos priorités afin de vous proposer les actions les plus adaptées.</p></div><form onSubmit={submit}>
          <input required minLength="2" placeholder="Nom et prénom" value={lead.fullName} onChange={(e) => setLead({ ...lead, fullName: e.target.value })} /><input required type="email" placeholder="Email professionnel" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} /><input required minLength="6" placeholder="Téléphone / WhatsApp" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} /><input required minLength="2" placeholder="Entreprise" value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })} /><input required minLength="2" placeholder="Fonction" value={lead.role} onChange={(e) => setLead({ ...lead, role: e.target.value })} /><select value={lead.preferredContact} onChange={(e) => setLead({ ...lead, preferredContact: e.target.value })}><option value="WHATSAPP">Me contacter par WhatsApp</option><option value="CALL">Me contacter par appel</option><option value="EMAIL">Me contacter par email</option><option value="MEETING">Organiser un rendez-vous</option></select><input className="rg-vis__trap" tabIndex="-1" autoComplete="off" aria-hidden="true" value={lead.honeypot} onChange={(e) => setLead({ ...lead, honeypot: e.target.value })} /><label className="rg-vis__consent"><input required type="checkbox" checked={lead.consent} onChange={(e) => setLead({ ...lead, consent: e.target.checked })} /><span>J’accepte que RONNA GROUP utilise ces informations pour analyser ma visibilité et me recontacter.</span></label>{error && <p className="rg-vis__error">{error}</p>}<button disabled={sending}>{sending ? "Transmission…" : "Nous transmettre le diagnostic →"}</button>
        </form></> : <div className="rg-vis__success"><span>Diagnostic transmis</span><h2>Vos résultats ont bien été reçus.</h2><p>Notre équipe vous recontactera rapidement avec une première lecture personnalisée.</p></div>}</div>
      </section>}
    </main><style>{css}</style>
  </>;
}

const css = `
.rg-vis{min-height:100vh;padding:110px 18px 78px;color:#fff;background:linear-gradient(180deg,rgba(3,10,26,.98),rgba(5,18,45,.98) 55%,rgba(3,10,26,.98));overflow-x:hidden}.rg-vis *{box-sizing:border-box;min-width:0}.rg-vis__hero,.rg-vis__form,.rg-vis__results{max-width:1060px;margin-inline:auto}.rg-vis__hero{padding:48px 0 35px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end}.rg-vis__hero>div>span,.rg-vis__result>div>span,.rg-vis__breakdown>span,.rg-vis__priorities>span,.rg-vis__lead>div>span,.rg-vis__success>span{color:#78d7c2;font-size:11px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase}.rg-vis__hero h1{max-width:820px;margin:10px 0 14px;font-size:clamp(39px,6vw,67px);line-height:1;letter-spacing:-2.5px}.rg-vis__hero p{max-width:700px;margin:0;color:rgba(255,255,255,.67);font-size:16px;line-height:1.7}.rg-vis__facts{display:grid;grid-template-columns:auto auto;gap:6px 11px}.rg-vis__facts strong{color:#78d7c2;font-size:22px}.rg-vis__facts span{align-self:center;color:rgba(255,255,255,.5);font-size:10px;text-transform:uppercase}.rg-vis__progress{position:sticky;z-index:5;top:78px;padding:14px 17px;border:1px solid rgba(255,255,255,.1);border-radius:17px;background:rgba(5,18,45,.94);backdrop-filter:blur(14px)}.rg-vis__progress p,.rg-vis__breakdown p{display:flex;justify-content:space-between;margin:0 0 8px;color:rgba(255,255,255,.65);font-size:11px}.rg-vis__progress i,.rg-vis__breakdown i{display:block;height:5px;overflow:hidden;border-radius:99px;background:rgba(255,255,255,.08)}.rg-vis__progress b,.rg-vis__breakdown b{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#1f806f,#79d8c3);transition:width .25s}.rg-vis__questions{margin-top:15px;display:grid;gap:12px}.rg-vis fieldset{margin:0;padding:21px;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:rgba(255,255,255,.03)}.rg-vis legend{width:100%;padding:0;font-size:16px;font-weight:800;line-height:1.45}.rg-vis legend>span{display:block;margin-bottom:6px;color:#78d7c2;font-size:9px;letter-spacing:1px;text-transform:uppercase}.rg-vis fieldset>div{margin-top:15px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.rg-vis fieldset label{padding:11px 8px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(3,10,26,.3);color:rgba(255,255,255,.62);font-size:11px;text-align:center;cursor:pointer}.rg-vis fieldset label.selected{border-color:#48a792;background:rgba(31,128,111,.19);color:#fff}.rg-vis fieldset input{position:absolute;opacity:0}.rg-vis__submit{margin-top:16px;padding:18px;display:flex;align-items:center;justify-content:space-between;gap:16px;border:1px solid rgba(80,177,156,.24);border-radius:18px;background:rgba(31,128,111,.09)}.rg-vis__submit p{margin:0;color:rgba(255,255,255,.62);font-size:12px}.rg-vis button,.rg-vis__actions a{padding:13px 17px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:#167d6b;color:#fff;font:inherit;font-size:12px;font-weight:850;text-decoration:none;cursor:pointer}.rg-vis button:disabled{opacity:.38;cursor:not-allowed}.rg-vis__results{padding-top:25px}.rg-vis__result{padding:36px;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:35px;border:1px solid rgba(80,177,156,.28);border-radius:27px;background:linear-gradient(120deg,rgba(31,128,111,.17),rgba(255,255,255,.03))}.rg-vis__score{--score:0deg;width:175px;height:175px;padding:12px;border-radius:50%;background:conic-gradient(#63cdb6 var(--score),rgba(255,255,255,.08) 0)}.rg-vis__score>div{width:100%;height:100%;display:grid;place-content:center;border-radius:50%;background:#07132d;text-align:center}.rg-vis__score strong{font-size:47px;line-height:.85}.rg-vis__score span{color:rgba(255,255,255,.52);font-size:11px}.rg-vis__result h1{margin:8px 0 10px;font-size:clamp(31px,5vw,51px);letter-spacing:-1.5px}.rg-vis__result p{max-width:620px;margin:0;color:rgba(255,255,255,.66);line-height:1.7}.rg-vis__breakdown,.rg-vis__priorities{margin-top:15px;padding:27px;border:1px solid rgba(255,255,255,.1);border-radius:23px;background:rgba(255,255,255,.03)}.rg-vis__breakdown h2,.rg-vis__priorities h2{margin:7px 0 20px;font-size:25px}.rg-vis__breakdown>div{margin-top:14px}.rg-vis__priorities>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.rg-vis__priorities article{padding:19px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(3,10,26,.35)}.rg-vis__priorities article>strong{color:#78d7c2;font-size:10px}.rg-vis__priorities h3{margin:18px 0 7px}.rg-vis__priorities p{margin:0;color:rgba(255,255,255,.58);font-size:12px;line-height:1.6}.rg-vis__actions{margin-top:15px;display:flex;gap:8px;flex-wrap:wrap}.rg-vis__actions a+a,.rg-vis__actions button{background:rgba(255,255,255,.04)}.rg-vis__lead{scroll-margin-top:100px;margin-top:15px;padding:29px;display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:32px;border:1px solid rgba(80,177,156,.25);border-radius:23px;background:linear-gradient(120deg,rgba(31,128,111,.1),rgba(255,255,255,.025))}.rg-vis__lead h2{margin:8px 0;font-size:28px}.rg-vis__lead>div>p,.rg-vis__success p{margin:0;color:rgba(255,255,255,.62);font-size:12px;line-height:1.7}.rg-vis__lead form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.rg-vis__lead input,.rg-vis__lead select{width:100%;padding:12px;border:1px solid rgba(255,255,255,.12);border-radius:11px;background:#07152f;color:#fff;font:inherit}.rg-vis__lead select,.rg-vis__consent,.rg-vis__lead form>button,.rg-vis__error{grid-column:1/-1}.rg-vis__consent{display:flex;gap:8px;color:rgba(255,255,255,.58);font-size:10px;line-height:1.5}.rg-vis__consent input{width:auto;margin-top:2px;accent-color:#48a792}.rg-vis__trap{position:absolute!important;left:-9999px!important}.rg-vis__error{margin:0;color:#ffa3a3;font-size:11px}.rg-vis__success{grid-column:1/-1;padding:16px;text-align:center}.rg-vis__success h2{margin:8px 0}
@media(max-width:760px){.rg-vis{padding:88px 12px 68px}.rg-vis__hero{padding:35px 4px 27px;grid-template-columns:1fr}.rg-vis__hero h1{letter-spacing:-1.5px}.rg-vis__facts{grid-template-columns:auto 1fr}.rg-vis__progress{top:69px}.rg-vis fieldset{padding:17px}.rg-vis fieldset>div{grid-template-columns:1fr 1fr}.rg-vis__submit{align-items:stretch;flex-direction:column}.rg-vis__result{padding:24px 17px;grid-template-columns:1fr}.rg-vis__score{width:145px;height:145px}.rg-vis__breakdown,.rg-vis__priorities{padding:21px 16px}.rg-vis__priorities>div{grid-template-columns:1fr}.rg-vis__actions{display:grid}.rg-vis__actions>*{text-align:center}.rg-vis__lead,.rg-vis__lead form{grid-template-columns:1fr}.rg-vis__lead{padding:21px 16px}.rg-vis__lead form>*{grid-column:1!important}}
@media print{body{background:#fff!important}.rg-vis{padding:0;background:#fff;color:#111}.rg-vis__hero,.rg-vis__form,.rg-vis__actions,.rg-vis__lead,.rg-footer,header[role=banner]{display:none!important}.rg-vis__result,.rg-vis__breakdown,.rg-vis__priorities{border-color:#ddd;background:#fff;color:#111;break-inside:avoid}.rg-vis__score>div{background:#fff}.rg-vis__result p,.rg-vis__priorities p,.rg-vis__breakdown p{color:#444}}
`;
