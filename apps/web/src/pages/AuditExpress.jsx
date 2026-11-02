import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

const QUESTIONS = [
  { id: "site", category: "Présence numérique", text: "Votre entreprise dispose-t-elle d’un site professionnel, rapide et adapté au mobile ?" },
  { id: "visibility", category: "Présence numérique", text: "Êtes-vous facilement visible sur Google et les réseaux utiles à votre activité ?" },
  { id: "content", category: "Présence numérique", text: "Publiez-vous régulièrement du contenu qui démontre votre expertise ?" },
  { id: "leads", category: "Commercial", text: "Centralisez-vous vos prospects et suivez-vous chaque opportunité commerciale ?" },
  { id: "conversion", category: "Commercial", text: "Mesurez-vous l’origine et le nombre de demandes qui deviennent des clients ?" },
  { id: "automation", category: "Organisation", text: "Certaines tâches répétitives sont-elles automatisées ?" },
  { id: "tools", category: "Organisation", text: "Vos équipes utilisent-elles des outils partagés pour les projets et documents ?" },
  { id: "backup", category: "Sécurité", text: "Vos données importantes sont-elles sauvegardées régulièrement ?" },
  { id: "access", category: "Sécurité", text: "Les accès sensibles sont-ils protégés par des mots de passe uniques et une double authentification ?" },
  { id: "metrics", category: "Pilotage", text: "Disposez-vous d’indicateurs simples pour prendre vos décisions ?" }
];

const OPTIONS = [
  { value: 0, label: "Pas encore" },
  { value: 1, label: "Partiellement" },
  { value: 2, label: "En place" },
  { value: 3, label: "Bien maîtrisé" }
];

const CATEGORY_ADVICE = {
  "Présence numérique": "Renforcez votre visibilité avec un site clair, des contenus réguliers et une présence locale bien référencée.",
  Commercial: "Centralisez vos prospects et mesurez les étapes qui transforment une demande en client.",
  Organisation: "Regroupez les outils, documents et responsabilités afin de réduire les tâches manuelles.",
  Sécurité: "Priorisez les sauvegardes, la gestion des accès et la double authentification.",
  Pilotage: "Définissez quelques indicateurs fiables pour suivre l’activité et décider plus vite."
};

function resultLevel(score) {
  if (score >= 80) return { title: "Maturité avancée", text: "Votre organisation possède des bases numériques solides. L’enjeu est maintenant d’optimiser et d’automatiser." };
  if (score >= 55) return { title: "Maturité structurée", text: "Plusieurs pratiques sont en place. Quelques chantiers ciblés peuvent rapidement améliorer votre performance." };
  if (score >= 30) return { title: "Maturité en construction", text: "Votre transformation est engagée, mais les outils et méthodes doivent encore être mieux structurés." };
  return { title: "Fondations à consolider", text: "Votre entreprise dispose d’un fort potentiel d’amélioration avec des actions simples et prioritaires." };
}

export default function AuditExpress() {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / QUESTIONS.length) * 100);
  const score = Math.round((Object.values(answers).reduce((sum, value) => sum + value, 0) / (QUESTIONS.length * 3)) * 100);
  const level = resultLevel(score);

  const categories = useMemo(() => {
    const grouped = {};
    QUESTIONS.forEach((question) => {
      if (!grouped[question.category]) grouped[question.category] = { total: 0, max: 0 };
      grouped[question.category].total += answers[question.id] ?? 0;
      grouped[question.category].max += 3;
    });
    return Object.entries(grouped).map(([name, values]) => ({
      name,
      score: Math.round((values.total / values.max) * 100)
    }));
  }, [answers]);

  const priorities = [...categories].sort((a, b) => a.score - b.score).slice(0, 3);

  function reset() {
    setAnswers({});
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <SEO
        title="Audit Express | Ronna Group"
        description="Évaluez gratuitement la maturité numérique de votre entreprise et obtenez vos priorités d’amélioration."
        canonical="https://www.ronnagroup.net/audit-express"
      />
      <main className="rg-audit">
        <header className="rg-audit__hero">
          <div>
            <span>Outil gratuit • 3 minutes</span>
            <h1>Évaluez la maturité numérique de votre entreprise.</h1>
            <p>Répondez à 10 questions et obtenez immédiatement un score, une lecture par domaine et trois priorités concrètes.</p>
          </div>
          <div className="rg-audit__promise">
            <strong>10</strong><span>questions</span>
            <strong>5</strong><span>domaines évalués</span>
            <strong>0</strong><span>donnée obligatoire</span>
          </div>
        </header>

        {!showResults ? (
          <section className="rg-audit__form">
            <div className="rg-audit__progress">
              <div><span>Progression</span><strong>{answered}/{QUESTIONS.length}</strong></div>
              <i><b style={{ width: `${progress}%` }} /></i>
            </div>

            <div className="rg-audit__questions">
              {QUESTIONS.map((question, index) => (
                <fieldset key={question.id}>
                  <legend>
                    <span>{String(index + 1).padStart(2, "0")} • {question.category}</span>
                    {question.text}
                  </legend>
                  <div>
                    {OPTIONS.map((option) => (
                      <label key={option.value} className={answers[question.id] === option.value ? "is-selected" : ""}>
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={answers[question.id] === option.value}
                          onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="rg-audit__submit">
              <p>{answered < QUESTIONS.length ? `Encore ${QUESTIONS.length - answered} réponse${QUESTIONS.length - answered > 1 ? "s" : ""} pour obtenir votre diagnostic.` : "Votre diagnostic est prêt."}</p>
              <button disabled={answered < QUESTIONS.length} onClick={() => { setShowResults(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                Voir mon diagnostic →
              </button>
            </div>
          </section>
        ) : (
          <section className="rg-audit__results">
            <div className="rg-audit__result-top">
              <div className="rg-audit__score" style={{ "--score": `${score * 3.6}deg` }}>
                <div><strong>{score}</strong><span>/100</span></div>
              </div>
              <div>
                <span>Votre diagnostic</span>
                <h1>{level.title}</h1>
                <p>{level.text}</p>
              </div>
            </div>

            <div className="rg-audit__breakdown">
              <h2>Votre niveau par domaine</h2>
              {categories.map((category) => (
                <div key={category.name}>
                  <p><span>{category.name}</span><strong>{category.score}%</strong></p>
                  <i><b style={{ width: `${category.score}%` }} /></i>
                </div>
              ))}
            </div>

            <div className="rg-audit__priorities">
              <span>Plan d’action recommandé</span>
              <h2>Vos trois priorités</h2>
              <div>
                {priorities.map((priority, index) => (
                  <article key={priority.name}>
                    <strong>0{index + 1}</strong>
                    <h3>{priority.name}</h3>
                    <p>{CATEGORY_ADVICE[priority.name]}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rg-audit__result-actions">
              <Link to={`/contact?service=RONNA_AUDIT&subject=${encodeURIComponent(`Accompagnement après Audit Express — score ${score}/100`)}`}>Échanger sur mes résultats</Link>
              <button onClick={() => window.print()}>Imprimer mon rapport</button>
              <button onClick={reset}>Recommencer</button>
            </div>
          </section>
        )}
      </main>
      <style>{css}</style>
    </>
  );
}

const css = `
.rg-audit { min-height:100vh; padding:110px 18px 76px; color:#fff; background:linear-gradient(180deg,rgba(3,10,26,.98),rgba(5,18,45,.98) 55%,rgba(3,10,26,.98)); }
.rg-audit__hero,.rg-audit__form,.rg-audit__results{max-width:1060px;margin:0 auto}.rg-audit__hero{padding:48px 0 38px;display:grid;grid-template-columns:1fr auto;gap:40px;align-items:end}.rg-audit__hero>div>span,.rg-audit__result-top>div>span,.rg-audit__priorities>span{color:#87a9ff;font-size:11px;font-weight:900;letter-spacing:1.7px;text-transform:uppercase}.rg-audit__hero h1{max-width:780px;margin:10px 0 14px;font-size:clamp(39px,6vw,68px);line-height:1;letter-spacing:-2.5px}.rg-audit__hero p{max-width:690px;margin:0;color:rgba(255,255,255,.68);font-size:16px;line-height:1.7}.rg-audit__promise{display:grid;grid-template-columns:auto auto;gap:5px 12px;min-width:180px}.rg-audit__promise strong{color:#88aaff;font-size:25px}.rg-audit__promise span{align-self:center;color:rgba(255,255,255,.55);font-size:11px;text-transform:uppercase;letter-spacing:.7px}
.rg-audit__progress{position:sticky;z-index:4;top:82px;padding:15px 18px;border:1px solid rgba(255,255,255,.11);border-radius:18px;background:rgba(5,18,45,.94);backdrop-filter:blur(14px)}.rg-audit__progress>div{display:flex;justify-content:space-between;margin-bottom:9px;font-size:12px}.rg-audit__progress span{color:rgba(255,255,255,.58)}.rg-audit__progress i,.rg-audit__breakdown i{display:block;height:5px;overflow:hidden;border-radius:99px;background:rgba(255,255,255,.08)}.rg-audit__progress b,.rg-audit__breakdown b{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#315fe0,#83a7ff);transition:width .25s ease}.rg-audit__questions{display:grid;gap:14px;margin-top:18px}.rg-audit fieldset{margin:0;padding:22px;border:1px solid rgba(255,255,255,.1);border-radius:22px;background:rgba(255,255,255,.03)}.rg-audit legend{width:100%;padding:0;color:#fff;font-size:17px;font-weight:800;line-height:1.45}.rg-audit legend>span{display:block;margin-bottom:7px;color:#83a6ff;font-size:10px;letter-spacing:1.1px;text-transform:uppercase}.rg-audit fieldset>div{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:17px}.rg-audit label{padding:11px 10px;border:1px solid rgba(255,255,255,.1);border-radius:13px;background:rgba(255,255,255,.025);color:rgba(255,255,255,.68);font-size:12px;text-align:center;cursor:pointer}.rg-audit label.is-selected{border-color:#527cf0;background:rgba(31,79,216,.28);color:#fff}.rg-audit label input{position:absolute;opacity:0;pointer-events:none}.rg-audit__submit{margin-top:20px;padding:20px;display:flex;align-items:center;justify-content:space-between;gap:20px;border:1px solid rgba(115,151,244,.25);border-radius:20px;background:rgba(31,79,216,.1)}.rg-audit__submit p{margin:0;color:rgba(255,255,255,.65);font-size:13px}.rg-audit button,.rg-audit__result-actions a{padding:13px 17px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:#1f4fd8;color:#fff;font:inherit;font-size:12px;font-weight:850;text-decoration:none;cursor:pointer}.rg-audit button:disabled{opacity:.38;cursor:not-allowed}
.rg-audit__results{padding-top:30px}.rg-audit__result-top{padding:38px;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:38px;border:1px solid rgba(116,151,241,.27);border-radius:28px;background:linear-gradient(120deg,rgba(31,79,216,.2),rgba(255,255,255,.03))}.rg-audit__score{--score:0deg;width:180px;height:180px;padding:12px;border-radius:50%;background:conic-gradient(#648cff var(--score),rgba(255,255,255,.08) 0)}.rg-audit__score>div{width:100%;height:100%;display:grid;place-content:center;border-radius:50%;background:#07132d;text-align:center}.rg-audit__score strong{font-size:48px;line-height:.85}.rg-audit__score span{color:rgba(255,255,255,.55);font-size:12px}.rg-audit__result-top h1{margin:9px 0 10px;font-size:clamp(31px,5vw,52px);letter-spacing:-1.5px}.rg-audit__result-top p{max-width:620px;margin:0;color:rgba(255,255,255,.68);line-height:1.7}.rg-audit__breakdown,.rg-audit__priorities{margin-top:18px;padding:28px;border:1px solid rgba(255,255,255,.1);border-radius:24px;background:rgba(255,255,255,.03)}.rg-audit__breakdown h2,.rg-audit__priorities h2{margin:0 0 22px;font-size:25px}.rg-audit__breakdown>div{margin-top:15px}.rg-audit__breakdown p{display:flex;justify-content:space-between;margin:0 0 7px;color:rgba(255,255,255,.75);font-size:13px}.rg-audit__priorities>div{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.rg-audit__priorities article{padding:20px;border:1px solid rgba(255,255,255,.08);border-radius:18px;background:rgba(3,10,26,.38)}.rg-audit__priorities article>strong{color:#7399f8;font-size:11px}.rg-audit__priorities h3{margin:20px 0 8px}.rg-audit__priorities p{margin:0;color:rgba(255,255,255,.6);font-size:13px;line-height:1.65}.rg-audit__result-actions{margin-top:20px;display:flex;gap:9px;flex-wrap:wrap}.rg-audit__result-actions button{background:rgba(255,255,255,.045)}
@media(max-width:760px){.rg-audit{padding-top:88px}.rg-audit__hero{padding:36px 0 28px;grid-template-columns:1fr}.rg-audit__hero h1{letter-spacing:-1.5px}.rg-audit__promise{grid-template-columns:auto 1fr}.rg-audit__progress{top:70px}.rg-audit fieldset{padding:18px}.rg-audit fieldset>div{grid-template-columns:1fr 1fr}.rg-audit__submit{align-items:stretch;flex-direction:column}.rg-audit__result-top{padding:26px 20px;grid-template-columns:1fr}.rg-audit__score{width:145px;height:145px}.rg-audit__priorities>div{grid-template-columns:1fr}.rg-audit__result-actions{flex-direction:column}.rg-audit__result-actions>*{text-align:center}.rg-audit__breakdown,.rg-audit__priorities{padding:22px 18px}}
@media print{body{background:#fff!important}.rg-audit{padding:0;color:#111;background:#fff}.rg-audit__hero,.rg-audit__form,.rg-footer,header[role=banner],.rg-audit__result-actions{display:none!important}.rg-audit__results{display:block}.rg-audit__result-top,.rg-audit__breakdown,.rg-audit__priorities{border-color:#ddd;background:#fff;color:#111;break-inside:avoid}.rg-audit__result-top p,.rg-audit__priorities p{color:#444}.rg-audit__score>div{background:#fff}.rg-audit__breakdown p{color:#222}}
`;
