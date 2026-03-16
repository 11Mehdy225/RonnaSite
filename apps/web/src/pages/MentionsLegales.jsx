import { useEffect } from "react";

export default function MentionsLegales() {

  useEffect(() => {
    document.title = "RonnaGroup | MentionsLegales";
  }, []);
  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={styles.h1}>Mentions légales</h1>
        <p style={styles.lead}>
          Les présentes mentions légales s’appliquent au site internet de <strong>RONNA GROUP</strong>.
        </p>

        {/* Bloc infos principales en grille */}
        <section style={styles.grid}>
          <section style={styles.card}>
            <h2 style={styles.h2}>Éditeur du site</h2>
            <p style={styles.p}>
              <strong>RONNA GROUP SARL</strong>
              <br />
              Société à Responsabilité Limitée (SARL)
              <br />
              Siège social : Abidjan, Côte d’Ivoire
            </p>
          </section>

          <section style={styles.card}>
            <h2 style={styles.h2}>Informations légales</h2>
            <p style={styles.p}>
              <strong>RCCM :</strong> CI-ABJ-2025-B-XXXXX <br />
              <strong>NCC :</strong> XXXXXXXXXXXXX <br />
              <strong>Capital social :</strong> à compléter
            </p>
            
          </section>

          <section style={styles.card}>
            <h2 style={styles.h2}>Contact</h2>
            <p style={styles.p}>
              <strong>Téléphone :</strong> +225 01 5170 4444 <br />
              <strong>Email :</strong> contact@ronnagroup.com
            </p>
          </section>
        </section>

        {/* Hébergement */}
        <section style={styles.card}>
          <h2 style={styles.h2}>Hébergement</h2>
          <p style={styles.p}>
            <strong>Hébergeur :</strong> à compléter <br />
            <strong>Adresse :</strong> à compléter
          </p>
         
        </section>

        {/* Propriété intellectuelle */}
        <section style={styles.card}>
          <h2 style={styles.h2}>Propriété intellectuelle</h2>
          <p style={styles.p}>
            L’ensemble du contenu du site (textes, images, logos, vidéos, éléments graphiques) est
            protégé par le droit applicable. Toute reproduction, représentation, modification ou
            exploitation, totale ou partielle, sans autorisation préalable est interdite.
          </p>
        </section>

        {/* Responsabilité */}
        <section style={styles.card}>
          <h2 style={styles.h2}>Responsabilité</h2>
          <p style={styles.p}>
            RONNA GROUP s’efforce de fournir des informations aussi précises que possible.
            Toutefois, RONNA GROUP ne saurait être tenue responsable des omissions, des inexactitudes
            ou des carences dans la mise à jour des informations, qu’elles soient de son fait ou du
            fait de tiers partenaires.
          </p>
        </section>

        {/* Cookies */}
        <section style={styles.card}>
          <h2 style={styles.h2}>Cookies et traceurs</h2>
          <p style={styles.p}>
            Le site peut utiliser des cookies strictement nécessaires au bon fonctionnement et à la
            sécurité, notamment pour la gestion de l’authentification et de la session d’administration.
          </p>
          <ul style={styles.ul}>
            <li style={styles.li}>Ces cookies ne sont pas utilisés à des fins publicitaires.</li>
            <li style={styles.li}>
              À ce jour, aucun outil de mesure d’audience ou de suivi publicitaire n’est activé.
            </li>
            <li style={styles.li}>
              Vous pouvez configurer votre navigateur pour bloquer les cookies, mais certaines
              fonctionnalités pourraient ne plus fonctionner correctement.
            </li>
          </ul>
        </section>

        {/* Données personnelles */}
        <section style={styles.card}>
          <h2 style={styles.h2}>Données personnelles</h2>
          <p style={styles.p}>
            Pour toute question relative à la protection des données personnelles ou à l’exercice de
            vos droits, vous pouvez nous contacter à l’adresse : <strong>contact@ronnagroup.com</strong>.
          </p>
        </section>
      </div>
    </main>
  );
}

const styles = {
  main: {
    padding: "80px 0 60px",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "0 18px",
  },
  h1: {
    marginBottom: 10,
    fontSize: 32,
    letterSpacing: -0.5,
  },
  lead: {
    marginBottom: 26,
    color: "rgba(255,255,255,0.78)",
    lineHeight: 1.7,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 18,
    marginBottom: 18,
  },
  card: {
    borderRadius: 18,
    padding: "18px 18px 20px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    marginBottom: 18,
  },
  h2: {
    marginBottom: 8,
    fontSize: 20,
  },
  p: {
    color: "rgba(255,255,255,0.78)",
    lineHeight: 1.7,
    margin: 0,
  },
  muted: {
    marginTop: 10,
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    lineHeight: 1.6,
  },
  ul: {
    marginTop: 10,
    marginBottom: 0,
    paddingLeft: 18,
    color: "rgba(255,255,255,0.78)",
    lineHeight: 1.7,
  },
  li: {
    marginBottom: 6,
  },
};