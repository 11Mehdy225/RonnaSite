import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import { apiUrl } from "../lib/api.js";
import { trackEvent } from "../lib/analytics.js";

const CONTACTS = [
  { id: "WHATSAPP", label: "WhatsApp" },
  { id: "CALL", label: "Appel" },
  { id: "EMAIL", label: "Email" },
  { id: "MEETING", label: "Rendez-vous" },
];

const initialInputs = {
  monthlyRevenue: "5000000",
  monthlyLeads: "120",
  currentConversion: "5",
  leadGrowth: "25",
  targetConversion: "7",
  averageOrder: "250000",
  margin: "35",
  savedHours: "30",
  hourlyValue: "6000",
  initialInvestment: "2000000",
  monthlyCost: "150000",
};

const asNumber = (value) => Math.max(0, Number(value) || 0);
const money = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

function budgetRange(investment) {
  if (investment < 300000) return "LT_300K";
  if (investment < 1000000) return "300K_1M";
  if (investment < 3000000) return "1M_3M";
  return "GT_3M";
}

function computeScenario(inputs, multiplier = 1) {
  const leads = asNumber(inputs.monthlyLeads);
  const currentRate = asNumber(inputs.currentConversion) / 100;
  const projectedLeads = leads * (1 + (asNumber(inputs.leadGrowth) / 100) * multiplier);
  const targetRate = currentRate + ((asNumber(inputs.targetConversion) / 100) - currentRate) * multiplier;
  const currentSales = leads * currentRate;
  const projectedSales = projectedLeads * Math.max(0, targetRate);
  const additionalSales = Math.max(0, projectedSales - currentSales);
  const annualCommercialGain = additionalSales * asNumber(inputs.averageOrder) * (asNumber(inputs.margin) / 100) * 12;
  const annualProductivityGain = asNumber(inputs.savedHours) * multiplier * asNumber(inputs.hourlyValue) * 12;
  const annualBenefit = annualCommercialGain + annualProductivityGain;
  const initialInvestment = asNumber(inputs.initialInvestment);
  const annualRecurringCost = asNumber(inputs.monthlyCost) * 12;
  const firstYearCost = initialInvestment + annualRecurringCost;
  const netGain = annualBenefit - firstYearCost;
  const roi = firstYearCost > 0 ? (netGain / firstYearCost) * 100 : 0;
  const monthlyNetBenefit = (annualBenefit / 12) - asNumber(inputs.monthlyCost);
  const payback = monthlyNetBenefit > 0 ? initialInvestment / monthlyNetBenefit : null;

  return { projectedLeads, additionalSales, annualCommercialGain, annualProductivityGain, annualBenefit, annualRecurringCost, firstYearCost, netGain, roi, payback };
}

export default function CalculateurROI() {
  const [inputs, setInputs] = useState(initialInputs);
  const [showResults, setShowResults] = useState(false);
  const [lead, setLead] = useState({ fullName: "", email: "", phone: "", company: "", role: "", preferredContact: "WHATSAPP", consent: false, honeypot: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const result = useMemo(() => computeScenario(inputs), [inputs]);
  const scenarios = useMemo(() => [
    { name: "Prudent", note: "65 % des gains attendus", result: computeScenario(inputs, 0.65) },
    { name: "Réaliste", note: "Hypothèses saisies", result },
    { name: "Ambitieux", note: "135 % des gains attendus", result: computeScenario(inputs, 1.35) },
  ], [inputs, result]);

  function update(name, value) {
    setInputs((current) => ({ ...current, [name]: value }));
  }

  function revealResults(event) {
    event.preventDefault();
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setError("");
    const summary = [
      "Simulation Ronna ROI Digital",
      "",
      `Chiffre d'affaires mensuel déclaré : ${money.format(asNumber(inputs.monthlyRevenue))} FCFA`,
      `Prospects mensuels : ${money.format(asNumber(inputs.monthlyLeads))}`,
      `Conversion actuelle / visée : ${inputs.currentConversion}% / ${inputs.targetConversion}%`,
      `Croissance attendue des prospects : ${inputs.leadGrowth}%`,
      `Panier moyen : ${money.format(asNumber(inputs.averageOrder))} FCFA — marge : ${inputs.margin}%`,
      `Temps économisé : ${inputs.savedHours} h/mois à ${money.format(asNumber(inputs.hourlyValue))} FCFA/h`,
      `Investissement : ${money.format(asNumber(inputs.initialInvestment))} FCFA — coûts mensuels : ${money.format(asNumber(inputs.monthlyCost))} FCFA`,
      "",
      `Bénéfices annuels estimés : ${money.format(result.annualBenefit)} FCFA`,
      `Gain net première année : ${money.format(result.netGain)} FCFA`,
      `ROI première année : ${percent.format(result.roi)}%`,
      `Délai de récupération : ${result.payback === null ? "non atteint avec ces hypothèses" : `${result.payback.toFixed(1)} mois`}`,
      "",
      "Simulation indicative fondée sur les hypothèses du prospect. Aucun résultat financier n'est garanti.",
    ].join("\n");

    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "DEVIS",
          ...lead,
          service: "RONNA_CONSEIL_MANAGEMENT",
          subject: `Simulation ROI digital — ${lead.company}`,
          message: summary,
          budgetRange: budgetRange(asNumber(inputs.initialInvestment)),
          timeline: "DISCUSS",
          preferredContact: lead.preferredContact,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.ok === false) throw new Error(data?.message || "Impossible de transmettre la simulation.");
      trackEvent("quote_submitted", "/calculateur-roi-digital");
      setSent(true);
    } catch (submissionError) {
      setError(submissionError?.message || "Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <SEO title="Calculateur ROI Digital | Ronna Group" description="Estimez le retour sur investissement potentiel de votre projet digital et comparez trois scénarios." canonical="https://www.ronnagroup.net/calculateur-roi-digital" />
      <main className="rg-roi">
        <header className="rg-roi__hero">
          <div><span>Outil gratuit • 3 minutes</span><h1>Estimez le retour de votre investissement digital.</h1><p>Transformez vos objectifs commerciaux et vos gains de productivité en une simulation claire, avec trois niveaux de prudence.</p></div>
          <div className="rg-roi__promise"><strong>3</strong><span>scénarios comparés</span><strong>12</strong><span>mois analysés</span><strong>0</strong><span>donnée obligatoire</span></div>
        </header>

        {!showResults ? (
          <section className="rg-roi__panel">
            <div className="rg-roi__heading"><span>Vos hypothèses</span><h2>Décrivez votre activité et le projet.</h2><p>Utilisez vos chiffres habituels. Vous pourrez modifier les hypothèses après le résultat.</p></div>
            <form onSubmit={revealResults} className="rg-roi__form">
              <div className="rg-roi__group"><h3>Activité commerciale</h3><div>
                <Field label="Chiffre d’affaires mensuel" name="monthlyRevenue" value={inputs.monthlyRevenue} onChange={update} suffix="FCFA" />
                <Field label="Prospects par mois" name="monthlyLeads" value={inputs.monthlyLeads} onChange={update} />
                <Field label="Taux de conversion actuel" name="currentConversion" value={inputs.currentConversion} onChange={update} suffix="%" max="100" step="0.1" />
                <Field label="Panier / contrat moyen" name="averageOrder" value={inputs.averageOrder} onChange={update} suffix="FCFA" />
                <Field label="Marge moyenne" name="margin" value={inputs.margin} onChange={update} suffix="%" max="100" step="0.1" />
              </div></div>
              <div className="rg-roi__group"><h3>Impact attendu</h3><div>
                <Field label="Croissance des prospects" name="leadGrowth" value={inputs.leadGrowth} onChange={update} suffix="%" step="0.1" />
                <Field label="Taux de conversion visé" name="targetConversion" value={inputs.targetConversion} onChange={update} suffix="%" max="100" step="0.1" />
                <Field label="Heures économisées / mois" name="savedHours" value={inputs.savedHours} onChange={update} suffix="h" step="0.5" />
                <Field label="Valeur d’une heure" name="hourlyValue" value={inputs.hourlyValue} onChange={update} suffix="FCFA" />
              </div></div>
              <div className="rg-roi__group"><h3>Investissement</h3><div>
                <Field label="Investissement initial" name="initialInvestment" value={inputs.initialInvestment} onChange={update} suffix="FCFA" />
                <Field label="Coûts mensuels futurs" name="monthlyCost" value={inputs.monthlyCost} onChange={update} suffix="FCFA" />
              </div></div>
              <div className="rg-roi__submit"><p>Les résultats restent une estimation et ne constituent pas une garantie de performance.</p><button type="submit">Calculer mon ROI →</button></div>
            </form>
          </section>
        ) : (
          <section className="rg-roi__results">
            <div className="rg-roi__result-top">
              <div><span>Scénario réaliste • première année</span><h2>{percent.format(result.roi)}<small>%</small></h2><p>de retour sur investissement estimé</p></div>
              <div className="rg-roi__metrics">
                <article><span>Bénéfices estimés</span><strong>{money.format(result.annualBenefit)} FCFA</strong></article>
                <article><span>Gain net</span><strong className={result.netGain < 0 ? "negative" : ""}>{money.format(result.netGain)} FCFA</strong></article>
                <article><span>Récupération</span><strong>{result.payback === null ? "Non atteinte" : `${result.payback.toFixed(1)} mois`}</strong></article>
              </div>
            </div>

            <div className="rg-roi__breakdown">
              <div><span>Gain commercial annuel</span><strong>{money.format(result.annualCommercialGain)} FCFA</strong><p>Nouvelles ventes estimées après application de la croissance et de la conversion visées.</p></div>
              <div><span>Productivité annuelle</span><strong>{money.format(result.annualProductivityGain)} FCFA</strong><p>Valeur estimée du temps libéré grâce aux outils et automatisations.</p></div>
              <div><span>Coût première année</span><strong>{money.format(result.firstYearCost)} FCFA</strong><p>Investissement initial et douze mois de coûts récurrents déclarés.</p></div>
            </div>

            <div className="rg-roi__scenarios"><div className="rg-roi__heading"><span>Analyse de sensibilité</span><h2>Trois scénarios pour décider avec prudence.</h2></div><div className="rg-roi__scenario-grid">
              {scenarios.map((scenario) => <article key={scenario.name} className={scenario.name === "Réaliste" ? "featured" : ""}><span>{scenario.name}</span><small>{scenario.note}</small><strong>{percent.format(scenario.result.roi)}%</strong><p>ROI estimé</p><ul><li>Gain net : {money.format(scenario.result.netGain)} FCFA</li><li>Récupération : {scenario.result.payback === null ? "non atteinte" : `${scenario.result.payback.toFixed(1)} mois`}</li></ul></article>)}
            </div></div>

            <div className="rg-roi__notice"><strong>Comment lire cette simulation ?</strong><p>Le calcul utilise uniquement vos hypothèses. Il ne tient pas compte des impôts, du financement, de la saisonnalité ni des aléas opérationnels. Les performances réelles peuvent être inférieures ou supérieures.</p></div>

            <div className="rg-roi__actions"><button onClick={() => window.print()}>Télécharger / imprimer en PDF</button><button className="secondary" onClick={() => { setShowResults(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Modifier mes hypothèses</button><Link to="/contact?service=RONNA_CONSEIL_MANAGEMENT&subject=Analyse%20de%20ma%20simulation%20ROI">Parler à quelqu’un de l’équipe</Link></div>

            <div className="rg-roi__lead">
              {!sent ? <><div><span>Nous transmettre la simulation</span><h2>Obtenez une analyse adaptée à votre activité.</h2><p>Notre équipe recevra vos hypothèses et vos résultats afin de préparer un échange plus concret.</p><ul><li>Premier échange sans engagement</li><li>Hypothèses revues avec un conseiller</li><li>Simulation conservée dans vos demandes</li></ul></div>
                <form onSubmit={submit}>
                  <input required minLength="2" placeholder="Nom et prénom" value={lead.fullName} onChange={(e) => setLead({ ...lead, fullName: e.target.value })} />
                  <input required type="email" placeholder="Email professionnel" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
                  <input required minLength="6" placeholder="Téléphone / WhatsApp" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
                  <input required minLength="2" placeholder="Entreprise" value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })} />
                  <input required minLength="2" placeholder="Fonction" value={lead.role} onChange={(e) => setLead({ ...lead, role: e.target.value })} />
                  <select value={lead.preferredContact} onChange={(e) => setLead({ ...lead, preferredContact: e.target.value })}>{CONTACTS.map((item) => <option key={item.id} value={item.id}>Me contacter par {item.label}</option>)}</select>
                  <input className="rg-roi__trap" tabIndex="-1" autoComplete="off" aria-hidden="true" value={lead.honeypot} onChange={(e) => setLead({ ...lead, honeypot: e.target.value })} />
                  <label className="rg-roi__consent"><input required type="checkbox" checked={lead.consent} onChange={(e) => setLead({ ...lead, consent: e.target.checked })} /><span>J’accepte que RONNA GROUP utilise ces informations pour analyser ma simulation et me recontacter.</span></label>
                  {error && <p className="rg-roi__error">{error}</p>}<button disabled={sending}>{sending ? "Transmission…" : "Nous transmettre la simulation →"}</button>
                </form></> : <div className="rg-roi__success"><span>Simulation transmise</span><h2>Notre équipe a bien reçu vos résultats.</h2><p>Un accusé de réception vous a été envoyé. Nous reviendrons vers vous rapidement.</p></div>}
            </div>
          </section>
        )}
      </main>
      <style>{css}</style>
    </>
  );
}

function Field({ label, name, value, onChange, suffix, max, step = "1" }) {
  return <label><span>{label}</span><div><input required type="number" min="0" max={max} step={step} name={name} value={value} onChange={(event) => onChange(name, event.target.value)} /><em>{suffix}</em></div></label>;
}

const css = `
.rg-roi{min-height:100vh;padding:110px 18px 78px;color:#fff;background:linear-gradient(180deg,rgba(3,10,26,.98),rgba(5,18,45,.98) 55%,rgba(3,10,26,.98));overflow-x:hidden}.rg-roi *{box-sizing:border-box;min-width:0}.rg-roi__hero,.rg-roi__panel,.rg-roi__results{max-width:1080px;margin-inline:auto}.rg-roi__hero{padding:48px 0 36px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end}.rg-roi__hero>div>span,.rg-roi__heading>span,.rg-roi__result-top>div>span,.rg-roi__lead>div>span,.rg-roi__success>span{color:#87a9ff;font-size:11px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase}.rg-roi__hero h1{max-width:820px;margin:10px 0 14px;font-size:clamp(40px,6vw,68px);line-height:1;letter-spacing:-2.5px}.rg-roi__hero p{max-width:700px;margin:0;color:rgba(255,255,255,.68);font-size:16px;line-height:1.7}.rg-roi__promise{display:grid;grid-template-columns:auto auto;gap:6px 12px}.rg-roi__promise strong{color:#8cafff;font-size:23px}.rg-roi__promise span{align-self:center;color:rgba(255,255,255,.47);font-size:10px;text-transform:uppercase}.rg-roi__panel{padding:32px;border:1px solid rgba(255,255,255,.1);border-radius:26px;background:rgba(255,255,255,.03)}.rg-roi__heading h2{margin:7px 0 8px;font-size:clamp(26px,4vw,39px);letter-spacing:-.8px}.rg-roi__heading p{margin:0;color:rgba(255,255,255,.58);line-height:1.6}.rg-roi__form{margin-top:22px;display:grid;gap:12px}.rg-roi__group{padding:20px;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:rgba(3,10,26,.31)}.rg-roi__group h3{margin:0 0 14px;color:#94b0fa;font-size:11px;text-transform:uppercase;letter-spacing:1px}.rg-roi__group>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.rg-roi__group label>span{display:block;margin-bottom:6px;color:rgba(255,255,255,.62);font-size:10px}.rg-roi__group label>div{display:flex;align-items:center;border:1px solid rgba(255,255,255,.11);border-radius:11px;background:#07152f;overflow:hidden}.rg-roi__group input{width:100%;padding:12px;border:0;background:transparent;color:#fff;font:inherit}.rg-roi__group em{padding-right:11px;color:rgba(255,255,255,.38);font-style:normal;font-size:9px;white-space:nowrap}.rg-roi__submit{padding-top:7px;display:flex;align-items:center;justify-content:space-between;gap:20px}.rg-roi__submit p{margin:0;color:rgba(255,255,255,.46);font-size:10px}.rg-roi button,.rg-roi__actions a{padding:13px 18px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:#1f4fd8;color:#fff;font:inherit;font-size:12px;font-weight:850;text-decoration:none;cursor:pointer}.rg-roi button.secondary,.rg-roi__actions a{background:rgba(255,255,255,.04)}.rg-roi__result-top{padding:34px;display:grid;grid-template-columns:.75fr 1.25fr;gap:28px;border:1px solid rgba(112,149,244,.29);border-radius:26px;background:linear-gradient(120deg,rgba(31,79,216,.2),rgba(255,255,255,.03))}.rg-roi__result-top h2{margin:10px 0 0;color:#a9c0ff;font-size:clamp(54px,8vw,86px);line-height:.9;letter-spacing:-4px}.rg-roi__result-top h2 small{font-size:.35em;letter-spacing:0}.rg-roi__result-top>div>p{margin:9px 0 0;color:rgba(255,255,255,.58);font-size:12px}.rg-roi__metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;align-self:end}.rg-roi__metrics article{padding:16px;border:1px solid rgba(255,255,255,.08);border-radius:15px;background:rgba(3,10,26,.28)}.rg-roi__metrics span,.rg-roi__metrics strong{display:block}.rg-roi__metrics span{color:rgba(255,255,255,.47);font-size:9px;text-transform:uppercase;letter-spacing:.7px}.rg-roi__metrics strong{margin-top:8px;font-size:15px;line-height:1.35}.rg-roi .negative{color:#ffadad}.rg-roi__breakdown{margin-top:14px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.rg-roi__breakdown>div{padding:20px;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:rgba(255,255,255,.03)}.rg-roi__breakdown span{color:rgba(255,255,255,.5);font-size:9px;text-transform:uppercase;letter-spacing:.7px}.rg-roi__breakdown strong{display:block;margin-top:8px;color:#9bb7ff;font-size:20px}.rg-roi__breakdown p{margin:9px 0 0;color:rgba(255,255,255,.53);font-size:10px;line-height:1.6}.rg-roi__scenarios{margin-top:14px;padding:28px;border:1px solid rgba(255,255,255,.1);border-radius:22px;background:rgba(255,255,255,.025)}.rg-roi__scenario-grid{margin-top:20px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.rg-roi__scenario-grid article{padding:20px;border:1px solid rgba(255,255,255,.09);border-radius:17px;background:rgba(3,10,26,.33)}.rg-roi__scenario-grid article.featured{border-color:#628bf5;background:rgba(31,79,216,.15)}.rg-roi__scenario-grid span,.rg-roi__scenario-grid small,.rg-roi__scenario-grid strong{display:block}.rg-roi__scenario-grid span{font-size:13px;font-weight:850}.rg-roi__scenario-grid small{margin-top:4px;color:rgba(255,255,255,.43);font-size:9px}.rg-roi__scenario-grid strong{margin-top:24px;color:#9db8ff;font-size:34px}.rg-roi__scenario-grid p{margin:2px 0 15px;color:rgba(255,255,255,.45);font-size:9px;text-transform:uppercase}.rg-roi__scenario-grid ul{padding:12px 0 0;margin:0;border-top:1px solid rgba(255,255,255,.08);list-style:none;color:rgba(255,255,255,.58);font-size:10px;line-height:1.8}.rg-roi__notice{margin-top:14px;padding:18px 20px;border:1px solid rgba(255,205,94,.17);border-radius:16px;background:rgba(152,104,0,.08)}.rg-roi__notice strong{font-size:11px}.rg-roi__notice p{margin:6px 0 0;color:rgba(255,255,255,.55);font-size:10px;line-height:1.6}.rg-roi__actions{margin-top:14px;display:flex;gap:8px;flex-wrap:wrap}.rg-roi__lead{margin-top:14px;padding:30px;display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:34px;border:1px solid rgba(112,149,244,.25);border-radius:24px;background:linear-gradient(120deg,rgba(31,79,216,.13),rgba(255,255,255,.025))}.rg-roi__lead h2{margin:9px 0;font-size:28px}.rg-roi__lead>div>p,.rg-roi__success p{margin:0;color:rgba(255,255,255,.62);font-size:12px;line-height:1.7}.rg-roi__lead ul{padding:0;margin:16px 0 0;display:grid;gap:7px;list-style:none;color:rgba(255,255,255,.58);font-size:10px}.rg-roi__lead li:before{content:'✓';margin-right:8px;color:#84a7ff}.rg-roi__lead form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.rg-roi__lead input,.rg-roi__lead select{width:100%;padding:12px;border:1px solid rgba(255,255,255,.12);border-radius:11px;background:#07152f;color:#fff;font:inherit}.rg-roi__lead form>select,.rg-roi__consent,.rg-roi__lead form>button,.rg-roi__error{grid-column:1/-1}.rg-roi__consent{display:flex;gap:8px;color:rgba(255,255,255,.58);font-size:10px;line-height:1.5}.rg-roi__consent input{width:auto;margin-top:2px;accent-color:#527cf0}.rg-roi__trap{position:absolute!important;left:-9999px!important}.rg-roi__error{margin:0;color:#ffa3a3;font-size:11px}.rg-roi__success{grid-column:1/-1;padding:18px;text-align:center}.rg-roi__success h2{margin:9px 0}
@media(max-width:760px){.rg-roi{padding:88px 12px 68px}.rg-roi__hero{padding:35px 4px 28px;grid-template-columns:1fr}.rg-roi__hero h1{letter-spacing:-1.5px}.rg-roi__promise{grid-template-columns:auto 1fr}.rg-roi__panel{padding:22px 15px}.rg-roi__group{padding:16px 13px}.rg-roi__group>div,.rg-roi__metrics,.rg-roi__breakdown,.rg-roi__scenario-grid,.rg-roi__lead,.rg-roi__lead form{grid-template-columns:1fr}.rg-roi__submit{align-items:stretch;flex-direction:column}.rg-roi__result-top{padding:24px 16px;grid-template-columns:1fr}.rg-roi__scenarios{padding:22px 15px}.rg-roi__actions{display:grid}.rg-roi__actions>*{text-align:center}.rg-roi__lead{padding:22px 15px}.rg-roi__lead form>*{grid-column:1!important}}
@media print{body{background:#fff!important}.rg-roi{padding:0;background:#fff;color:#111}.rg-roi__hero,.rg-roi__panel,.rg-roi__actions,.rg-roi__lead,.rg-footer,header[role=banner]{display:none!important}.rg-roi__results{max-width:none}.rg-roi__result-top,.rg-roi__breakdown>div,.rg-roi__scenarios,.rg-roi__notice{border-color:#ddd;background:#fff;color:#111;break-inside:avoid}.rg-roi__result-top p,.rg-roi__breakdown p,.rg-roi__scenario-grid small,.rg-roi__scenario-grid p,.rg-roi__scenario-grid ul,.rg-roi__notice p{color:#444}}
`;
