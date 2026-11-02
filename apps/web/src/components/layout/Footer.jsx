import { Link } from "react-router-dom";

const NAVIGATION = [
  { label: "Le Groupe", to: "/groupe" },
  { label: "Nos services", to: "/services" },
  { label: "Réalisations", to: "/realisations" },
  { label: "Actualités", to: "/actualites" },
  { label: "Fondation", to: "/fondation" },
  { label: "Contact", to: "/contact" }
];

const SERVICES = [
  "Conseil & management",
  "Solutions web & digitales",
  "Développement d’applications",
  "Audit, sécurité & formation"
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="rg-footer">
      <div className="rg-footer__cta">
        <div>
          <span className="rg-footer__eyebrow">Construisons la suite</span>
          <h2>Un projet à concrétiser ? Parlons-en.</h2>
          <p>Notre équipe vous répond sous 24 à 48 heures ouvrées.</p>
        </div>
        <div className="rg-footer__cta-actions">
          <Link to="/contact" className="rg-footer__button rg-footer__button--primary">
            Demander un devis
          </Link>
          <a href="https://wa.me/2250151704444" target="_blank" rel="noreferrer" className="rg-footer__button rg-footer__button--ghost">
            WhatsApp
          </a>
        </div>
      </div>

      <div className="rg-footer__main">
        <div className="rg-footer__brand">
          <Link to="/" className="rg-footer__logo">RONNA GROUP</Link>
          <p>
            Nous concevons des solutions technologiques et stratégiques utiles,
            durables et adaptées aux ambitions de nos partenaires.
          </p>
          <span className="rg-footer__signature">Innovation • Technologie • Impact</span>
        </div>

        <div className="rg-footer__column">
          <h3>Navigation</h3>
          <nav aria-label="Navigation du pied de page">
            {NAVIGATION.map((item) => <Link key={item.to} to={item.to}>{item.label}</Link>)}
          </nav>
        </div>

        <div className="rg-footer__column">
          <h3>Expertises</h3>
          <div className="rg-footer__services">
            {SERVICES.map((service) => <span key={service}>{service}</span>)}
          </div>
          <Link to="/services" className="rg-footer__more">Découvrir tous nos services →</Link>
        </div>

        <div className="rg-footer__column rg-footer__contact">
          <h3>Nous contacter</h3>
          <a href="tel:+2250151704444">+225 01 51 70 44 44</a>
          <a href="mailto:contact@ronnagroup.net">contact@ronnagroup.net</a>
          <a href="https://www.google.com/maps/place/211+Rue+Iradath+Ir%C3%A8ne+Ad%C3%A9pkdjou,+Abidjan" target="_blank" rel="noopener noreferrer">
            Cocody Angré 9e Tranche<br />Abidjan, Côte d’Ivoire
          </a>
          <a href="https://www.instagram.com/ronna_group" target="_blank" rel="noopener noreferrer" className="rg-footer__social">
            Instagram ↗
          </a>
        </div>
      </div>

      <div className="rg-footer__bottom">
        <span>© {year} RONNA GROUP. Tous droits réservés.</span>
        <div>
          <Link to="/mentions-legales">Mentions légales</Link>
          <a href="mailto:contact@ronnagroup.net">Support</a>
        </div>
      </div>
      <style>{css}</style>
    </footer>
  );
}

const css = `
.rg-footer { position: relative; border-top: 1px solid rgba(255,255,255,.08); background: linear-gradient(180deg, rgba(5,18,45,.98), rgba(2,8,21,.99)); color: rgba(255,255,255,.78); }
.rg-footer a { color: inherit; text-decoration: none; }
.rg-footer__cta { max-width: 1164px; margin: 0 auto; padding: 32px 28px; display: flex; align-items: center; justify-content: space-between; gap: 28px; border-bottom: 1px solid rgba(255,255,255,.1); }
.rg-footer__eyebrow { color: #82a7ff; font-size: 11px; font-weight: 900; letter-spacing: 1.7px; text-transform: uppercase; }
.rg-footer__cta h2 { margin: 7px 0 5px; color: #fff; font-size: clamp(23px, 3vw, 34px); letter-spacing: -.7px; }
.rg-footer__cta p { margin: 0; color: rgba(255,255,255,.62); }
.rg-footer__cta-actions { display: flex; gap: 10px; flex-shrink: 0; }
.rg-footer__button { min-height: 46px; padding: 0 18px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; border: 1px solid rgba(255,255,255,.14); font-weight: 800; transition: transform .18s ease, background .18s ease; }
.rg-footer__button:hover { transform: translateY(-2px); }
.rg-footer__button--primary { background: #1f4fd8; color: #fff !important; }
.rg-footer__button--ghost { background: rgba(255,255,255,.05); color: #fff !important; }
.rg-footer__main { max-width: 1164px; margin: 0 auto; padding: 36px 28px; display: grid; grid-template-columns: 1.35fr .72fr 1.05fr 1fr; gap: clamp(24px, 4vw, 58px); }
.rg-footer__logo { display: inline-block; color: #fff !important; font-size: 15px; font-weight: 950; letter-spacing: 2px; }
.rg-footer__brand p { max-width: 310px; margin: 14px 0; line-height: 1.7; font-size: 14px; }
.rg-footer__signature { color: rgba(255,255,255,.47); font-size: 12px; }
.rg-footer__column h3 { margin: 0 0 14px; color: #fff; font-size: 14px; }
.rg-footer__column nav, .rg-footer__services, .rg-footer__contact { display: grid; align-content: start; gap: 10px; }
.rg-footer__column nav a, .rg-footer__contact a { width: fit-content; font-size: 13.5px; line-height: 1.5; transition: color .18s ease; }
.rg-footer__column nav a:hover, .rg-footer__contact a:hover { color: #fff; }
.rg-footer__services span { color: rgba(255,255,255,.62); font-size: 13.5px; line-height: 1.5; }
.rg-footer__more { display: inline-block; margin-top: 14px; color: #8eafff !important; font-size: 12.5px; font-weight: 800; }
.rg-footer__social { margin-top: 5px; color: #8eafff !important; font-weight: 800; }
.rg-footer__bottom { max-width: 1164px; margin: 0 auto; padding: 17px 28px; border-top: 1px solid rgba(255,255,255,.08); display: flex; align-items: center; justify-content: space-between; gap: 18px; color: rgba(255,255,255,.48); font-size: 12px; }
.rg-footer__bottom div { display: flex; gap: 20px; }
.rg-footer__bottom a:hover { color: rgba(255,255,255,.85); }
@media (max-width: 900px) {
  .rg-footer__main { grid-template-columns: 1.25fr 1fr 1fr; }
  .rg-footer__brand { grid-column: 1 / -1; }
  .rg-footer__brand p { max-width: 560px; }
}
@media (max-width: 680px) {
  .rg-footer__cta { padding: 28px 18px; align-items: flex-start; flex-direction: column; }
  .rg-footer__cta-actions { width: 100%; }
  .rg-footer__button { flex: 1; padding: 0 12px; font-size: 13px; }
  .rg-footer__main { padding: 30px 18px; grid-template-columns: 1fr 1fr; gap: 30px 20px; }
  .rg-footer__brand, .rg-footer__contact { grid-column: 1 / -1; }
  .rg-footer__bottom { padding: 16px 18px; align-items: flex-start; flex-direction: column; }
}
@media (max-width: 390px) {
  .rg-footer__main { grid-template-columns: 1fr; }
  .rg-footer__brand, .rg-footer__contact { grid-column: auto; }
}
`;
