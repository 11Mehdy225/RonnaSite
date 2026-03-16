import bgImg from "../../assets/home/contact-teaser.jpg";


export default function ContactTeaser() {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.banner} className="contact-cta-fix">
          <div style={styles.overlay} />

          <div style={styles.content}>
            <h2 style={styles.h2}>
              Vous avez une idée ? <br /> Un projet ?
            </h2>

            <p style={styles.p}>
              Écrivez-nous. Nous le construisons ensemble, de la réflexion à la réussite.
            </p>

            <div style={styles.actions}>
              <a href="/contact" style={styles.primary}>
                Nous écrire
              </a>
              <a href="/services" style={styles.secondary}>
                Nos services
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "64px 0"
  },

  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 18px"
  },

  banner: {
    position: "relative",
    height: 340,                 // ⬅️ hauteur contrôlée
    borderRadius: 28,
    overflow: "hidden",
    backgroundImage: `url(${bgImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    border: "1px solid rgba(255,255,255,0.10)"
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, rgba(3,10,26,0.85), rgba(3,10,26,0.55), rgba(3,10,26,0.25))"
  },

  content: {
    position: "relative",
    zIndex: 2,
    height: "100%",
    maxWidth: 620,
    padding: "0 28px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },

  h2: {
    margin: 0,
    fontSize: 32,
    lineHeight: 1.2,
    letterSpacing: -0.5
  },

  p: {
    marginTop: 12,
    fontSize: 16,
    color: "rgba(255,255,255,0.80)",
    lineHeight: 1.6
  },

  actions: {
    marginTop: 18,
    display: "flex",
    gap: 12,
    flexWrap: "wrap"
  },

  primary: {
    padding: "12px 18px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 10px 26px rgba(31,79,216,.25)"
  },

  secondary: {
    padding: "12px 18px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.18)"
  }
};
