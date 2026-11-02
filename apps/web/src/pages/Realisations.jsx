import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { apiUrl } from "../lib/api.js";

const METHOD = [
  { number: "01", title: "Comprendre", text: "Clarifier le besoin, les usages et les objectifs du projet." },
  { number: "02", title: "Concevoir", text: "Transformer l’idée en une expérience simple et cohérente." },
  { number: "03", title: "Développer", text: "Construire, tester et sécuriser une solution fiable." },
  { number: "04", title: "Faire évoluer", text: "Déployer, mesurer et améliorer le produit dans le temps." }
];

function projectMeta(project) {
  if (project.slug === "gboro") {
    return {
      status: "Produit en évolution",
      type: "Application sportive",
      sector: "Football ivoirien"
    };
  }

  if (project.slug === "application-gestion-de-caisse-restaurant") {
    return {
      status: "Solution métier",
      type: "Application web",
      sector: "Gestion & restauration"
    };
  }

  return {
    status: "Réalisation RONNA GROUP",
    type: project.category || "Solution digitale",
    sector: "Conception sur mesure"
  };
}

function ProjectShowcase({ project, index }) {
  const navigate = useNavigate();
  const meta = projectMeta(project);
  const detailUrl = project.slug ? `/realisations/${project.slug}` : "/realisations";

  function openDetail() {
    if (project.slug) navigate(detailUrl);
  }

  function onKeyDown(event) {
    if ((event.key === "Enter" || event.key === " ") && project.slug) {
      event.preventDefault();
      openDetail();
    }
  }

  return (
    <article
      className={`rg-work__project${index % 2 ? " rg-work__project--reverse" : ""}`}
      onClick={openDetail}
      onKeyDown={onKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`Découvrir ${project.title}`}
    >
      <div className="rg-work__visual">
        <span className="rg-work__visual-mark" aria-hidden="true">RG</span>
        {project.coverImage && (
          <img
            src={project.coverImage}
            alt={`Aperçu du projet ${project.title}`}
            loading={index === 0 ? "eager" : "lazy"}
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
        )}
        <span className="rg-work__status"><i />{meta.status}</span>
        <span className="rg-work__index">0{index + 1}</span>
      </div>

      <div className="rg-work__copy">
        <span className="rg-work__category">{project.category || "Projet digital"}</span>
        <h2>{project.title}</h2>
        <p>{project.excerpt}</p>

        <div className="rg-work__facts" aria-label="Informations sur le projet">
          <div><span>Solution</span><strong>{meta.type}</strong></div>
          <div><span>Secteur</span><strong>{meta.sector}</strong></div>
        </div>

        <div className="rg-work__actions" onClick={(event) => event.stopPropagation()}>
          <Link to={detailUrl}>Découvrir le projet <span>→</span></Link>
          <Link
            className="rg-work__action-secondary"
            to={`/contact?service=RONNA_WEB&subject=${encodeURIComponent(`Projet similaire à ${project.title}`)}`}
          >
            Projet similaire
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Realisations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => { document.title = "Ronna Group | Réalisations"; }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(apiUrl("/api/projects?limit=20&page=1"));
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data?.ok === false) {
          throw new Error(data?.message || "Les réalisations sont momentanément indisponibles.");
        }
        if (!cancelled) {
          const projects = [...(data.items || [])].sort((a, b) => {
            if (a.slug === "gboro") return -1;
            if (b.slug === "gboro") return 1;
            return 0;
          });
          setItems(projects);
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError?.message || "Une erreur réseau est survenue.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProjects();
    return () => { cancelled = true; };
  }, [reloadKey]);

  return (
    <>
      <SEO
        title="Réalisations | Ronna Group"
        description="Découvrez les applications et solutions métiers conçues par RONNA GROUP pour répondre à des usages réels."
        canonical="https://www.ronnagroup.net/realisations"
      />

      <main className="rg-work">
        <header className="rg-work__hero">
          <div className="rg-work__hero-inner">
            <span className="rg-work__eyebrow">Notre savoir-faire en action</span>
            <h1>Des solutions pensées<br />pour des usages réels.</h1>
            <p>
              De l’idée au produit, RONNA GROUP conçoit des expériences numériques
              et des outils métiers utiles, fiables et capables d’évoluer.
            </p>
            <div className="rg-work__hero-note">
              <span>{String(items.length || 2).padStart(2, "0")}</span>
              <p>solutions actuellement<br />présentées</p>
            </div>
          </div>
        </header>

        <section className="rg-work__portfolio" aria-label="Nos réalisations">
          {loading && (
            <div className="rg-work__loading" aria-label="Chargement des réalisations">
              <div /><div />
            </div>
          )}

          {!loading && error && (
            <div className="rg-work__state">
              <span>Contenu indisponible</span>
              <h2>Les réalisations ne peuvent pas être affichées pour le moment.</h2>
              <p>{error}</p>
              <button onClick={() => setReloadKey((key) => key + 1)}>Réessayer</button>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="rg-work__state">
              <span>Portfolio en préparation</span>
              <h2>De nouvelles réalisations seront bientôt présentées.</h2>
              <Link to="/contact">Parler de votre projet</Link>
            </div>
          )}

          {!loading && !error && items.map((project, index) => (
            <ProjectShowcase key={project._id} project={project} index={index} />
          ))}
        </section>

        <section className="rg-work__method">
          <div className="rg-work__section-heading">
            <div>
              <span className="rg-work__eyebrow">Notre méthode</span>
              <h2>De l’idée à la mise en production.</h2>
            </div>
            <p>Une démarche structurée pour transformer un besoin concret en solution durable.</p>
          </div>
          <div className="rg-work__method-grid">
            {METHOD.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rg-work__cta">
          <div>
            <span className="rg-work__eyebrow">Votre projet peut être le prochain</span>
            <h2>Transformons votre besoin en solution concrète.</h2>
          </div>
          <div className="rg-work__cta-actions">
            <Link to="/contact">Demander un devis</Link>
            <a href="https://wa.me/2250151704444" target="_blank" rel="noreferrer">Échanger sur WhatsApp</a>
          </div>
        </section>
      </main>
      <style>{css}</style>
    </>
  );
}

const css = `
.rg-work { min-height: 100vh; padding-top: 110px; overflow: hidden; color: #fff; background: linear-gradient(180deg, rgba(3,10,26,.98), rgba(5,18,45,.98) 54%, rgba(3,10,26,.98)); }
.rg-work a { text-decoration: none; }
.rg-work__hero { position: relative; border-bottom: 1px solid rgba(255,255,255,.08); }
.rg-work__hero-inner { position: relative; max-width: 1164px; margin: 0 auto; padding: 64px 28px 58px; }
.rg-work__eyebrow, .rg-work__state > span { color: #88aaff; font-size: 11px; font-weight: 900; letter-spacing: 1.8px; text-transform: uppercase; }
.rg-work__hero h1 { max-width: 920px; margin: 12px 0 19px; font-size: clamp(44px, 7vw, 82px); line-height: .98; letter-spacing: -3px; }
.rg-work__hero > .rg-work__hero-inner > p { max-width: 680px; margin: 0; color: rgba(255,255,255,.7); font-size: 17px; line-height: 1.75; }
.rg-work__hero-note { position: absolute; right: 28px; bottom: 58px; display: flex; align-items: center; gap: 12px; }
.rg-work__hero-note > span { color: rgba(126,162,255,.92); font-size: 38px; font-weight: 950; line-height: 1; }
.rg-work__hero-note p { margin: 0; color: rgba(255,255,255,.48); font-size: 11px; line-height: 1.4; text-transform: uppercase; letter-spacing: .7px; }
.rg-work__portfolio { max-width: 1164px; min-height: 320px; margin: 0 auto; padding: 42px 28px 80px; display: grid; gap: 28px; }
.rg-work__project { display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(330px, .88fr); min-height: 470px; overflow: hidden; border: 1px solid rgba(255,255,255,.1); border-radius: 28px; background: rgba(255,255,255,.035); cursor: pointer; transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease; }
.rg-work__project--reverse { grid-template-columns: minmax(330px, .88fr) minmax(0, 1.12fr); }
.rg-work__project--reverse .rg-work__visual { order: 2; }
.rg-work__project:hover { transform: translateY(-4px); border-color: rgba(125,160,255,.36); box-shadow: 0 28px 80px rgba(0,0,0,.25); }
.rg-work__project:focus-visible { outline: 2px solid #82a7ff; outline-offset: 4px; }
.rg-work__visual { position: relative; min-height: 470px; overflow: hidden; background: radial-gradient(circle at 25% 25%, rgba(53,98,218,.78), transparent 40%), linear-gradient(135deg, #0a1e49, #061025); }
.rg-work__visual::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(3,10,26,.42)); pointer-events: none; }
.rg-work__visual img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.rg-work__project:hover .rg-work__visual img { transform: scale(1.025); }
.rg-work__visual-mark { position: absolute; inset: 0; display: grid; place-items: center; color: rgba(255,255,255,.1); font-size: 90px; font-weight: 950; letter-spacing: 10px; }
.rg-work__status { position: absolute; z-index: 2; top: 18px; left: 18px; padding: 9px 12px; display: flex; align-items: center; gap: 7px; border: 1px solid rgba(255,255,255,.17); border-radius: 999px; background: rgba(3,10,26,.78); color: #fff; font-size: 11px; font-weight: 800; backdrop-filter: blur(10px); }
.rg-work__status i { width: 6px; height: 6px; border-radius: 50%; background: #63d99b; box-shadow: 0 0 0 4px rgba(99,217,155,.13); }
.rg-work__index { position: absolute; z-index: 2; right: 20px; bottom: 15px; color: rgba(255,255,255,.78); font-size: 12px; font-weight: 900; letter-spacing: 1.5px; }
.rg-work__copy { padding: clamp(32px, 5vw, 58px); display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
.rg-work__category { color: #88aaff; font-size: 11px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; }
.rg-work__copy h2 { margin: 13px 0 16px; font-size: clamp(30px, 4vw, 48px); line-height: 1.05; letter-spacing: -1.4px; }
.rg-work__copy > p { display: -webkit-box; overflow: hidden; margin: 0; color: rgba(255,255,255,.68); font-size: 15px; line-height: 1.75; white-space: pre-line; -webkit-box-orient: vertical; -webkit-line-clamp: 6; }
.rg-work__facts { width: 100%; margin-top: 27px; padding-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; border-top: 1px solid rgba(255,255,255,.09); }
.rg-work__facts div { display: grid; gap: 5px; }
.rg-work__facts span { color: rgba(255,255,255,.42); font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
.rg-work__facts strong { color: rgba(255,255,255,.88); font-size: 13px; }
.rg-work__actions { margin-top: 28px; display: flex; gap: 9px; flex-wrap: wrap; }
.rg-work__actions a { min-height: 44px; padding: 0 15px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,.14); border-radius: 999px; background: #1f4fd8; color: #fff; font-size: 12px; font-weight: 850; }
.rg-work__actions a span { margin-left: 5px; transition: transform .18s ease; }
.rg-work__actions a:hover span { transform: translateX(3px); }
.rg-work__actions .rg-work__action-secondary { background: rgba(255,255,255,.045); }
.rg-work__loading { display: grid; gap: 28px; }
.rg-work__loading div { min-height: 470px; border-radius: 28px; background: linear-gradient(100deg, rgba(255,255,255,.03) 20%, rgba(255,255,255,.08) 40%, rgba(255,255,255,.03) 60%); background-size: 200% 100%; animation: rg-work-loading 1.3s infinite; }
.rg-work__state { padding: 70px 24px; border: 1px solid rgba(255,255,255,.1); border-radius: 26px; background: rgba(255,255,255,.035); text-align: center; }
.rg-work__state h2 { max-width: 660px; margin: 12px auto; font-size: clamp(25px, 4vw, 38px); }
.rg-work__state p { margin: 0 auto 22px; color: rgba(255,255,255,.65); }
.rg-work__state button, .rg-work__state a { padding: 12px 17px; border: 1px solid rgba(255,255,255,.13); border-radius: 999px; background: #1f4fd8; color: #fff; cursor: pointer; font: inherit; font-weight: 800; }
.rg-work__method { max-width: 1164px; margin: 0 auto; padding: 0 28px 80px; }
.rg-work__section-heading { margin-bottom: 28px; display: flex; align-items: flex-end; justify-content: space-between; gap: 30px; }
.rg-work__section-heading h2 { margin: 9px 0 0; font-size: clamp(29px, 4vw, 44px); letter-spacing: -1.3px; }
.rg-work__section-heading > p { max-width: 430px; margin: 0; color: rgba(255,255,255,.6); line-height: 1.65; }
.rg-work__method-grid { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid rgba(255,255,255,.11); }
.rg-work__method-grid article { position: relative; padding: 25px 24px 12px 0; }
.rg-work__method-grid article:not(:last-child) { border-right: 1px solid rgba(255,255,255,.09); margin-right: 24px; }
.rg-work__method-grid article > span { color: #7399f8; font-size: 11px; font-weight: 900; }
.rg-work__method-grid h3 { margin: 30px 0 9px; font-size: 20px; }
.rg-work__method-grid p { margin: 0; color: rgba(255,255,255,.58); font-size: 13.5px; line-height: 1.65; }
.rg-work__cta { max-width: 1108px; margin: 0 auto 74px; padding: 35px 32px; display: flex; align-items: center; justify-content: space-between; gap: 30px; border: 1px solid rgba(108,145,239,.28); border-radius: 26px; background: linear-gradient(120deg, rgba(31,79,216,.22), rgba(255,255,255,.035)); }
.rg-work__cta h2 { max-width: 650px; margin: 9px 0 0; font-size: clamp(24px, 3.4vw, 36px); line-height: 1.12; }
.rg-work__cta-actions { display: flex; gap: 9px; flex-shrink: 0; }
.rg-work__cta-actions a { padding: 13px 15px; border: 1px solid rgba(255,255,255,.14); border-radius: 999px; background: #1f4fd8; color: #fff; font-size: 12px; font-weight: 850; }
.rg-work__cta-actions a:last-child { background: rgba(255,255,255,.045); }
@keyframes rg-work-loading { to { background-position-x: -200%; } }
@media (max-width: 920px) {
  .rg-work__hero-note { position: static; margin-top: 30px; }
  .rg-work__project, .rg-work__project--reverse { grid-template-columns: 1fr; }
  .rg-work__project--reverse .rg-work__visual { order: 0; }
  .rg-work__visual { min-height: 410px; }
  .rg-work__method-grid { grid-template-columns: 1fr 1fr; }
  .rg-work__method-grid article:nth-child(2) { border-right: 0; margin-right: 0; }
  .rg-work__cta { margin-inline: 28px; align-items: flex-start; flex-direction: column; }
}
@media (max-width: 650px) {
  .rg-work { padding-top: 88px; }
  .rg-work__hero-inner { padding: 42px 18px 38px; }
  .rg-work__hero h1 { letter-spacing: -2px; }
  .rg-work__hero > .rg-work__hero-inner > p { font-size: 15px; }
  .rg-work__portfolio { padding: 24px 18px 58px; gap: 20px; }
  .rg-work__project { min-height: 0; border-radius: 23px; }
  .rg-work__visual { min-height: 270px; }
  .rg-work__copy { padding: 27px 20px 30px; }
  .rg-work__copy > p { font-size: 14px; -webkit-line-clamp: 5; }
  .rg-work__facts { gap: 10px; }
  .rg-work__facts strong { font-size: 12px; }
  .rg-work__actions { width: 100%; }
  .rg-work__actions a { flex: 1; padding-inline: 10px; white-space: nowrap; }
  .rg-work__method { padding: 0 18px 58px; }
  .rg-work__section-heading { align-items: flex-start; flex-direction: column; }
  .rg-work__method-grid { grid-template-columns: 1fr; }
  .rg-work__method-grid article, .rg-work__method-grid article:not(:last-child) { margin: 0; padding: 22px 0; border-right: 0; border-bottom: 1px solid rgba(255,255,255,.08); }
  .rg-work__method-grid h3 { margin-top: 18px; }
  .rg-work__cta { margin: 0 18px 54px; padding: 27px 20px; }
  .rg-work__cta-actions { width: 100%; flex-direction: column; }
  .rg-work__cta-actions a { text-align: center; }
}
@media (max-width: 380px) {
  .rg-work__actions { flex-direction: column; }
}
`;
