import { Link } from "react-router-dom";
import { Wrench, Phone, Mail, MapPin } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="pied-page">
      <div className="conteneur pied-grille">
        <div className="pied-colonne pied-marque">
          <div className="navbar-logo" style={{ color: "var(--blanc)" }}>
            <span className="navbar-logo-icone">
              <Wrench size={18} strokeWidth={2.4} />
            </span>
            Fix<span style={{ color: "var(--orange)" }}>Afrik</span>
          </div>
          <p>Des artisans qualifiés et vérifiés, à portée de main, partout à Abidjan.</p>
        </div>

        <div className="pied-colonne">
          <h4>Plateforme</h4>
          <Link to="/recherche">Trouver un artisan</Link>
          <Link to="/inscription">Devenir artisan</Link>
          <Link to="/connexion">Connexion</Link>
        </div>

        <div className="pied-colonne">
          <h4>Métiers populaires</h4>
          <span>Plomberie</span>
          <span>Électricité</span>
          <span>Climatisation</span>
        </div>

        <div className="pied-colonne">
          <h4>Contact</h4>

          <span><Phone size={14} /><a href="tel:0758343332">+225 07 00 00 00 00</a></span>
          <span><Mail size={14} /> <a href="mailto:contact@fixafrik.com"> contact@fixafrik.com </a></span>
          <span><MapPin size={14} /> Abidjan, Côte d'Ivoire</span>
        </div>
      </div>
      <div className="conteneur pied-bas">
        <p>© {new Date().getFullYear()} FixAfrik. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
