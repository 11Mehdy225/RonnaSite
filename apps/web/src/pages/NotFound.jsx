import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <main className="rg-not-found">
      <Helmet>
        <title>Page introuvable | RONNA GROUP</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="rg-not-found-card">
        <span>Erreur 404</span>
        <h1>Cette page n’existe pas</h1>
        <p>Le lien a peut-être changé ou la page a été déplacée.</p>
        <Link to="/">Retour à l’accueil</Link>
      </div>
    </main>
  );
}
