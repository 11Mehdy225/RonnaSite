import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import educationImage from "../assets/fondation/foundation-education-temp.jpg";
import solidarityImage from "../assets/fondation/foundation-solidarity-temp.jpg";
import mentoringImage from "../assets/fondation/foundation-mentoring-temp.jpg";

const PILLARS = [
  { number: "01", title: "Éducation numérique", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus." },
  { number: "02", title: "Solidarité", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas faucibus mollis interdum." },
  { number: "03", title: "Entrepreneuriat", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed odio dui, cras mattis consectetur." }
];

const ACTIONS = [
  { title: "Ateliers d’initiation au numérique", category: "Éducation", image: educationImage, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur." },
  { title: "Programme de solidarité communautaire", category: "Solidarité", image: solidarityImage, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur." },
  { title: "Mentorat pour les jeunes talents", category: "Accompagnement", image: mentoringImage, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper." }
];

export default function Fondation() {
  return (
    <>
      <SEO
        title="Fondation | Ronna Group"
        description="Découvrez la vision et les futurs axes d’intervention de la Fondation RONNA GROUP."
        canonical="https://www.ronnagroup.net/fondation"
      />
      <main className="rg-foundation">
        <header className="rg-foundation__hero">
          <img src={educationImage} alt="Illustration provisoire d’un atelier numérique" />
          <div className="rg-foundation__overlay" />
          <div className="rg-foundation__hero-copy">
            <span className="rg-foundation__notice">Présentation provisoire • Contenus à venir</span>
            <p className="rg-foundation__eyebrow">Fondation RONNA GROUP</p>
            <h1>Transmettre, accompagner et créer des opportunités.</h1>
            <p className="rg-foundation__lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere consectetur est at lobortis. Nullam quis risus eget urna mollis ornare vel eu leo.</p>
            <a href="#vision">Découvrir notre vision <span>↓</span></a>
          </div>
        </header>

        <section id="vision" className="rg-foundation__vision">
          <div className="rg-foundation__section-title">
            <div>
              <span className="rg-foundation__eyebrow">Notre raison d’être</span>
              <h2>Mettre l’innovation au service de l’impact humain.</h2>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor. Etiam porta sem malesuada magna mollis euismod. Donec ullamcorper nulla non metus auctor fringilla.</p>
          </div>
          <div className="rg-foundation__pillars">
            {PILLARS.map((pillar) => (
              <article key={pillar.number}>
                <span>{pillar.number}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rg-foundation__manifesto">
          <div>
            <span className="rg-foundation__eyebrow">Notre engagement</span>
            <blockquote>« Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donner à chacun les moyens de révéler son potentiel. »</blockquote>
          </div>
          <img src={mentoringImage} alt="Illustration provisoire d’une séance de mentorat" loading="lazy" />
        </section>

        <section className="rg-foundation__actions">
          <div className="rg-foundation__section-title">
            <div>
              <span className="rg-foundation__eyebrow">Actions envisagées</span>
              <h2>Trois axes pour agir durablement.</h2>
            </div>
            <p>Les programmes présentés ci-dessous sont des exemples provisoires. Ils seront remplacés par les actions officielles de la Fondation.</p>
          </div>
          <div className="rg-foundation__actions-grid">
            {ACTIONS.map((action) => (
              <article key={action.title}>
                <div><img src={action.image} alt="Illustration provisoire" loading="lazy" /><span>{action.category}</span></div>
                <section>
                  <h3>{action.title}</h3>
                  <p>{action.text}</p>
                  <strong>Programme en préparation</strong>
                </section>
              </article>
            ))}
          </div>
        </section>

        <section className="rg-foundation__cta">
          <div>
            <span className="rg-foundation__eyebrow">Construisons un impact durable</span>
            <h2>Vous souhaitez imaginer une action avec la Fondation ?</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum.</p>
          </div>
          <div>
            <Link to="/contact?service=AUTRE&subject=Partenariat%20Fondation">Proposer un partenariat</Link>
            <a href="mailto:contact@ronnagroup.net">Nous écrire</a>
          </div>
        </section>
      </main>
      <style>{css}</style>
    </>
  );
}

const css = `
.rg-foundation{min-height:100vh;padding-top:86px;color:#fff;background:linear-gradient(180deg,rgba(3,10,26,.98),rgba(5,18,45,.98) 55%,rgba(3,10,26,.98));overflow:hidden}.rg-foundation a{text-decoration:none}.rg-foundation__hero{position:relative;max-width:1240px;min-height:650px;margin:24px auto 0;display:flex;align-items:flex-end;overflow:hidden;border:1px solid rgba(255,255,255,.1);border-radius:30px}.rg-foundation__hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.rg-foundation__overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(3,10,26,.96) 0%,rgba(3,10,26,.72) 45%,rgba(3,10,26,.1) 75%),linear-gradient(0deg,rgba(3,10,26,.7),transparent 55%)}.rg-foundation__hero-copy{position:relative;z-index:1;max-width:720px;padding:60px}.rg-foundation__notice{display:inline-flex;margin-bottom:24px;padding:8px 11px;border:1px solid rgba(255,198,102,.28);border-radius:999px;background:rgba(255,176,46,.1);color:#ffd18a;font-size:10px;font-weight:900;letter-spacing:1px;text-transform:uppercase}.rg-foundation__eyebrow{color:#8caeff;font-size:11px;font-weight:900;letter-spacing:1.7px;text-transform:uppercase}.rg-foundation__hero h1{margin:10px 0 18px;font-size:clamp(43px,6vw,75px);line-height:.98;letter-spacing:-2.6px}.rg-foundation__lead{max-width:640px;margin:0;color:rgba(255,255,255,.74);font-size:16px;line-height:1.75}.rg-foundation__hero-copy>a{display:inline-flex;margin-top:27px;padding:13px 17px;border-radius:999px;background:#1f4fd8;color:#fff;font-size:12px;font-weight:850}.rg-foundation__hero-copy>a span{margin-left:8px}.rg-foundation__vision,.rg-foundation__actions{max-width:1164px;margin:0 auto;padding:90px 28px}.rg-foundation__section-title{display:grid;grid-template-columns:1.2fr .8fr;gap:70px;align-items:end}.rg-foundation__section-title h2{max-width:720px;margin:10px 0 0;font-size:clamp(31px,4.6vw,52px);line-height:1.05;letter-spacing:-1.6px}.rg-foundation__section-title>p{margin:0;color:rgba(255,255,255,.63);line-height:1.75}.rg-foundation__pillars{margin-top:42px;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(255,255,255,.11)}.rg-foundation__pillars article{padding:28px 30px 10px 0}.rg-foundation__pillars article:not(:last-child){margin-right:30px;border-right:1px solid rgba(255,255,255,.09)}.rg-foundation__pillars article>span{color:#769bf8;font-size:11px;font-weight:900}.rg-foundation__pillars h3{margin:35px 0 10px;font-size:21px}.rg-foundation__pillars p{margin:0;color:rgba(255,255,255,.58);font-size:13.5px;line-height:1.7}.rg-foundation__manifesto{max-width:1164px;margin:0 auto;display:grid;grid-template-columns:.9fr 1.1fr;overflow:hidden;border:1px solid rgba(255,255,255,.1);border-radius:28px;background:rgba(255,255,255,.035)}.rg-foundation__manifesto>div{padding:clamp(35px,6vw,70px);display:flex;flex-direction:column;justify-content:center}.rg-foundation__manifesto blockquote{margin:20px 0 0;font-size:clamp(25px,3.7vw,42px);font-weight:850;line-height:1.2;letter-spacing:-1px}.rg-foundation__manifesto img{width:100%;height:100%;min-height:440px;object-fit:cover}.rg-foundation__actions-grid{margin-top:38px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.rg-foundation__actions-grid article{overflow:hidden;border:1px solid rgba(255,255,255,.1);border-radius:23px;background:rgba(255,255,255,.03)}.rg-foundation__actions-grid article>div{position:relative;height:245px;overflow:hidden}.rg-foundation__actions-grid img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}.rg-foundation__actions-grid article:hover img{transform:scale(1.025)}.rg-foundation__actions-grid article>div span{position:absolute;left:13px;top:13px;padding:7px 10px;border:1px solid rgba(255,255,255,.17);border-radius:999px;background:rgba(3,10,26,.78);font-size:10px;font-weight:850}.rg-foundation__actions-grid section{padding:22px}.rg-foundation__actions-grid h3{margin:0 0 10px;font-size:21px;line-height:1.2}.rg-foundation__actions-grid p{margin:0;color:rgba(255,255,255,.61);font-size:13.5px;line-height:1.7}.rg-foundation__actions-grid strong{display:block;margin-top:18px;color:#84a7ff;font-size:11px;text-transform:uppercase;letter-spacing:.8px}.rg-foundation__cta{max-width:1108px;margin:0 auto 76px;padding:36px;display:flex;align-items:center;justify-content:space-between;gap:35px;border:1px solid rgba(111,148,243,.28);border-radius:26px;background:linear-gradient(120deg,rgba(31,79,216,.21),rgba(255,255,255,.035))}.rg-foundation__cta h2{max-width:680px;margin:9px 0 8px;font-size:clamp(25px,3.6vw,38px);line-height:1.1}.rg-foundation__cta p{margin:0;color:rgba(255,255,255,.62)}.rg-foundation__cta>div:last-child{display:flex;gap:9px;flex-shrink:0}.rg-foundation__cta a{padding:13px 15px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:#1f4fd8;color:#fff;font-size:12px;font-weight:850}.rg-foundation__cta a:last-child{background:rgba(255,255,255,.045)}
@media(max-width:900px){.rg-foundation__hero{margin-inline:18px}.rg-foundation__hero-copy{padding:40px}.rg-foundation__section-title{grid-template-columns:1fr;gap:20px}.rg-foundation__manifesto{margin-inline:28px;grid-template-columns:1fr}.rg-foundation__manifesto img{min-height:360px}.rg-foundation__actions-grid{grid-template-columns:1fr 1fr}.rg-foundation__cta{margin-inline:28px;align-items:flex-start;flex-direction:column}}
@media(max-width:650px){.rg-foundation{padding-top:72px}.rg-foundation__hero{min-height:650px;margin-top:16px;border-radius:23px}.rg-foundation__overlay{background:linear-gradient(0deg,rgba(3,10,26,.98) 0%,rgba(3,10,26,.62) 68%,rgba(3,10,26,.18))}.rg-foundation__hero-copy{padding:28px 20px}.rg-foundation__hero h1{letter-spacing:-1.7px}.rg-foundation__vision,.rg-foundation__actions{padding:62px 18px}.rg-foundation__pillars{grid-template-columns:1fr}.rg-foundation__pillars article,.rg-foundation__pillars article:not(:last-child){margin:0;padding:23px 0;border-right:0;border-bottom:1px solid rgba(255,255,255,.08)}.rg-foundation__pillars h3{margin-top:17px}.rg-foundation__manifesto{margin-inline:18px}.rg-foundation__manifesto>div{padding:30px 20px}.rg-foundation__manifesto img{min-height:280px}.rg-foundation__actions-grid{grid-template-columns:1fr}.rg-foundation__cta{margin:0 18px 55px;padding:27px 20px}.rg-foundation__cta>div:last-child{width:100%;flex-direction:column}.rg-foundation__cta a{text-align:center}}
`;
