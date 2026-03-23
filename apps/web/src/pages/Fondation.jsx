import { useEffect, useMemo, useState } from "react";
import mission09 from "../assets/fondation/mission09.png";
import SEO from "../components/SEO.jsx"; 
import { apiUrl } from "../lib/api.js";

function toDateLabel(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  } catch {
    return String(iso);
  }
}

function splitByDate(items) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const upcoming = [];
  const past = [];

  for (const it of items) {
    const dt = it?.eventDate ? new Date(it.eventDate) : null;
    const valid = dt && !Number.isNaN(dt.getTime());

    if (valid && dt >= todayStart) upcoming.push(it);
    else past.push(it);
  }

  // Upcoming : du plus proche au plus lointain
  upcoming.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
  // Past : du plus récent au plus ancien (ou par order si tu préfères)
  past.sort((a, b) => {
    const da = a?.eventDate ? new Date(a.eventDate).getTime() : 0;
    const db = b?.eventDate ? new Date(b.eventDate).getTime() : 0;
    return db - da;
  });

  return { upcoming, past };
}

export default function Fondation() {
  const [pageLoading, setPageLoading] = useState(true);

  const [items, setItems] = useState([]);
  const [loadingActions, setLoadingActions] = useState(true);
  const [errorActions, setErrorActions] = useState(null);

  // Slider (colonne gauche)
  const [index, setIndex] = useState(0);

  // Modal
  const [active, setActive] = useState(null); // { ...item, details? }
  const [activeLoading, setActiveLoading] = useState(false);
  const [activeError, setActiveError] = useState(null);

  // Loader volontaire
  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Fetch liste actions
  useEffect(() => {
    let cancelled = false;

    async function loadActions() {
      try {
        setLoadingActions(true);
        setErrorActions(null);

        const res = await fetch(apiUrl("/api/foundation/actions"));
        const json = await res.json().catch(() => ({}));

        if (!res.ok || json?.ok === false) {
          throw new Error(json?.message || "Erreur chargement actions");
        }

        const list = Array.isArray(json.items) ? json.items : [];
        if (!cancelled) setItems(list);

        if (!cancelled) setIndex(0);
      } catch (e) {
        if (!cancelled) setErrorActions(e?.message || "Erreur réseau");
      } finally {
        if (!cancelled) setLoadingActions(false);
      }
    }

    loadActions();
    return () => {
      cancelled = true;
    };
  }, []);

  // Split auto upcoming/past
  const { upcoming, past } = useMemo(() => splitByDate(items), [items]);

  // Slider auto sur "past" (gauche)
  useEffect(() => {
    if (loadingActions || past.length <= 1) return;

    const t = setInterval(() => {
      setIndex((i) => (i + 1) % past.length);
    }, 4000);

    return () => clearInterval(t);
  }, [loadingActions, past.length]);

  const current = past[index] || null;

  const openDetails = async (a) => {
    if (!a?._id) return;

    setActiveError(null);
    setActiveLoading(true);

    // Ouvre modal tout de suite (skeleton)
    setActive({ ...a, details: null });

    try {
      const res = await fetch(`/api/foundation/actions/${encodeURIComponent(a._id)}`);
      const json = await res.json().catch(() => ({}));

      if (!res.ok || json?.ok === false) {
        throw new Error(json?.message || "Impossible de charger le détail");
      }

      setActive(json.item);
    } catch (e) {
      setActiveError(e?.message || "Erreur réseau");
    } finally {
      setActiveLoading(false);
    }
  };

  const closeModal = () => {
    setActive(null);
    setActiveError(null);
    setActiveLoading(false);
  };

  if (pageLoading) {
    return (
      <main style={styles.loaderPage}>
        <div style={styles.loaderCard}>
          <HandsLoaderSVG />
          <div style={styles.loaderTitle}>Mission09 • Fondation</div>
          <div style={styles.loaderText}>Préparation de la page…</div>
          <div style={styles.loaderBar}>
            <span style={styles.loaderBarFill} />
          </div>
        </div>
        <style>{css}</style>
      </main>
    );
  }

  return (
    <>
    <SEO
  title="Fondation"
  description="La Fondation Ronna soutient des actions sociales, éducatives et communautaires."
  canonical="https://ronnagroup.com/fondation"
/>
    <main style={styles.page}>
      {/* HERO sticky */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay} />
        <p style={styles.quote}>
          <em>
            “Servir, impacter, relever — bâtir une chaîne de solidarité et d’opportunités.”
          </em>
        </p>
      </div>

      {/* DON FORM horizontal (après hero) */}
      <section style={styles.donateStrip}>
        <div style={styles.donateStripInner} className="donateStrip">
          <div style={styles.donateStripLeft}>
            <div style={styles.donateTitle}>Faire un don</div>
            <div style={styles.donateHint}>
              Votre contribution soutient nos actions. 
            </div>
          </div>
          <style>{`
    @media (max-width: 900px) {
      .donateStripInner {
        grid-template-columns: 1fr !important;
      }
      .donateStripForm {
        grid-template-columns: 1fr !important;
      }
      .donateStripForm button {
        width: 100% !important;
      }
    }
  `}</style>

          <form onSubmit={(e) => e.preventDefault()} style={styles.donateStripForm} className="donateStripForm">
            <Field label="Nom" placeholder="Votre nom" />
            <Field label="Email" type="email" placeholder="vous@email.com" />
            <Field label="Téléphone" placeholder="+225 ..." />
            <SelectField
              label="Type"
              options={[
                { value: "ONE_TIME", label: "Don unique" },
                { value: "MONTHLY", label: "Mensuel" }
              ]}
            />
            <Field label="Montant (FCFA)" placeholder="Ex: 5000" />
            <button type="submit" style={styles.donateBtn}>
              Continuer
            </button>
          </form>
        </div>
      </section>

      {/* CONTENU 2 COLONNES */}
      <section style={styles.stage}>
        <div className="rgFoundationGrid" style={styles.stageGrid}>
          {/* GAUCHE : Actions (slider) */}
          <div style={styles.left}>
            {loadingActions && <div style={styles.stateCard}>Chargement des actions…</div>}

            {!loadingActions && errorActions && (
              <div style={{ ...styles.stateCard, ...styles.stateCardError }}>
                Erreur : {errorActions}
              </div>
            )}

            {!loadingActions && !errorActions && past.length === 0 && (
              <div style={styles.stateCard}>Aucune action publiée pour le moment.</div>
            )}

            {current && (
              <div style={styles.slideCard}>
                <div style={styles.slideMedia}>
                  {current.image ? (
                    <img src={current.image} alt={current.title} style={styles.slideImg} />
                  ) : (
                    <div style={styles.noImg}>Aucune image</div>
                  )}
                  <div style={styles.slideOverlay} />
                  <div style={styles.slideTextBlock}>
                    <div style={styles.slideTitle}>{current.title}</div>
                    <div style={styles.slideMeta}>
                      <span style={styles.metaPill}>Action</span>
                      <span style={styles.metaText}>{toDateLabel(current.eventDate || current.createdAt)}</span>
                    </div>
                    <div style={styles.slideShort}>{current.short}</div>

                    <button type="button" style={styles.slideBtn} onClick={() => openDetails(current)}>
                      En savoir plus →
                    </button>
                  </div>
                </div>

                <div style={styles.dots}>
                  {past.map((a, i) => (
                    <button
                      key={a._id || i}
                      type="button"
                      aria-label={`Aller à ${a.title}`}
                      onClick={() => setIndex(i)}
                      style={{
                        ...styles.dot,
                        ...(i === index ? styles.dotActive : null)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DROITE : À venir */}
          <aside style={styles.right}>
            <div style={styles.upTitle}>Événements à venir</div>

            {loadingActions && <div style={styles.upEmpty}>Chargement…</div>}

            {!loadingActions && !errorActions && upcoming.length === 0 && (
              <div style={styles.upEmpty}>Aucun événement à venir pour le moment.</div>
            )}

            {!loadingActions && upcoming.length > 0 && (
              <div style={styles.upList}>
                {upcoming.map((ev) => (
                  <button
                    key={ev._id}
                    type="button"
                    onClick={() => openDetails(ev)}
                    style={styles.upCard}
                  >
                    <div style={styles.upImgWrap}>
                      {ev.image ? (
                        <img src={ev.image} alt={ev.title} style={styles.upImg} />
                      ) : (
                        <div style={styles.upNoImg}>—</div>
                      )}
                    </div>

                    <div style={styles.upBody}>
                      <div style={styles.upDate}>{toDateLabel(ev.eventDate)}</div>
                      <div style={styles.upName}>{ev.title}</div>
                      <div style={styles.upShort}>{ev.short}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* MODAL */}
      {active && (
        <div style={styles.modalBack} role="dialog" aria-modal="true" onClick={closeModal}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalMedia}>
              {active.image ? (
                <img src={active.image} alt={active.title} style={styles.modalImg} />
              ) : (
                <div style={styles.modalNoImg}>Aucune image</div>
              )}
            </div>

            <div style={styles.modalBody}>
              <div style={styles.modalTitle}>{active.title}</div>
              <div style={styles.modalMeta}>
                <span style={styles.metaPill}>Fondation</span>
                <span style={styles.metaText}>{toDateLabel(active.eventDate || active.createdAt)}</span>
              </div>

              {activeError && (
                <div style={{ ...styles.modalText, color: "rgba(239,68,68,0.95)" }}>
                  {activeError}
                </div>
              )}

              {activeLoading && !active?.details && (
                <div style={styles.modalText}>Chargement…</div>
              )}

              {!activeLoading && !activeError && (
                <div style={styles.modalText}>
                  {active.details || "Détails à venir…"}
                </div>
              )}

              <button type="button" style={styles.modalClose} onClick={closeModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{css}</style>
    </main>
    </>
  );
}

function Field({ label, type = "text", placeholder }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      <input type={type} placeholder={placeholder} style={styles.input} />
    </div>
  );
}
function SelectField({ label, options }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      <select style={styles.input}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function HandsLoaderSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Solidarité">
      <g className="hand-left">
        <path
          d="M40 110 C30 95,30 80,45 70 L75 50 C85 45,95 55,88 65 L70 85 C65 90,60 95,55 100 Z"
          fill="#3B82F6"
          opacity="0.9"
        />
      </g>
      <g className="hand-right">
        <path
          d="M160 110 C170 95,170 80,155 70 L125 50 C115 45,105 55,112 65 L130 85 C135 90,140 95,145 100 Z"
          fill="#60A5FA"
          opacity="0.9"
        />
      </g>
      <path
        d="M100 115 C95 108,85 105,80 112 C75 120,85 132,100 142 C115 132,125 120,120 112 C115 105,105 108,100 115 Z"
        fill="#93C5FD"
        opacity="0.85"
      />
    </svg>
  );
}

const styles = {
  page: {
    paddingTop: 86,
    background:
      "linear-gradient(180deg, rgba(3,10,26,0.98) 0%, rgba(5,18,45,0.98) 55%, rgba(3,10,26,0.98) 100%)",
    minHeight: "100vh"
  },

  hero: {
    position: "sticky",
    top: 86,
    zIndex: 5,
    minHeight: 220,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 18px",
    textAlign: "center",
    backgroundImage: `url(${mission09})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(3,10,26,0.65) 0%, rgba(3,10,26,0.85) 100%)",
    zIndex: 0
  },
  quote: {
    position: "relative",
    zIndex: 1,
    maxWidth: 820,
    margin: 0,
    color: "rgba(255,255,255,0.95)",
    fontSize: 20,
    lineHeight: 1.9,
    fontStyle: "italic",
    fontWeight: 500,
    textShadow: "0 8px 30px rgba(0,0,0,0.45)"
  },

  donateStrip: {
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)"
  },
  donateStripInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "14px 18px",
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: 14,
    alignItems: "center"
  },
  donateStripLeft: { minWidth: 0 },
  donateTitle: { fontWeight: 950, color: "rgba(255,255,255,0.95)", fontSize: 18 },
  donateHint: { marginTop: 6, color: "rgba(255,255,255,0.70)", lineHeight: 1.5, fontSize: 13.5 },

  donateStripForm: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr)) auto",
    gap: 10,
    alignItems: "end",
    minWidth:0,
  },
  donateBtn: {
    height: 44,
    padding: "0 16px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "white",
    cursor: "pointer",
    whiteSpace: "nowrap",
    minWidth:0,
  },

  stage: { maxWidth: 1200, margin: "0 auto", padding: "16px 18px 80px" },
  stageGrid: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, alignItems: "stretch" },

  left: {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 16
  },

  slideCard: { display: "grid", gap: 12, height: "100%" },
  slideMedia: {
    position: "relative",
    borderRadius: 22,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
    minHeight: 420
  },
  slideImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  noImg: { height: 420, display: "grid", placeItems: "center", color: "rgba(255,255,255,0.65)" },
  slideOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(3,10,26,0.70) 70%, rgba(3,10,26,0.92) 100%)"
  },
  slideTextBlock: { position: "absolute", left: 16, right: 16, bottom: 16 },
  slideTitle: { color: "rgba(255,255,255,0.95)", fontSize: 22, fontWeight: 950 },
  slideMeta: { marginTop: 8, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  metaPill: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(3,10,26,0.70)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.88)",
    fontSize: 12
  },
  metaText: { color: "rgba(255,255,255,0.70)", fontSize: 12 },
  slideShort: { marginTop: 10, color: "rgba(255,255,255,0.78)", lineHeight: 1.7 },
  slideBtn: {
    marginTop: 12,
    padding: "12px 14px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "white",
    cursor: "pointer"
  },
  dots: { display: "flex", gap: 8, justifyContent: "center" },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "transparent",
    cursor: "pointer"
  },
  dotActive: { background: "rgba(255,255,255,0.85)" },

  stateCard: {
    borderRadius: 18,
    border: "1px dashed rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
    color: "rgba(255,255,255,0.78)",
    textAlign: "center"
  },
  stateCardError: { border: "1px dashed rgba(239,68,68,0.45)", color: "rgba(239,68,68,0.92)" },

  right: {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 16
  },
  upTitle: { fontWeight: 950, color: "rgba(255,255,255,0.95)", fontSize: 16, marginBottom: 10 },
  upEmpty: {
    borderRadius: 16,
    border: "1px dashed rgba(255,255,255,0.14)",
    padding: 14,
    color: "rgba(255,255,255,0.70)"
  },
  upList: { display: "grid", gap: 10 },
  upCard: {
    display: "grid",
    gridTemplateColumns: "92px 1fr",
    gap: 10,
    padding: 10,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.02)",
    textAlign: "left",
    cursor: "pointer"
  },
  upImgWrap: { borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.10)" },
  upImg: { width: "100%", height: 80, objectFit: "cover", display: "block" },
  upNoImg: { height: 80, display: "grid", placeItems: "center", color: "rgba(255,255,255,0.60)" },
  upBody: { minWidth: 0 },
  upDate: { fontSize: 12, color: "rgba(255,255,255,0.68)" },
  upName: { marginTop: 4, fontWeight: 900, color: "rgba(255,255,255,0.92)" },
  upShort: { marginTop: 6, color: "rgba(255,255,255,0.72)", lineHeight: 1.55, fontSize: 13 },

  field: { display: "grid", gap: 6 },
  label: { fontSize: 12, color: "rgba(255,255,255,0.78)" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,10,26,0.35)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
    height: 44
  },

  modalBack: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.62)",
    display: "grid",
    placeItems: "center",
    zIndex: 50,
    padding: 18
  },
  modalCard: {
    width: "min(980px, 100%)",
    borderRadius: 24,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,10,26,0.95)"
  },
  modalMedia: { borderBottom: "1px solid rgba(255,255,255,0.10)" },
  modalImg: { width: "100%", height: 360, objectFit: "cover", display: "block" },
  modalNoImg: { height: 260, display: "grid", placeItems: "center", color: "rgba(255,255,255,0.65)" },
  modalBody: { padding: 16 },
  modalTitle: { fontSize: 22, fontWeight: 950, color: "rgba(255,255,255,0.95)" },
  modalMeta: { marginTop: 8, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  modalText: { marginTop: 12, color: "rgba(255,255,255,0.80)", lineHeight: 1.8 },
  modalClose: {
    marginTop: 14,
    padding: "12px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer"
  },

  loaderPage: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 18,
    background:
      "linear-gradient(180deg, rgba(3,10,26,0.98) 0%, rgba(5,18,45,0.98) 55%, rgba(3,10,26,0.98) 100%)"
  },
  loaderCard: {
    width: "min(520px, 100%)",
    borderRadius: 26,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 18,
    textAlign: "center"
  },
  loaderTitle: { fontWeight: 950, color: "rgba(255,255,255,0.92)" },
  loaderText: { marginTop: 6, color: "rgba(255,255,255,0.70)" },
  loaderBar: {
    marginTop: 14,
    height: 8,
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden"
  },
  loaderBarFill: {
    display: "block",
    height: "100%",
    width: "45%",
    borderRadius: 999,
    background: "rgba(31,79,216,.85)",
    animation: "rgLoad 1.1s ease-in-out infinite alternate"
  }
};

const css = `
@keyframes rgLoad {
  from { transform: translateX(-10%); width: 35%; opacity: .75; }
  to   { transform: translateX(60%); width: 60%; opacity: 1; }
}

.hand-left { animation: leftHand 1.4s ease-in-out infinite alternate; transform-origin: 50% 50%; }
.hand-right { animation: rightHand 1.4s ease-in-out infinite alternate; transform-origin: 50% 50%; }

@keyframes leftHand { from { transform: translateX(-6px); opacity: .7; } to { transform: translateX(0px); opacity: 1; } }
@keyframes rightHand { from { transform: translateX(6px); opacity: .7; } to { transform: translateX(0px); opacity: 1; } }

@media (max-width: 980px) {
  .rgFoundationGrid { grid-template-columns: 1fr !important; }
}

@media (max-width: 980px) {
  /* donate strip responsive */
  .rgFoundationDonateGrid { grid-template-columns: 1fr !important; }
}
`;