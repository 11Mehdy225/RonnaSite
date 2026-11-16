import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

const MOBILE_VISUAL = "/realisations/gboro/gboro-mobile.webp";
const FEATURES_VISUAL = "/realisations/gboro/gboro-fonctionnalites.webp";
const ECOSYSTEM_VISUAL = "/realisations/gboro/gboro-ecosysteme.webp";

const MOBILE_FEATURES = [
  { icon: "◷", title: "Calendrier et résultats", text: "Les rencontres à venir et les scores dans une lecture immédiate." },
  { icon: "⚽", title: "Match Center et événements", text: "Le déroulé des matchs et leurs principaux faits de jeu." },
  { icon: "🏆", title: "Compétitions et classements", text: "Les championnats, leurs journées et leurs classements détaillés." },
  { icon: "◇", title: "Clubs et actualités", text: "Les équipes ivoiriennes et les contenus qui font vivre leur saison." }
];

const ECOSYSTEM_ITEMS = [
  { title: "GBORO Mobile", text: "L’interface destinée aux supporters pour suivre le football ivoirien au quotidien." },
  { title: "GBORO Admin", text: "La gestion centralisée des clubs, joueurs, compétitions, matchs et contenus." },
  { title: "GBORO Correspondant", text: "L’interface des correspondants autorisés pour couvrir les rencontres et transmettre les informations du terrain." }
];

const EXPERTISES = [
  "Conception et UX/UI",
  "Développement React Native / Expo",
  "Développement React",
  "API Node.js / Express",
  "Base de données PostgreSQL / Prisma",
  "Gestion des rôles et des données sportives",
  "Synchronisation des informations des matchs"
];

export default function GboroDetail() {
  return (
    <>
      <SEO
        title="GBORO — Le football ivoirien à portée de main"
        description="Découvrez GBORO, l’écosystème SportTech conçu par Ronna Group pour le suivi et l’administration du football ivoirien. Produit en préparation de lancement."
        canonical="https://www.ronnagroup.net/realisations/gboro"
        image={MOBILE_VISUAL}
        type="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "GBORO",
          applicationCategory: "SportsApplication",
          operatingSystem: "Mobile et Web",
          description: "Écosystème SportTech en préparation de lancement, conçu et développé par Ronna Group pour le football ivoirien.",
          creator: { "@type": "Organization", name: "RONNA GROUP", url: "https://www.ronnagroup.net" }
        }}
      />

      <main className="rg-gboro">
        <section className="rg-gboro__hero">
          <div className="rg-gboro__hero-copy">
            <Link className="rg-gboro__back" to="/realisations">← Toutes les réalisations</Link>
            <span className="rg-gboro__eyebrow">Réalisation / SportTech</span>
            <h1>GBORO</h1>
            <h2>Le football ivoirien à portée de main.</h2>
            <p>
              Un écosystème numérique conçu par Ronna Group pour suivre le football ivoirien,
              structurer ses données sportives et connecter les acteurs présents sur le terrain.
            </p>
            <div className="rg-gboro__badges" aria-label="Technologies et domaine">
              <span>Mobile</span><span>Web</span><span>API</span><span>SportTech</span>
            </div>
            <a className="rg-gboro__explore" href="#fonctionnalites">Explorer les fonctionnalités <span>↓</span></a>
          </div>

          <figure className="rg-gboro__hero-visual">
            <img
              src={MOBILE_VISUAL}
              alt="Trois écrans de l’application GBORO présentant les actualités, les équipes et le classement du football ivoirien"
              width="1536"
              height="1024"
              fetchPriority="high"
            />
          </figure>
        </section>

        <section className="rg-gboro__intro">
          <div className="rg-gboro__section-grid">
            <div>
              <span className="rg-gboro__eyebrow">Le projet</span>
              <h2>Une nouvelle expérience pour le football ivoirien.</h2>
            </div>
            <div className="rg-gboro__intro-copy">
              <p>Les informations sportives sont souvent réparties entre plusieurs sources et difficiles à consulter de manière cohérente.</p>
              <p>Ronna Group développe GBORO pour réunir le suivi mobile, l’administration des données et la contribution depuis le terrain dans un même écosystème.</p>
              <p>La solution s’adresse aux supporters, aux clubs, aux organisateurs et aux correspondants autorisés.</p>
              <strong><i /> Produit en préparation de lancement</strong>
            </div>
          </div>
        </section>

        <section className="rg-gboro__mobile" id="fonctionnalites">
          <div className="rg-gboro__section-head">
            <span>01 / Application mobile</span>
            <h2>Toute la passion du football dans une application.</h2>
            <p>Une interface directe pour consulter les rencontres, suivre les compétitions et rester connecté aux clubs et aux actualités.</p>
          </div>
          <figure className="rg-gboro__mobile-visual">
            <img
              src={MOBILE_VISUAL}
              alt="Présentation des interfaces principales de l’application mobile GBORO sur trois smartphones"
              width="1536"
              height="1024"
            />
          </figure>
          <div className="rg-gboro__feature-grid">
            {MOBILE_FEATURES.map((feature) => (
              <article key={feature.title}>
                <span aria-hidden="true">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rg-gboro__experience">
          <figure>
            <img
              src={FEATURES_VISUAL}
              alt="Interfaces GBORO présentant le Match Center, les compétitions et les actualités"
              width="1536"
              height="1024"
              loading="lazy"
            />
          </figure>
          <div>
            <span className="rg-gboro__eyebrow">02 / Fonctionnalités</span>
            <h2>Une expérience pensée pour les passionnés.</h2>
            <p>
              GBORO facilite le suivi des rencontres et de leurs événements, la consultation
              des compétitions et l’accès aux contenus éditoriaux liés au football ivoirien.
            </p>
            <ul>
              <li>Suivre le déroulé des rencontres</li>
              <li>Explorer compétitions et classements</li>
              <li>Retrouver les actualités des équipes</li>
            </ul>
          </div>
        </section>

        <section className="rg-gboro__ecosystem">
          <div className="rg-gboro__center-head">
            <span className="rg-gboro__eyebrow">03 / Écosystème</span>
            <h2>Bien plus qu’une application mobile.</h2>
          </div>
          <figure>
            <img
              src={ECOSYSTEM_VISUAL}
              alt="Écosystème GBORO avec le tableau de bord Admin sur ordinateur et l’application Correspondant sur smartphone"
              width="1672"
              height="941"
              loading="lazy"
            />
          </figure>
          <div className="rg-gboro__ecosystem-grid">
            {ECOSYSTEM_ITEMS.map((item) => (
              <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>
            ))}
          </div>
        </section>

        <section className="rg-gboro__expertise">
          <div>
            <span className="rg-gboro__eyebrow">Expertise Ronna Group</span>
            <h2>Une expertise technologique de bout en bout.</h2>
            <p>De la conception des parcours jusqu’à la circulation des données sportives, GBORO mobilise des expertises complémentaires.</p>
          </div>
          <ul>
            {EXPERTISES.map((expertise, index) => <li key={expertise}><span>{String(index + 1).padStart(2, "0")}</span>{expertise}</li>)}
          </ul>
        </section>

        <section className="rg-gboro__cta">
          <div>
            <span className="rg-gboro__eyebrow">Construisons la suite</span>
            <h2>Vous avez un projet digital ambitieux ?</h2>
            <p>Ronna Group accompagne la conception et le développement de solutions numériques adaptées aux besoins des entreprises et des organisations.</p>
          </div>
          <Link to={`/contact?service=RONNA_WEB&subject=${encodeURIComponent("Projet digital ambitieux — échange avec Ronna Group")}`}>
            Discutons de votre projet <span>→</span>
          </Link>
        </section>
      </main>
      <style>{css}</style>
    </>
  );
}

const css = `
.rg-gboro{--green:#16c875;--deep-green:#071b14;--orange:#ff7900;--muted:#a9bbb3;min-height:100vh;padding-top:110px;overflow:hidden;color:#fff;background:#030a1a}.rg-gboro *{box-sizing:border-box;min-width:0}.rg-gboro a{text-decoration:none}.rg-gboro__eyebrow{display:block;color:#8baaff;font-size:10px;font-weight:900;letter-spacing:1.7px;text-transform:uppercase}
.rg-gboro__hero{max-width:1200px;margin:0 auto;padding:62px 28px 78px;display:grid;grid-template-columns:minmax(0,2fr) minmax(0,3fr);gap:50px;align-items:center}.rg-gboro__back{display:inline-flex;margin-bottom:34px;color:rgba(255,255,255,.55);font-size:12px;font-weight:750}.rg-gboro__back:hover{color:#fff}.rg-gboro__hero h1{margin:16px 0 0;font-size:clamp(62px,8vw,104px);line-height:.82;letter-spacing:-4px}.rg-gboro__hero h2{max-width:480px;margin:22px 0 16px;font-size:clamp(28px,3.5vw,43px);line-height:1.04;letter-spacing:-1.5px}.rg-gboro__hero-copy>p{max-width:520px;margin:0;color:rgba(255,255,255,.68);font-size:15px;line-height:1.75}.rg-gboro__badges{margin-top:23px;display:flex;gap:7px;flex-wrap:wrap}.rg-gboro__badges span{padding:8px 11px;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(255,255,255,.035);color:rgba(255,255,255,.74);font-size:10px;font-weight:800}.rg-gboro__explore{margin-top:28px;display:inline-flex;align-items:center;gap:8px;color:#fff;font-size:12px;font-weight:850}.rg-gboro__explore span{color:var(--green);transition:transform .25s ease}.rg-gboro__explore:hover span{transform:translateY(3px)}.rg-gboro__hero-visual{aspect-ratio:3/2;margin:0;display:grid;place-items:center;overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:20px;background:var(--deep-green);box-shadow:0 24px 70px rgba(0,0,0,.28)}.rg-gboro__hero-visual img{width:100%;height:100%;display:block;object-fit:contain}
.rg-gboro__intro{padding:76px 28px;background:#f2f5f3;color:#07150f}.rg-gboro__section-grid{max-width:1144px;margin:0 auto;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:80px}.rg-gboro__intro .rg-gboro__eyebrow{color:#237654}.rg-gboro__intro h2,.rg-gboro__mobile h2,.rg-gboro__experience h2,.rg-gboro__ecosystem h2,.rg-gboro__expertise h2,.rg-gboro__cta h2{margin:10px 0 0;font-size:clamp(31px,4.4vw,52px);line-height:1.04;letter-spacing:-1.8px}.rg-gboro__intro-copy{display:grid;gap:12px}.rg-gboro__intro-copy p{margin:0;color:#42544c;font-size:14px;line-height:1.75}.rg-gboro__intro-copy strong{width:max-content;margin-top:7px;padding:9px 12px;display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(6,111,65,.17);border-radius:999px;background:rgba(22,200,117,.08);color:#0b7247;font-size:10px}.rg-gboro__intro-copy i{width:6px;height:6px;border-radius:50%;background:var(--green)}
.rg-gboro__mobile{padding:86px 28px;background:var(--deep-green)}.rg-gboro__section-head{max-width:760px;margin:0 auto 34px;text-align:center}.rg-gboro__section-head>span{color:var(--green);font-size:10px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase}.rg-gboro__section-head>p{max-width:630px;margin:15px auto 0;color:var(--muted);font-size:14px;line-height:1.75}.rg-gboro__mobile-visual{max-width:1100px;aspect-ratio:3/2;margin:0 auto;display:grid;place-items:center;overflow:hidden;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:#05150f}.rg-gboro__mobile-visual img{width:100%;height:100%;display:block;object-fit:contain}.rg-gboro__feature-grid{max-width:1100px;margin:18px auto 0;display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.rg-gboro__feature-grid article{padding:22px 18px;border:1px solid rgba(255,255,255,.1);border-radius:15px;background:rgba(255,255,255,.035)}.rg-gboro__feature-grid article>span{width:35px;height:35px;display:grid;place-items:center;border:1px solid rgba(22,200,117,.25);border-radius:10px;color:var(--green);font-size:17px}.rg-gboro__feature-grid h3{margin:22px 0 8px;font-size:15px}.rg-gboro__feature-grid p{margin:0;color:var(--muted);font-size:11px;line-height:1.55}
.rg-gboro__experience{max-width:1200px;margin:0 auto;padding:90px 28px;display:grid;grid-template-columns:minmax(0,3fr) minmax(320px,2fr);gap:50px;align-items:center}.rg-gboro__experience figure,.rg-gboro__ecosystem figure{margin:0;overflow:hidden;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:var(--deep-green)}.rg-gboro__experience img,.rg-gboro__ecosystem img{width:100%;height:auto;display:block;object-fit:contain}.rg-gboro__experience>div>p{margin:16px 0 0;color:rgba(255,255,255,.64);font-size:14px;line-height:1.75}.rg-gboro__experience ul{margin:24px 0 0;padding:0;display:grid;gap:10px;list-style:none}.rg-gboro__experience li{padding:11px 0;border-bottom:1px solid rgba(255,255,255,.09);color:rgba(255,255,255,.75);font-size:12px}.rg-gboro__experience li::before{content:"✓";margin-right:9px;color:var(--green);font-weight:900}
.rg-gboro__ecosystem{padding:82px 28px;background:#081326}.rg-gboro__center-head{max-width:760px;margin:0 auto 35px;text-align:center}.rg-gboro__ecosystem figure{max-width:1144px;margin:0 auto}.rg-gboro__ecosystem-grid{max-width:1144px;margin:14px auto 0;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.rg-gboro__ecosystem-grid article{padding:25px 22px;border:1px solid rgba(255,255,255,.09);border-radius:15px;background:rgba(255,255,255,.028)}.rg-gboro__ecosystem-grid h3{margin:0 0 9px;font-size:17px}.rg-gboro__ecosystem-grid p{margin:0;color:rgba(255,255,255,.57);font-size:12px;line-height:1.65}
.rg-gboro__expertise{max-width:1144px;margin:0 auto;padding:90px 28px;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:80px}.rg-gboro__expertise>div>p{margin:17px 0 0;color:rgba(255,255,255,.61);font-size:14px;line-height:1.75}.rg-gboro__expertise ul{margin:0;padding:0;display:grid;list-style:none;border-top:1px solid rgba(255,255,255,.1)}.rg-gboro__expertise li{padding:14px 0;display:flex;align-items:center;gap:16px;border-bottom:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.78);font-size:13px}.rg-gboro__expertise li span{color:var(--green);font-size:9px;font-weight:900}
.rg-gboro__cta{max-width:1144px;margin:0 auto 76px;padding:43px 40px;display:flex;align-items:center;justify-content:space-between;gap:45px;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:#07111f}.rg-gboro__cta>div{max-width:750px}.rg-gboro__cta h2{font-size:clamp(29px,4vw,45px)}.rg-gboro__cta p{margin:14px 0 0;color:rgba(255,255,255,.62);font-size:13px;line-height:1.7}.rg-gboro__cta>a{flex:0 0 auto;padding:14px 17px;border-radius:999px;background:#1f4fd8;color:#fff;font-size:12px;font-weight:850}.rg-gboro__cta>a span{margin-left:5px}
@media(max-width:960px){.rg-gboro__hero{grid-template-columns:1fr;gap:34px}.rg-gboro__hero-copy{max-width:700px}.rg-gboro__hero-visual{max-width:850px}.rg-gboro__section-grid,.rg-gboro__expertise{gap:42px}.rg-gboro__feature-grid{grid-template-columns:1fr 1fr}.rg-gboro__experience{grid-template-columns:1fr}.rg-gboro__experience>div{max-width:720px}.rg-gboro__ecosystem-grid{grid-template-columns:1fr 1fr}.rg-gboro__ecosystem-grid article:last-child{grid-column:1/-1}.rg-gboro__cta{margin-inline:28px;align-items:flex-start;flex-direction:column}.rg-gboro__cta>a{align-self:stretch;text-align:center}}
@media(max-width:680px){.rg-gboro{padding-top:88px}.rg-gboro__hero{padding:39px 16px 54px}.rg-gboro__back{margin-bottom:28px}.rg-gboro__hero h1{font-size:68px;letter-spacing:-3px}.rg-gboro__hero h2{margin-top:18px}.rg-gboro__hero-copy>p{font-size:14px}.rg-gboro__hero-visual,.rg-gboro__mobile-visual{border-radius:16px}.rg-gboro__intro{padding:56px 18px}.rg-gboro__section-grid,.rg-gboro__expertise{grid-template-columns:1fr;gap:27px}.rg-gboro__mobile{padding:62px 16px}.rg-gboro__section-head{text-align:left}.rg-gboro__feature-grid{grid-template-columns:1fr}.rg-gboro__feature-grid article{display:grid;grid-template-columns:auto 1fr;column-gap:13px}.rg-gboro__feature-grid h3{margin:2px 0 6px}.rg-gboro__feature-grid p{grid-column:2}.rg-gboro__experience{padding:64px 18px;gap:27px}.rg-gboro__ecosystem{padding:62px 18px}.rg-gboro__center-head{text-align:left}.rg-gboro__ecosystem-grid{grid-template-columns:1fr}.rg-gboro__ecosystem-grid article:last-child{grid-column:auto}.rg-gboro__expertise{padding:64px 18px}.rg-gboro__cta{margin:0 18px 58px;padding:30px 21px}.rg-gboro__cta>a{width:100%}}
@media(prefers-reduced-motion:reduce){.rg-gboro *{scroll-behavior:auto!important;transition:none!important}}
`;
