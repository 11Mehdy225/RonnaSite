import maps from "../../assets/brands/services/maps.png"

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  // Accordéon mobile
  const [open, setOpen] = useState({
    nav: false,
    services: false,
    contact: true,
    social: false
  });

  const toggle = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  const NAV = useMemo(
    () => [
      { label: "Accueil", to: "/" },
      { label: "Le Groupe", to: "/groupe" },
      { label: "Services", to: "/services" },
      { label: "Actualités", to: "/actualites" },
      { label: "Réalisations", to: "/realisations" },
      { label: "Fondation", to: "/fondation" },
      { label: "Contact", to: "/contact" }
    ],
    []
  );

  const SERVICES = useMemo(
    () => [
      "Ronna Digital",
      "Ronna Web",
      "Ronna TV",
      "Ronna Développement",
      "Ronna Sécurité",
      "Ronna Audit",
      "Ronna Formation",
      "Ronna Conseil & Management"
    ],
    []
  );

  return (
    <footer style={styles.footer}>
      <div style={styles.top}>
        {/* DESKTOP */}
        <div style={styles.grid} className="rgFooterDesktop">
          {/* Col 1 */}
          <div style={styles.col}>
            <div style={styles.brand}>RONNA GROUP</div>
            <div style={styles.tag}>Innovation • Technologie • Impact</div>

            <div style={styles.meta}>
              <div style={styles.metaRow}>
                <span style={styles.metaLabel}>Téléphone</span>
                <a style={styles.metaValue} href="tel:+2250151704444">
                  +225 01 51 70 44 44
                </a>
              </div>
              <div style={styles.metaRow}>
                <span style={styles.metaLabel}>Email</span>
                <a style={styles.metaValue} href="ronnagroup4u@gmail.com">
                  ronnagroup4u@gmail.com
                </a>
              </div>
              <div style={styles.metaRow}>
  <span style={styles.metaLabel}>Localisation</span>

  <a
    href="https://www.google.com/maps/place/211+Rue+Iradath+Ir%C3%A8ne+Ad%C3%A9pkdjou,+Abidjan/@5.3799789,-3.9742623,17z/data=!3m1!4b1!4m6!3m5!1s0xfc1ecb4bc6ab62f:0xf4acf67422812875!8m2!3d5.3799789!4d-3.9716874!16s%2Fg%2F11xfsqs741?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D"
    target="_blank"
    rel="noopener noreferrer"
    style={styles.mapLink}
  >
    <img
      src={maps}
      alt="Localisation Ronna Group"
      style={styles.mapThumb}
    />
    <span style={styles.metaValue}>Cocody Angré 9e Tranche</span>
  </a>
</div>
            </div>
          </div>

          {/* Col 2 */}
          <div style={styles.col}>
            <div style={styles.h}>Navigation</div>
            <div style={styles.links}>
              {NAV.map((i) => (
                <Link key={i.to} style={styles.link} to={i.to}>
                  {i.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 */}
          <div style={styles.col}>
            <div style={styles.h}>Nos services</div>
            <div style={styles.links}>
              {SERVICES.map((s) => (
                <span key={s} style={styles.linkMuted}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4 */}
          <div style={styles.col}>
            <div style={styles.h}>Travaillons ensemble</div>
            <div style={styles.p}>
              Un besoin, une idée, un projet ? Décrivez votre demande et nous
              revenons vers vous rapidement.
            </div>

            <div style={styles.ctaRow}>
              <Link to="/contact" style={styles.ctaPrimary}>
                Demander un devis
              </Link>
              <a
                href="https://wa.me/2250151704444"
                target="_blank"
                rel="noreferrer"
                style={styles.ctaGhost}
              >
                WhatsApp
              </a>
            </div>

            <div style={styles.socialRow}>
              <a href="#" style={styles.social}>
                LinkedIn
              </a>
              <a href="https://www.instagram.com/ronna_group?igsh=NGE3b3k1NzByMnA1&utm_source=qr" style={styles.social}>
                Instagram
              </a>
              <a href="#" style={styles.social}>
                facebook
              </a>
              <a href="#" style={styles.social}>
                tiktok
              </a>
            </div>
          </div>
        </div>

        {/* MOBILE ACCORDEON */}
        <div style={styles.mobileWrap} className="rgFooterMobile">
          {/* Brand */}
          <div style={styles.mobileBrand}>
            <div style={styles.brand}>RONNA GROUP</div>
            <div style={styles.tag}>Innovation • Technologie • Impact</div>
          </div>

          <Accordion
            title="Contact"
            open={open.contact}
            onToggle={() => toggle("contact")}
          >
            <div style={styles.mobileList}>
              <div style={styles.metaRow}>
                <span style={styles.metaLabel}>Téléphone</span>
                <a style={styles.metaValue} href="tel:+2250151704444">
                  +225 01 51 70 44 44
                </a>
              </div>
              <div style={styles.metaRow}>
                <span style={styles.metaLabel}>Email</span>
                <a style={styles.metaValue} href="mailto:llkkkk@gmail.com">
                  llkkkk@gmail.com
                </a>
              </div>
              <div style={styles.metaRow}>
                <span style={styles.metaLabel}>Localisation</span>
                <span style={styles.metaValue}>Cocody Angré 9e Tranche</span>
              </div>

              <div style={{ ...styles.ctaRow, marginTop: 10 }}>
                <Link to="/contact" style={styles.ctaPrimary}>
                  Demander un devis
                </Link>
                <a
                  href="https://wa.me/2250151704444"
                  target="_blank"
                  rel="noreferrer"
                  style={styles.ctaGhost}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Navigation"
            open={open.nav}
            onToggle={() => toggle("nav")}
          >
            <div style={styles.mobileLinks}>
              {NAV.map((i) => (
                <Link key={i.to} to={i.to} style={styles.mobileLink}>
                  {i.label}
                </Link>
              ))}
              <Link to="/mentions-legales" style={styles.mobileLink}>
                Mentions légales
              </Link>
            </div>
          </Accordion>

          <Accordion
            title="Nos services"
            open={open.services}
            onToggle={() => toggle("services")}
          >
            <div style={styles.mobileLinks}>
              {SERVICES.map((s) => (
                <div key={s} style={styles.mobileLinkMuted}>
                  {s}
                </div>
              ))}
            </div>
          </Accordion>

          <Accordion
            title="Réseaux"
            open={open.social}
            onToggle={() => toggle("social")}
          >
            <div style={styles.socialRow}>
              <a href="#" style={styles.social}>
                LinkedIn
              </a>
              <a href="#" style={styles.social}>
                Facebook
              </a>
              <a href="#" style={styles.social}>
                YouTube
              </a>
            </div>
          </Accordion>
        </div>
      </div>

      {/* Bottom */}
      <div style={styles.bottom}>
        <div style={styles.bottomInner}>
          <div style={styles.copy}>
            © {year} RONNA GROUP. Tous droits réservés.
          </div>

          <div style={styles.bottomLinks}>
            <Link to="/mentions-legales" style={styles.bottomLink}>
              Mentions légales
            </Link>
            <span style={styles.sep}>•</span>
            <a href="mailto:llkkkk@gmail.com" style={styles.bottomLink}>
              Support
            </a>
          </div>
        </div>
      </div>

      <style>{css}</style>
    </footer>
  );
}

function Accordion({ title, open, onToggle, children }) {
  return (
    <div style={styles.acc}>
      <button type="button" style={styles.accBtn} onClick={onToggle} aria-expanded={open}>
        <span style={styles.accTitle}>{title}</span>
        <span style={{ ...styles.chev, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▾
        </span>
      </button>
      {open && <div style={styles.accBody}>{children}</div>}
    </div>
  );
}

const styles = {
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(180deg, rgba(3,10,26,0.96) 0%, rgba(5,18,45,0.96) 100%)"
  },

  top: { padding: "34px 0 22px" },

  grid: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 18px",
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr 0.9fr 1fr",
    gap: 22,
    alignItems: "start"
  },

  col: { display: "grid", gap: 10 },

  brand: {
    fontWeight: 950,
    letterSpacing: 2,
    color: "rgba(255,255,255,0.95)",
    fontSize: 14
  },
  tag: { color: "rgba(255,255,255,0.68)", lineHeight: 1.6 },

  h: { color: "rgba(255,255,255,0.92)", fontWeight: 900, marginBottom: 4 },

  links: { display: "grid", gap: 8 },
  linksGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "6px 18px"
},

  link: {
    color: "rgba(255,255,255,0.78)",
    textDecoration: "none",
    padding: "4px 0"
  },
  linkMuted: { color: "rgba(255,255,255,0.62)", padding: "4px 0" },

  meta: { marginTop: 6, display: "grid", gap: 8 },
  metaRow: { display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" },
  metaLabel: { fontSize: 12, color: "rgba(255,255,255,0.55)", minWidth: 86 },
  metaValue: { color: "rgba(255,255,255,0.82)", textDecoration: "none" },

  p: { color: "rgba(255,255,255,0.68)", lineHeight: 1.65 },

  ctaRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 },
  ctaPrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 14px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 10px 26px rgba(31,79,216,.18)",
    color: "white",
    textDecoration: "none",
    whiteSpace: "nowrap"
  },
  ctaGhost: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.88)",
    textDecoration: "none",
    whiteSpace: "nowrap"
  },

  socialRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 },
  social: {
    fontSize: 13,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.80)",
    textDecoration: "none"
  },

  bottom: { borderTop: "1px solid rgba(255,255,255,0.08)" },
  bottomInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap"
  },
  copy: { color: "rgba(255,255,255,0.60)", fontSize: 12 },
  bottomLinks: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  bottomLink: { color: "rgba(255,255,255,0.72)", fontSize: 12, textDecoration: "none" },
  sep: { color: "rgba(255,255,255,0.35)" },

  /* Mobile accordéon */
  mobileWrap: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 18px",
    display: "none",
    gap: 12
  },
  mobileBrand: {
    padding: "12px 0 4px",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },
  acc: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 18,
    overflow: "hidden"
  },
  accBtn: {
    width: "100%",
    padding: "12px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "rgba(255,255,255,0.92)"
  },
  accTitle: { fontWeight: 900 },
  chev: { color: "rgba(255,255,255,0.70)", transition: "transform .16s ease" },
  accBody: { padding: "0 12px 12px" },

  mobileLinks: { display: "grid", gap: 6, paddingTop: 8 },
  mobileLink: {
    color: "rgba(255,255,255,0.84)",
    textDecoration: "none",
    padding: "10px 10px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)"
  },
  mobileLinkMuted: {
    color: "rgba(255,255,255,0.70)",
    padding: "10px 10px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)"
  },
  mapLink: {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  textDecoration: "none",
  color: "inherit",
},

mapThumb: {
  width: 220,
  height: 120,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  transition: "transform 0.2s ease, opacity 0.2s ease",
},
};

const css = `
a:hover { opacity: .92; }

.rgFooterMobile { display: none; }
.rgFooterDesktop { display: grid; }

@media (max-width: 980px) {
  .rgFooterDesktop { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 820px) {
  .rgFooterDesktop { display: none; }
  .rgFooterMobile { display: grid; }
}
`;
