import { Link } from "react-router-dom";

export default function PageIntrouvable() {
  return (
    <div className="conteneur" style={{ padding: "96px 24px", textAlign: "center" }}>
      <h1>Page introuvable</h1>
      <p>Cette page n'existe pas ou a été déplacée.</p>
      <Link to="/" className="bouton bouton-primaire">
        Retour à l'accueil
      </Link>
    </div>
  );
}
