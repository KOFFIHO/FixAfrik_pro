import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Star, Wrench, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Connexion() {
  const { connexion } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      const utilisateur = await connexion(form.username, form.password);
      if (utilisateur.role === "artisan") navigate("/demandes-disponibles");
      else if (utilisateur.role === "admin") navigate("/admin");
      else navigate("/recherche");
    } catch (err) {
      setErreur(
        err.response?.data?.detail ||
          "Identifiants incorrects. Vérifiez votre nom d'utilisateur et mot de passe."
      );
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panneau-marque">
        <h2>Des artisans vérifiés, à chaque connexion.</h2>
        <p>Retrouvez vos demandes, vos missions ou votre tableau de bord en un instant.</p>
        <div className="auth-panneau-points">
          <div className="auth-point"><ShieldCheck size={18} /> Comptes et artisans vérifiés</div>
          <div className="auth-point"><Star size={18} /> Avis authentiques de la communauté</div>
          <div className="auth-point"><Wrench size={18} /> Des dizaines de métiers disponibles</div>
        </div>
      </div>

      <div className="auth-formulaire-panneau">
        <div className="auth-carte">
          <h1>Content de vous revoir</h1>
          <p className="auth-sous-titre">Connectez-vous à votre compte FixAfrik.</p>

          {erreur && (
            <div className="message-erreur">
              <AlertCircle size={16} /> {erreur}
            </div>
          )}

          <form onSubmit={soumettre}>
            <div className="champ">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                id="username"
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="champ">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <small>
                <Link to="/mot-de-passe-oublie">Mot de passe oublié ?</Link>
              </small>
            </div>
            <button className="bouton bouton-primaire bouton-pleine-largeur" disabled={envoi}>
              {envoi ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <p className="auth-lien-bas">
            Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
