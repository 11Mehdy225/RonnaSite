import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

const MOBILE_VISUAL = "/realisations/gboro/gboro-mobile.webp";
const FEATURES_VISUAL = "/realisations/gboro/gboro-fonctionnalites.webp";
const ECOSYSTEM_VISUAL = "/realisations/gboro/gboro-ecosysteme.webp";

const PRODUCTS = [
  {
    number: "01",
    title: "Application mobile",
    text: "Une expérience pensée pour suivre l’actualité, les compétitions, les équipes, les matchs et les classements du football ivoirien."
  },
  {
    number: "02",
    title: "Administration sportive",
    text: "Un espace central pour structurer les compétitions, administrer les clubs, les joueurs, les rencontres et les contenus éditoriaux."
  },
  {
    number: "03",
    title: "Correspondants terrain",
    text: "Une application dédiée aux contributeurs chargés de renseigner et d’actualiser les informations depuis le terrain."
  }
];

export default function GboroDetail() {
  return (
    <>
      <SEO
        title="GBORO — L’innovation numérique au service du football ivoirien"
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
          description: "Écosystème SportTech de suivi et d’administration du football ivoirien, conçu et développé par Ronna Group.",
          creator: { "@type": "Organization", name: "RONNA GROUP", url: "https://www.ronnagroup.net" }
        }}
      />

      <main className="rg-gboro">
        <section className="rg-gboro__hero">
          <div className="rg-gboro__hero-copy">
            <Link className="rg-gboro__back" to="/realisations">← Toutes les réalisations</Link>
            <div className="rg-gboro__meta">
              <span>Produit SportTech par Ronna Group</span>
              <strong><i /> En préparation de lancement</strong>
            </div>
            <h1>GBORO — L’innovation numérique au service du football ivoirien.</h1>
            <p>
              GBORO est un écosystème SportTech conçu et développé par Ronna Group.
              Il réunit une application mobile de suivi du football ivoirien, une plateforme
              d’administration des données sportives et une application destinée aux correspondants terrain.
            </p>
            <div className="rg-gboro__tags" aria-label="Composantes du produit">
              <span>Application mobile</span>
              <span>Administration</span>
              <span>Correspondants terrain</span>
            </div>
          </div>

          <figure className="rg-gboro__hero-visual">
            <img
              src={MOBILE_VISUAL}
              alt="Trois écrans de l’application mobile GBORO présentant les actualités, les équipes et le classement du football ivoirien"
              width="1536"
              height="1024"
              fetchPriority="high"
            />
            <figcaption><span>01</span> Expérience mobile</figcaption>
          </figure>
        </section>

        <section className="rg-gboro__vision">
          <div>
            <span className="rg-gboro__eyebrow">La vision</span>
            <h2>Un terrain numérique commun pour tout l’écosystème.</h2>
          </div>
          <p>
            GBORO relie l’information visible par les passionnés aux outils qui permettent de la structurer
            et de l’actualiser. Chaque interface répond à un usage précis tout en partageant une même logique produit.
          </p>
        </section>

        <section className="rg-gboro__products" aria-label="Les trois composantes de GBORO">
          {PRODUCTS.map((product) => (
            <article key={product.number}>
              <span>{product.number}</span>
              <h3>{product.title}</h3>
              <p>{product.text}</p>
            </article>
          ))}
        </section>

        <section className="rg-gboro__showcase">
          <figure className="rg-gboro__feature-visual">
            <img
              src={FEATURES_VISUAL}
              alt="Galerie des interfaces GBORO avec le suivi d’un match, les compétitions et les actualités"
              width="1536"
              height="1024"
              loading="lazy"
            />
          </figure>
          <div className="rg-gboro__showcase-copy">
            <span className="rg-gboro__eyebrow">Visuel fonctionnalités</span>
            <h2>Le football ivoirien, raconté par la donnée.</h2>
            <p>
              Scores, événements de match, compétitions suivies, actualités et navigation par équipe :
              les interfaces privilégient une lecture rapide et une identité visuelle forte.
            </p>
            <ul>
              <li>Suivi des rencontres et de leurs événements</li>
              <li>Compétitions professionnelles et amateures</li>
              <li>Actualités et contenus dédiés</li>
            </ul>
          </div>
        </section>

        <section className="rg-gboro__ecosystem">
          <div className="rg-gboro__ecosystem-copy">
            <span className="rg-gboro__eyebrow">Visuel écosystème</span>
            <h2>Une architecture conçue pour alimenter le terrain.</h2>
            <p>
              La plateforme d’administration organise les données sportives et les contenus.
              L’espace Correspondant facilite la contribution depuis le terrain. Ensemble,
              ces outils préparent une information cohérente pour l’application mobile.
            </p>
            <div className="rg-gboro__flow" aria-label="Flux fonctionnel GBORO">
              <span>Terrain</span><i>→</i><span>Administration</span><i>→</i><span>Mobile</span>
            </div>
          </div>
          <figure>
            <img
              src={ECOSYSTEM_VISUAL}
              alt="Écosystème GBORO montrant le tableau de bord d’administration sur ordinateur et l’espace Correspondant sur mobile"
              width="1672"
              height="941"
              loading="lazy"
            />
          </figure>
        </section>

        <section className="rg-gboro__launch">
          <div>
            <span className="rg-gboro__eyebrow">Prochaine étape</span>
            <h2>GBORO se prépare à entrer sur le terrain.</h2>
            <p>
              Le produit est actuellement en préparation de lancement. Les équipes poursuivent
              la consolidation de l’expérience et de l’écosystème avant sa mise à disposition publique.
            </p>
          </div>
          <Link to={`/contact?service=RONNA_WEB&subject=${encodeURIComponent("Projet SportTech similaire à GBORO")}`}>
            Discuter d’un projet similaire <span>→</span>
          </Link>
        </section>
      </main>
      <style>{css}</style>
    </>
  );
}

const css = `
.rg-gboro{min-height:100vh;padding:110px 0 76px;overflow:hidden;color:#fff;background:linear-gradient(180deg,#030a1a 0%,#061329 52%,#030a1a 100%)}
.rg-gboro *{box-sizing:border-box;min-width:0}.rg-gboro a{text-decoration:none}.rg-gboro__hero{max-width:1240px;margin:0 auto;padding:56px 28px 36px;display:grid;grid-template-columns:minmax(0,.88fr) minmax(520px,1.12fr);gap:42px;align-items:center}.rg-gboro__back{display:inline-flex;margin-bottom:31px;color:rgba(255,255,255,.55);font-size:12px;font-weight:750}.rg-gboro__back:hover{color:#fff}.rg-gboro__meta{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.rg-gboro__meta>span,.rg-gboro__eyebrow{color:#8baaff;font-size:10px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase}.rg-gboro__meta>strong{padding:8px 11px;display:inline-flex;align-items:center;gap:7px;border:1px solid rgba(72,230,135,.22);border-radius:999px;background:rgba(72,230,135,.07);color:#8cf0b4;font-size:10px}.rg-gboro__meta i{width:6px;height:6px;border-radius:50%;background:#4ee889;box-shadow:0 0 0 4px rgba(78,232,137,.12)}.rg-gboro__hero h1{max-width:650px;margin:15px 0 20px;font-size:clamp(41px,5.5vw,70px);line-height:.98;letter-spacing:-2.8px}.rg-gboro__hero-copy>p{max-width:650px;margin:0;color:rgba(255,255,255,.68);font-size:16px;line-height:1.75}.rg-gboro__tags{margin-top:25px;display:flex;gap:8px;flex-wrap:wrap}.rg-gboro__tags span{padding:9px 11px;border:1px solid rgba(255,255,255,.1);border-radius:999px;background:rgba(255,255,255,.035);color:rgba(255,255,255,.72);font-size:10px;font-weight:750}.rg-gboro__hero-visual{position:relative;margin:0;overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:30px;background:#052718;box-shadow:0 35px 100px rgba(0,0,0,.35)}.rg-gboro__hero-visual::after{content:"";position:absolute;inset:0;box-shadow:inset 0 0 80px rgba(0,0,0,.15);pointer-events:none}.rg-gboro__hero-visual img{width:100%;height:auto;display:block}.rg-gboro__hero-visual figcaption{position:absolute;z-index:1;right:18px;bottom:17px;padding:9px 12px;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(3,10,26,.78);font-size:10px;font-weight:800;backdrop-filter:blur(10px)}.rg-gboro__hero-visual figcaption span{margin-right:6px;color:#5bed8f}
.rg-gboro__vision{max-width:1184px;margin:54px auto 0;padding:48px 28px;display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:end;border-top:1px solid rgba(255,255,255,.1)}.rg-gboro__vision h2,.rg-gboro__showcase h2,.rg-gboro__ecosystem h2,.rg-gboro__launch h2{margin:10px 0 0;font-size:clamp(30px,4.2vw,48px);line-height:1.06;letter-spacing:-1.6px}.rg-gboro__vision>p,.rg-gboro__showcase-copy>p,.rg-gboro__ecosystem-copy>p,.rg-gboro__launch p{margin:0;color:rgba(255,255,255,.63);font-size:14px;line-height:1.8}.rg-gboro__products{max-width:1184px;margin:0 auto 84px;padding:0 28px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.rg-gboro__products article{padding:27px 24px;min-height:245px;border:1px solid rgba(255,255,255,.09);border-radius:22px;background:linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.018))}.rg-gboro__products article>span{color:#5bed8f;font-size:10px;font-weight:900}.rg-gboro__products h3{margin:45px 0 11px;font-size:21px}.rg-gboro__products p{margin:0;color:rgba(255,255,255,.58);font-size:13px;line-height:1.7}
.rg-gboro__showcase{max-width:1184px;margin:0 auto 24px;padding:24px 28px;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(330px,.8fr);gap:42px;align-items:center}.rg-gboro__feature-visual,.rg-gboro__ecosystem figure{margin:0;overflow:hidden;border:1px solid rgba(255,255,255,.1);border-radius:27px;background:#06251a}.rg-gboro__feature-visual img,.rg-gboro__ecosystem img{width:100%;height:auto;display:block}.rg-gboro__showcase-copy{padding:20px 0}.rg-gboro__showcase-copy ul{margin:24px 0 0;padding:0;display:grid;gap:10px;list-style:none}.rg-gboro__showcase-copy li{padding:12px 13px;border:1px solid rgba(255,255,255,.08);border-radius:13px;background:rgba(255,255,255,.025);color:rgba(255,255,255,.72);font-size:12px}.rg-gboro__showcase-copy li::before{content:"✓";margin-right:9px;color:#5bed8f;font-weight:900}
.rg-gboro__ecosystem{max-width:1184px;margin:70px auto 0;padding:58px 28px;display:grid;grid-template-columns:minmax(330px,.72fr) minmax(0,1.28fr);gap:50px;align-items:center;border-top:1px solid rgba(255,255,255,.09)}.rg-gboro__flow{margin-top:25px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.rg-gboro__flow span{padding:9px 11px;border:1px solid rgba(78,232,137,.18);border-radius:999px;background:rgba(78,232,137,.06);color:#a3f4c1;font-size:10px;font-weight:800}.rg-gboro__flow i{color:rgba(255,255,255,.35);font-style:normal}.rg-gboro__ecosystem figure{box-shadow:0 32px 90px rgba(0,0,0,.28)}
.rg-gboro__launch{max-width:1128px;margin:40px auto 0;padding:40px;display:flex;align-items:center;justify-content:space-between;gap:45px;border:1px solid rgba(91,237,143,.22);border-radius:27px;background:linear-gradient(120deg,rgba(10,91,53,.22),rgba(31,79,216,.1),rgba(255,255,255,.025))}.rg-gboro__launch>div{max-width:730px}.rg-gboro__launch h2{font-size:clamp(28px,3.7vw,42px)}.rg-gboro__launch p{margin-top:13px}.rg-gboro__launch>a{flex:0 0 auto;padding:14px 17px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:#1f4fd8;color:#fff;font-size:12px;font-weight:850}.rg-gboro__launch>a span{margin-left:5px}
@media(max-width:980px){.rg-gboro__hero{grid-template-columns:1fr}.rg-gboro__hero-visual{max-width:800px}.rg-gboro__vision{gap:35px}.rg-gboro__showcase,.rg-gboro__ecosystem{grid-template-columns:1fr}.rg-gboro__ecosystem-copy{max-width:720px}.rg-gboro__ecosystem figure{order:-1}.rg-gboro__launch{margin-inline:28px;align-items:flex-start;flex-direction:column}.rg-gboro__launch>a{align-self:stretch;text-align:center}}
@media(max-width:680px){.rg-gboro{padding-top:88px}.rg-gboro__hero{padding:37px 16px 25px;gap:28px}.rg-gboro__back{margin-bottom:24px}.rg-gboro__hero h1{font-size:clamp(38px,12vw,54px);letter-spacing:-2px}.rg-gboro__hero-copy>p{font-size:14px}.rg-gboro__hero-visual{border-radius:21px}.rg-gboro__hero-visual figcaption{right:10px;bottom:10px}.rg-gboro__vision{margin-top:35px;padding:38px 18px;grid-template-columns:1fr;gap:20px}.rg-gboro__products{padding:0 18px;margin-bottom:55px;grid-template-columns:1fr}.rg-gboro__products article{min-height:0}.rg-gboro__products h3{margin-top:27px}.rg-gboro__showcase{padding:15px 18px;grid-template-columns:1fr;gap:18px}.rg-gboro__feature-visual,.rg-gboro__ecosystem figure{border-radius:19px}.rg-gboro__ecosystem{margin-top:48px;padding:42px 18px;gap:25px}.rg-gboro__flow i{display:none}.rg-gboro__launch{margin:25px 18px 0;padding:28px 20px}.rg-gboro__launch>a{width:100%}}
`;
