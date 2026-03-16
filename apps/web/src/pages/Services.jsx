import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import s1 from "../assets/brands/services/digital.PNG";
import s2 from "../assets/brands/services/web.PNG";
import s3 from "../assets/brands/services/tv.PNG";
import s4 from "../assets/brands/services/dev.PNG";
import s5 from "../assets/brands/services/audit.PNG";
import s6 from "../assets/brands/services/sec.PNG";
import s7 from "../assets/brands/services/digital.PNG";
import s8 from "../assets/brands/services/cons.PNG";
import SEO from "../components/SEO"; 

function ServiceCard({ item, index, onActive, isActive }) {
  const ref = useRef(null);
  const reverse = index % 2 === 1;
  const navigate = useNavigate();

useEffect(() => {
  document.title = "RonnaGroup | Services";
}, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) onActive(index);
        }
      },
      { root: null, threshold: 0.55 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [index, onActive]);

  return (
    
   <article
  ref={ref}
  className={`rg-serviceCard ${isActive ? "is-active" : ""} ${reverse ? "is-reverse" : ""}`}
  style={styles.card}
>

      <div style={styles.media}>
        <img src={item.image} alt={item.title} style={styles.image} />
      </div>

      <div style={styles.content}>
        <div style={styles.kicker}>{item.category}</div>
        <h2 style={styles.title}>{item.title}</h2>
        <p style={styles.desc}>{item.description}</p>

        {item.bullets?.length ? (
          <ul style={styles.bullets}>
            {item.bullets.map((b) => (
              <li key={b} style={styles.bulletItem}>
                {b}
              </li>
            ))}
          </ul>
        ) : null}

        {item.cta ? (
          <div style={styles.ctaRow}>
  <button
    type="button"
    style={styles.ctaBtn}
    onClick={() => navigate(`/contact?service=${encodeURIComponent(item.code)}`)}
  >
    Lancer une demande
  </button>
</div>

        ) : null}
      </div>
    </article>
  );
}

export default function Services() {
  const items = useMemo(
    () => [
      {
        code: "RONNA_DIGITAL",
        category: "Digital",
        title: "Ronna Digital",
        image: s1,
        description:
          "Stratégie digitale, présence en ligne, et accompagnement des organisations dans leur transformation numérique.",
        bullets: ["Branding & contenu", "Stratégie de communication", "Accompagnement et pilotage"],
        cta: "Discutons de votre présence digitale",
      },
      {
        code: "RONNA_WEB",
        category: "Web",
        title: "Ronna Web",
        image: s2,
        description:
          "Sites vitrines corporate, plateformes web, interfaces modernes et performantes, pensées pour la conversion et la confiance.",
        bullets: ["Sites institutionnels", "Portails & plateformes", "SEO technique & performance"],
        cta: "Construire un site professionnel",
      },
      {
        code: "RONNA_TV",
        category: "Média",
        title: "Ronna TV",
        image: s3,
        description:
          "Production et diffusion de contenus, formats vidéo, capsules et dispositifs médias au service de la visibilité,podcast.",
        bullets: ["Capsules & formats", "Habillage & identité","location de notre salon podcast", "Diffusion multi-plateformes"],
        cta: "Créer une stratégie média",
      },
      {
        code: "RONNA_DEV",
        category: "Développement",
        title: "Ronna Développement",
        image: s4,
        description:
          "Applications web & mobiles, APIs, solutions sur mesure, avec une approche orientée fiabilité, évolutivité et sécurité.",
        bullets: ["Web & Mobile", "API & intégrations", "Architecture & qualité"],
        cta: "Lancer votre produit",
      },
      {
        code: "RONNA_AUDIT",
        category: "Audit",
        title: "Ronna Audit",
        image: s5,
        description:
          "Analyse de l’existant, diagnostic, recommandations, et plan d’amélioration pour une meilleure maîtrise des risques.",
        bullets: ["Diagnostic & analyse", "Recommandations", "Plan d’actions"],
        cta: "Évaluer l’existant",
      },
      {
        code: "RONNA_SECURITY",
        category: "Sécurité",
        title: "Ronna Sécurité",
        image: s6,
        description:
          "Bonnes pratiques, hygiène numérique, accompagnement et mesures de protection adaptées au contexte de l’organisation.",
        bullets: ["Bonnes pratiques", "Durcissement & prévention", "Sensibilisation","Sécurité informatique"],
        cta: "Renforcer la sécurité",
      },
      {
        code: "RONNA_TRAINING",
        category: "Formation",
        title: "Ronna Formation",
        image: s7,
        description:
          "Montée en compétence des équipes, formations structurées, accompagnement et coaching sur les outils et méthodes,Developpement equipe.",
        bullets: ["Formations ciblées", "Coaching", "Approche pragmatique"],
        cta: "Former et structurer",
      },
      {
        code: "RONNA_CONSULTING",
        category: "Conseil & Management",
        title: "Ronna Conseil & Management",
        image: s8,
        description:
          "Cadrage, pilotage, organisation, méthodes agiles, et accompagnement à la performance opérationnelle.",
        bullets: ["Cadrage & roadmap", "Méthodes agiles", "Pilotage & gouvernance"],
        cta: "Structurer votre projet",
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <SEO
  title="Services"
  description="Nos services , projets ."
  canonical="https://ronnagroup.com/services"
/>
    <main style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroKicker}>Nos Services</div>
          <h1 style={styles.heroTitle}>Des pôles spécialisés, une vision unifiée</h1>
          <p style={styles.heroText}>
            Ronna Group rassemble des expertises complémentaires pour accompagner les organisations, de la stratégie à
            l’exécution, avec un standard de qualité et une exigence de résultat.
          </p>
        </div>
      </header>

      <section style={styles.section}>
        <div style={styles.list}>
          {items.map((item, idx) => (
            <ServiceCard
              key={item.title}
              item={item}
              index={idx}
              onActive={setActiveIndex}
              isActive={idx === activeIndex}
            />
          ))}
        </div>
      </section>

      {/* CSS local (pas besoin de tailwind) */}
      <style>{css}</style>
    </main>
    </>
  );
}

const styles = {
  page: {
    paddingTop: 110,
    paddingBottom: 80,
    background: "linear-gradient(180deg, rgba(3,10,26,0.98) 0%, rgba(5,18,45,0.98) 55%, rgba(3,10,26,0.98) 100%)",
    minHeight: "100vh",
  },

  hero: {
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  heroInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "36px 18px 28px",
  },
  heroKicker: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.72)",
    fontWeight: 800,
    marginBottom: 10,
  },
  heroTitle: {
    margin: 0,
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: -0.6,
    color: "rgba(255,255,255,0.95)",
    lineHeight: 1.1,
  },
  heroText: {
    margin: "12px 0 0",
    maxWidth: 820,
    color: "rgba(255,255,255,0.78)",
    fontSize: 16,
    lineHeight: 1.7,
  },

  section: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "26px 18px 0",
  },
  list: {
    display: "grid",
    gap: 18,
  },

  card: {
    display: "grid",
    gridTemplateColumns: "1.05fr 1fr",
    gap: 18,
    alignItems: "start",
    borderRadius: 26,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    overflow: "hidden",
  },
//   cardReverse: {
//     gridTemplateColumns: "1fr 1.05fr",
//   },

  media: { position: "relative" },
  image: {
    width: "100%",
    height: "100%",
    minHeight: 280,
    objectFit: "cover",
    display: "block",
  },

  content: {
    padding: 18,
    display: "flex",
    flexDirection: "column",
     justifyContent: "flex-start",
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.70)",
    fontWeight: 800,
    marginBottom: 8,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 900,
    letterSpacing: -0.3,
    color: "rgba(255,255,255,0.95)",
    lineHeight: 1.15,
  },
  desc: {
    margin: "10px 0 0",
    color: "rgba(255,255,255,0.80)",
    fontSize: 15.5,
    lineHeight: 1.7,
  },
  bullets: {
    margin: "12px 0 0",
    paddingLeft: 18,
    color: "rgba(255,255,255,0.78)",
    lineHeight: 1.6,
  },
  bulletItem: { marginBottom: 6 },

  ctaRow: { marginTop: 12 },
  ctaHint: {
    display: "inline-block",
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(31,79,216,.18)",
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    whiteSpace: "nowrap",
  },
  ctaBtn: {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(31,79,216,.95)",
  color: "white",
  cursor: "pointer",
  boxShadow: "0 12px 34px rgba(31,79,216,.20)",
  fontSize: 13,
  whiteSpace: "nowrap",
},

};

const css = `
/* Alternance gauche/droite: on inverse visuellement via flex order sur mobile */
.rg-serviceCard { 
  transform: scale(1);
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease, background .22s ease;
  will-change: transform;
  grid-auto-flow: row;
}
  /* Alternance EXACTE:
   - normal: photo (col 1) / texte (col 2)
   - reverse: texte (col 1) / photo (col 2)
*/
.rg-serviceCard.is-reverse > div:first-child {
  grid-column: 2;
  grid-row: 1;   /* force même ligne */
}

.rg-serviceCard.is-reverse > div:last-child {
  grid-column: 1;
  grid-row: 1;   /*force même ligne */
}


/* Effet “mise en avant” quand la card arrive au centre du viewport */
.rg-serviceCard.is-active {
  transform: scale(1.02);
  border-color: rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.05);
  box-shadow: 0 22px 60px rgba(0,0,0,0.28);
}
  /* Effet hover (desktop) */
@media (hover:hover) {
  .rg-serviceCard:hover {
    transform: scale(1.03);
    border-color: rgba(255,255,255,0.20);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 24px 70px rgba(0,0,0,0.32);
  }
}

/* Mobile: 1 colonne + alternance conservée en “ordre” */
@media (max-width: 900px) {
  .rg-serviceCard {
    grid-template-columns: 1fr !important;
  }
  .rg-serviceCard > div:first-child { order: 1; }
  .rg-serviceCard > div:last-child { order: 2; }

  /* Titre hero */
  h1 { font-size: 26px !important; }
}









//   /* Reveal (entrée au scroll) */
// .rg-serviceCard {
//   opacity: 0;
//   transform: translateY(18px);
//   transition:
//     opacity .45s ease,
//     transform .45s ease,
//     box-shadow .22s ease,
//     border-color .22s ease,
//     background .22s ease;
// }

// .rg-serviceCard[data-side="left"] {
//   transform: translateY(18px) translateX(-18px);
// }
// .rg-serviceCard[data-side="right"] {
//   transform: translateY(18px) translateX(18px);
// }

// /* Quand la card devient active (au centre), on la révèle */
// .rg-serviceCard.is-active {
//   opacity: 1;
//   transform: translateY(0) translateX(0) scale(1.02);
//   border-color: rgba(255,255,255,0.16);
//   background: rgba(255,255,255,0.05);
//   box-shadow: 0 22px 60px rgba(0,0,0,0.28);
// }

// /* Respecte les utilisateurs qui désactivent les animations */
// @media (prefers-reduced-motion: reduce) {
//   .rg-serviceCard {
//     opacity: 1;
//     transform: none;
//     transition: none;
//   }
// }

`;