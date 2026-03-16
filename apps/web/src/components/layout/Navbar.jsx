import logo from "../../assets/brands/logoRG.PNG";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Accueil", to: "/" },
  { label: "Le Groupe", to: "/groupe" },
  { label: "Services", to: "/services" },
  { label: "Actualités", to: "/actualites" },
  { label: "Realisations", to: "/realisations" },
  { label: "Contact", to: "/contact" },
  { label: "Fondation", to: "/fondation" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme le menu à chaque changement de page
 useEffect(() => {
  if (!open) return;
  const t = setTimeout(() => setOpen(false), 5000);
  return () => clearTimeout(t);
}, [location.pathname, open]);



  // Ferme le menu si on repasse en écran large
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      style={{
        ...styles.header,
        background: scrolled ? "rgba(3,10,26,0.78)" : "rgba(3,10,26,0.08)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(255,255,255,0.00)",
        backdropFilter: scrolled ? "blur(14px)" : "blur(0px)"
      }}
    >
      <div style={styles.inner}>
        <Link to="/" style={styles.brand} aria-label="Ronna Group - Accueil">
          <img src={logo} alt="Ronna Group" style={styles.logoImg} />
          <div style={styles.brandText}>
            <div style={styles.name}>RONNA GROUP</div>
            <div style={styles.tag}>Innovation • Technologie • Impact</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={styles.navDesktop} aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              style={{
                ...styles.link,
                ...(location.pathname === item.to ? styles.linkActive : null)
              }}
            >
              {item.label}
            </Link>
          ))}

          <Link to="/contact" style={styles.cta}>
            Demander un devis
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={styles.burger}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          <span
            style={{
              ...styles.burgerLine,
              transform: open ? "translateY(7px) rotate(45deg)" : "none"
            }}
          />
          <span style={{ ...styles.burgerLine, opacity: open ? 0 : 1 }} />
          <span
            style={{
              ...styles.burgerLine,
              transform: open ? "translateY(-7px) rotate(-45deg)" : "none"
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={styles.mobileWrap}>
          <div style={styles.mobileMenu}>
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                style={{
                  ...styles.mobileLink,
                  ...(location.pathname === item.to ? styles.mobileLinkActive : null)
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/contact" style={styles.mobileCta}>
              Demander un devis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: "background .18s ease, border-color .18s ease, backdrop-filter .18s ease"
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "12px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    minWidth: 0
  },
  logoImg: { width: 34, height: 34, objectFit: "contain" },
  brandText: { lineHeight: 1.1, minWidth: 0 },
  name: {
    fontWeight: 800,
    letterSpacing: 2.2,
    fontSize: 12,
    color: "rgba(255,255,255,.95)"
  },
  tag: {
    fontSize: 12,
    color: "rgba(255,255,255,.72)",
    marginTop: 2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 220
  },

  // ✅ Desktop visible à partir de 900px via CSS (voir plus bas)
  navDesktop: { display: "flex", alignItems: "center", gap: 8 },
  link: {
    fontSize: 14,
    color: "rgba(255,255,255,.86)",
    padding: "10px 10px",
    borderRadius: 10,
    textDecoration: "none"
  },
  linkActive: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)"
  },
  cta: {
    fontSize: 14,
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 10px 26px rgba(31,79,216,.22)",
    whiteSpace: "nowrap",
    textDecoration: "none",
    color: "white"
  },

  burger: {
    width: 44,
    height: 44,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer"
  },
  burgerLine: {
    width: 18,
    height: 2,
    background: "rgba(255,255,255,.86)",
    display: "block",
    borderRadius: 999,
    transition: "transform .18s ease, opacity .18s ease"
  },

  mobileWrap: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(3,10,26,0.90)",
    backdropFilter: "blur(14px)"
  },
  mobileMenu: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "10px 18px 16px",
    display: "grid",
    gap: 8
  },
  mobileLink: {
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,.88)",
    textDecoration: "none"
  },
  mobileLinkActive: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)"
  },
  mobileCta: {
    marginTop: 4,
    padding: "12px 12px",
    borderRadius: 14,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "white",
    textAlign: "center",
    textDecoration: "none"
  }
};







// export default function Navbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 18);
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // Ferme le menu si on repasse en écran large
//   useEffect(() => {
//     const onResize = () => {
//       if (window.innerWidth >= 900) setOpen(false);
//     };
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   return (
//     <header
//       style={{
//         ...styles.header,
//         background: scrolled ? "rgba(3,10,26,0.78)" : "rgba(3,10,26,0.08)",
//         borderBottom: scrolled
//           ? "1px solid rgba(255,255,255,0.08)"
//           : "1px solid rgba(255,255,255,0.00)",
//         backdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
//       }}
//     >
//       <div style={styles.inner}>
//         <a href="/" style={styles.brand} aria-label="Ronna Group - Accueil">
//           <img src={logo} alt="Ronna Group" style={styles.logoImg} />
//           <div style={styles.brandText}>
//             <div style={styles.name}>RONNA GROUP</div>
//             <div style={styles.tag}>Innovation • Technologie • Impact</div>
//           </div>
//         </a>

//         {/* Desktop nav */}
//         <nav style={styles.navDesktop} aria-label="Navigation principale">
//           {NAV.map((item) => (
//             <a key={item.label} href={item.href} style={styles.link}>
//               {item.label}
//             </a>
//           ))}
//           <a href="#contact" style={styles.cta}>
//             Demander un devis
//           </a>
//         </nav>

//         {/* Mobile burger */}
//         <button
//           type="button"
//           onClick={() => setOpen((v) => !v)}
//           style={styles.burger}
//           aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
//           aria-expanded={open}
//         >
//           <span
//             style={{
//               ...styles.burgerLine,
//               transform: open ? "translateY(7px) rotate(45deg)" : "none",
//             }}
//           />
//           <span style={{ ...styles.burgerLine, opacity: open ? 0 : 1 }} />
//           <span
//             style={{
//               ...styles.burgerLine,
//               transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
//             }}
//           />
//         </button>
//       </div>

//       {/* Mobile dropdown */}
//       {open && (
//         <div style={styles.mobileWrap}>
//           <div style={styles.mobileMenu}>
//             {NAV.map((item) => (
//               <a
//                 key={item.label}
//                 href={item.href}
//                 style={styles.mobileLink}
//                 onClick={() => setOpen(false)}
//               >
//                 {item.label}
//               </a>
//             ))}
//             <a
//               href="#contact"
//               style={styles.mobileCta}
//               onClick={() => setOpen(false)}
//             >
//               Demander un devis
//             </a>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

// const styles = {
//   header: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 50,
//     transition:
//       "background .18s ease, border-color .18s ease, backdrop-filter .18s ease",
//   },
//   inner: {
//     maxWidth: 1200,
//     margin: "0 auto",
//     padding: "12px 18px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 12,
//   },
//   brand: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     textDecoration: "none",
//     minWidth: 0,
//   },
//   logoImg: { width: 34, height: 34, objectFit: "contain" },
//   brandText: { lineHeight: 1.1, minWidth: 0 },
//   name: {
//     fontWeight: 800,
//     letterSpacing: 2.2,
//     fontSize: 12,
//     color: "rgba(255,255,255,.95)",
//   },
//   tag: {
//     fontSize: 12,
//     color: "rgba(255,255,255,.72)",
//     marginTop: 2,
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     maxWidth: 220,
//   },

//   navDesktop: { display: "none", alignItems: "center", gap: 10 },
//   link: {
//     fontSize: 14,
//     color: "rgba(255,255,255,.86)",
//     padding: "10px 10px",
//     borderRadius: 10,
//   },
//   cta: {
//     fontSize: 14,
//     padding: "10px 14px",
//     borderRadius: 999,
//     background: "rgba(31,79,216,.95)",
//     border: "1px solid rgba(255,255,255,0.10)",
//     boxShadow: "0 10px 26px rgba(31,79,216,.22)",
//     whiteSpace: "nowrap",
//   },

//   burger: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "rgba(255,255,255,0.04)",
//     display: "grid",
//     placeItems: "center",
//     cursor: "pointer",
//   },
//   burgerLine: {
//     width: 18,
//     height: 2,
//     background: "rgba(255,255,255,.86)",
//     display: "block",
//     borderRadius: 999,
//     transition: "transform .18s ease, opacity .18s ease",
//   },

//   mobileWrap: {
//     borderTop: "1px solid rgba(255,255,255,0.08)",
//     background: "rgba(3,10,26,0.90)",
//     backdropFilter: "blur(14px)",
//   },
//   mobileMenu: {
//     maxWidth: 1200,
//     margin: "0 auto",
//     padding: "10px 18px 16px",
//     display: "grid",
//     gap: 8,
//   },
//   mobileLink: {
//     padding: "12px 12px",
//     borderRadius: 14,
//     border: "1px solid rgba(255,255,255,0.08)",
//     background: "rgba(255,255,255,0.03)",
//     color: "rgba(255,255,255,.88)",
//   },
//   mobileCta: {
//     marginTop: 4,
//     padding: "12px 12px",
//     borderRadius: 14,
//     background: "rgba(31,79,216,.95)",
//     border: "1px solid rgba(255,255,255,0.10)",
//     color: "white",
//     textAlign: "center",
//   },
// };
