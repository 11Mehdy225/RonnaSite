import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

const TOOLS = [
  { code: "01", tag: "Diagnostic", title: "Audit Express", text: "Évaluez la maturité numérique de votre entreprise et identifiez vos trois priorités.", meta: "3 min • Score /100", to: "/audit-express", action: "Lancer l’audit", featured: true },
  { code: "02", tag: "Estimation", title: "Devis Express", text: "Obtenez une première fourchette de budget et de délai pour votre projet numérique.", meta: "2 min • Estimation", to: "/devis-express", action: "Estimer mon projet", featured: true },
  { code: "03", tag: "Cadrage", title: "Cahier des charges Express", text: "Transformez votre idée en un document structuré, téléchargeable et prêt à transmettre.", meta: "5 min • Document PDF", to: "/cahier-des-charges", action: "Créer mon document", featured: true },
  { code: "04", tag: "Acquisition", title: "Diagnostic de visibilité", text: "Mesurez votre présence sur le web, Google, les réseaux et vos contenus.", meta: "4 min • Plan d’action", to: "/diagnostic-visibilite", action: "Évaluer ma visibilité" },
  { code: "05", tag: "Rentabilité", title: "Calculateur de ROI digital", text: "Simulez les gains, la rentabilité et le délai de récupération d’un investissement digital.", meta: "3 min • 3 scénarios", to: "/calculateur-roi", action: "Calculer mon ROI" },
  { code: "06", tag: "Stratégie", title: "Plan de transformation", text: "Générez une feuille de route avec priorités, phases, indicateurs et gouvernance.", meta: "5 min • Feuille de route", to: "/plan-transformation", action: "Générer mon plan" }
];

export default function Outils() {
  return <>
    <SEO title="Outils gratuits | Ronna Group" description="Diagnostics, estimation, cahier des charges, ROI et plans d’action gratuits pour préparer votre transformation numérique." canonical="https://www.ronnagroup.net/outils" />
    <main className="rg-tools">
      <header className="rg-tools__hero">
        <div><span>Ressources gratuites</span><h1>Des outils pour décider avant d’investir.</h1><p>Évaluez votre situation, structurez votre projet et préparez la prochaine étape. Chaque résultat est immédiat et peut être transmis à notre équipe uniquement si vous le souhaitez.</p></div>
        <div className="rg-tools__promise"><strong>6</strong><span>outils spécialisés</span><strong>0</strong><span>engagement</span><strong>100%</strong><span>résultats immédiats</span></div>
      </header>

      <section className="rg-tools__guide">
        <div><span>01</span><p><strong>Vous explorez ?</strong> Commencez par l’Audit Express.</p></div>
        <i />
        <div><span>02</span><p><strong>Vous avez une idée ?</strong> Utilisez Devis ou Cahier des charges.</p></div>
        <i />
        <div><span>03</span><p><strong>Vous voulez décider ?</strong> Mesurez le ROI ou créez votre plan.</p></div>
      </section>

      <section className="rg-tools__grid">
        {TOOLS.map((tool) => <article key={tool.to} className={tool.featured ? "featured" : ""}>
          <div className="rg-tools__card-top"><i>{tool.code}</i>{tool.featured && <small>Recommandé</small>}</div>
          <span>{tool.tag}</span><h2>{tool.title}</h2><p>{tool.text}</p>
          <div className="rg-tools__card-bottom"><small>{tool.meta}</small><Link to={tool.to}>{tool.action} →</Link></div>
        </article>)}
      </section>

      <section className="rg-tools__help">
        <div><span>Besoin d’orientation ?</span><h2>Vous ne savez pas quel outil choisir ?</h2><p>Présentez-nous simplement votre situation. Un membre de l’équipe vous aidera à identifier la meilleure première étape.</p></div>
        <Link to="/contact?subject=Orientation%20vers%20un%20outil%20RONNA%20GROUP">Parler à quelqu’un de l’équipe →</Link>
      </section>
    </main>
    <style>{css}</style>
  </>;
}

const css = `
.rg-tools{min-height:100vh;padding:110px 18px 78px;color:#fff;background:linear-gradient(180deg,rgba(3,10,26,.98),rgba(5,18,45,.98) 55%,rgba(3,10,26,.98));overflow-x:hidden}.rg-tools *{box-sizing:border-box;min-width:0}.rg-tools__hero,.rg-tools__guide,.rg-tools__grid,.rg-tools__help{max-width:1120px;margin-inline:auto}.rg-tools__hero{padding:52px 0 40px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:45px;align-items:end}.rg-tools__hero>div>span,.rg-tools__help>div>span{color:#87a9ff;font-size:11px;font-weight:900;letter-spacing:1.7px;text-transform:uppercase}.rg-tools__hero h1{max-width:850px;margin:10px 0 15px;font-size:clamp(42px,6.5vw,72px);line-height:.98;letter-spacing:-2.7px}.rg-tools__hero p{max-width:760px;margin:0;color:rgba(255,255,255,.66);font-size:16px;line-height:1.75}.rg-tools__promise{display:grid;grid-template-columns:auto auto;gap:6px 12px}.rg-tools__promise strong{color:#91afff;font-size:22px}.rg-tools__promise span{align-self:center;color:rgba(255,255,255,.48);font-size:10px;text-transform:uppercase;letter-spacing:.7px}.rg-tools__guide{padding:18px;display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:14px;border:1px solid rgba(255,255,255,.1);border-radius:19px;background:rgba(255,255,255,.025)}.rg-tools__guide>div{display:flex;align-items:center;gap:11px}.rg-tools__guide span{width:30px;height:30px;display:grid;place-items:center;flex:0 0 auto;border-radius:9px;background:rgba(31,79,216,.18);color:#8eacff;font-size:9px;font-weight:900}.rg-tools__guide p{margin:0;color:rgba(255,255,255,.57);font-size:11px;line-height:1.45}.rg-tools__guide strong{display:block;color:#fff}.rg-tools__guide>i{width:1px;height:34px;background:rgba(255,255,255,.1)}.rg-tools__grid{margin-top:16px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.rg-tools__grid article{min-height:285px;padding:23px;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.1);border-radius:21px;background:rgba(255,255,255,.03);transition:transform .18s ease,border-color .18s ease}.rg-tools__grid article:hover{transform:translateY(-3px);border-color:rgba(118,153,244,.38)}.rg-tools__grid article.featured{background:linear-gradient(140deg,rgba(31,79,216,.14),rgba(255,255,255,.025));border-color:rgba(112,149,244,.24)}.rg-tools__card-top{display:flex;align-items:center;justify-content:space-between}.rg-tools__card-top i{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:rgba(88,128,235,.15);color:#91afff;font-style:normal;font-size:10px;font-weight:900}.rg-tools__card-top small{padding:5px 8px;border-radius:999px;background:rgba(50,113,228,.16);color:#9ab8ff;font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:.7px}.rg-tools__grid article>span{margin-top:22px;color:#87a9ff;font-size:9px;font-weight:900;letter-spacing:1px;text-transform:uppercase}.rg-tools__grid h2{margin:7px 0 9px;font-size:21px;line-height:1.2}.rg-tools__grid article>p{margin:0;color:rgba(255,255,255,.59);font-size:12px;line-height:1.65}.rg-tools__card-bottom{margin-top:auto;padding-top:21px;display:flex;align-items:end;justify-content:space-between;gap:12px}.rg-tools__card-bottom small{color:rgba(255,255,255,.38);font-size:9px}.rg-tools__card-bottom a{color:#a5bdff;font-size:11px;font-weight:850;text-align:right;text-decoration:none}.rg-tools__help{margin-top:16px;padding:30px;display:flex;align-items:center;justify-content:space-between;gap:30px;border:1px solid rgba(112,149,244,.26);border-radius:23px;background:linear-gradient(120deg,rgba(31,79,216,.16),rgba(255,255,255,.025))}.rg-tools__help h2{margin:8px 0;font-size:27px}.rg-tools__help p{max-width:690px;margin:0;color:rgba(255,255,255,.6);font-size:12px;line-height:1.65}.rg-tools__help>a{flex:0 0 auto;padding:13px 17px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:#1f4fd8;color:#fff;font-size:11px;font-weight:850;text-decoration:none}
@media(max-width:800px){.rg-tools{padding:88px 12px 68px}.rg-tools__hero{padding:38px 4px 28px;grid-template-columns:1fr}.rg-tools__hero h1{letter-spacing:-1.7px}.rg-tools__promise{grid-template-columns:auto 1fr}.rg-tools__guide{grid-template-columns:1fr}.rg-tools__guide>i{width:100%;height:1px}.rg-tools__grid{grid-template-columns:1fr}.rg-tools__grid article{min-height:260px}.rg-tools__help{padding:23px 17px;align-items:stretch;flex-direction:column}.rg-tools__help>a{text-align:center}}
`;
