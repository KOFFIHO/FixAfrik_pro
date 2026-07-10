// Barre de navigation principale.
// Sur mobile, les liens sont masqués derrière un bouton "menu hamburger"
// (icône trois traits) qui ouvre un panneau déroulant, comme sur
// lesartisanspros.fr. Sur desktop, les liens restent affichés en ligne.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wrench, Search, ClipboardList, LayoutDashboard, LogOut, UserCircle, Menu, X, FileText, Phone,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();
  // Contrôle l'ouverture/fermeture du menu mobile (fermé par défaut).
  const [menuOuvert, setMenuOuvert] = useState(false);

  const seDeconnecter = () => {
    setMenuOuvert(false);
    deconnexion();
    navigate("/");
  };

  // Ferme le menu mobile après un clic sur un lien, pour éviter qu'il
  // reste ouvert par-dessus la nouvelle page.
  const fermerMenu = () => setMenuOuvert(false);

  return (
    <header className="navbar">
      <div className="conteneur navbar-interieur">
        <Link to="/" className="navbar-logo" onClick={fermerMenu}>
          <span className="navbar-logo-icone">
            <Wrench size={18} strokeWidth={2.4} />
          </span>
          Fix<span>Afrik</span>
        </Link>

        {/* Bouton hamburger, visible uniquement sur mobile (voir Navbar.css) */}
        <button
          type="button"
          className="navbar-hamburger"
          aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOuvert}
          onClick={() => setMenuOuvert((ouvert) => !ouvert)}
        >
          {menuOuvert ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`navbar-liens ${menuOuvert ? "navbar-liens-ouvert" : ""}`}>
          {!utilisateur && (
            <>
              <Link to="/recherche" onClick={fermerMenu}>Trouver un artisan</Link>
              <Link to="/connexion" onClick={fermerMenu}>Connexion</Link>
              <Link to="/inscription" className="bouton bouton-primaire navbar-cta" onClick={fermerMenu}>
                S'inscrire
              </Link>
              <a href="tel:+2250700000000" className="navbar-telephone">
                <Phone size={15} /> +225 07 00 00 00 00
              </a>
            </>
          )}

          {utilisateur?.role === "client" && (
            <>
              <Link to="/recherche" onClick={fermerMenu}><Search size={16} /> Trouver un artisan</Link>
              <Link to="/nouvelle-demande?devis=1" onClick={fermerMenu}><FileText size={16} /> Demander un devis</Link>
              <Link to="/mes-demandes" onClick={fermerMenu}><ClipboardList size={16} /> Mes demandes</Link>
              <Link to="/profil" onClick={fermerMenu}><UserCircle size={16} /> {utilisateur.first_name || utilisateur.username}</Link>
              <button className="bouton bouton-discret" onClick={seDeconnecter}>
                <LogOut size={15} /> Déconnexion
              </button>
            </>
          )}

          {utilisateur?.role === "artisan" && (
            <>
              <Link to="/demandes-disponibles" onClick={fermerMenu}>Demandes disponibles</Link>
              <Link to="/mes-missions" onClick={fermerMenu}>Mes missions</Link>
              <Link to="/mon-profil-artisan" onClick={fermerMenu}><UserCircle size={16} /> Mon profil</Link>
              <button className="bouton bouton-discret" onClick={seDeconnecter}>
                <LogOut size={15} /> Déconnexion
              </button>
            </>
          )}

          {utilisateur?.role === "admin" && (
            <>
              <Link to="/admin" onClick={fermerMenu}><LayoutDashboard size={16} /> Tableau de bord</Link>
              <button className="bouton bouton-discret" onClick={seDeconnecter}>
                <LogOut size={15} /> Déconnexion
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
