import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, ShieldCheck, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { reinitialiserMotDePasse } from "../api/auth";
import "./Auth.css";

const VALEURS_INITIALES = {
  username: "",
  phone_number: "",
  nouveau_mot_de_passe: "",
  confirmation_mot_de_passe: "",
};

export default function MotDePasseOublie() {
  const navigate = useNavigate();
  const [form, setForm] = useState(VALEURS_INITIALES);
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [succes, setSucces] = useState(false);

  const majChamp = (champ, valeur) => setForm({ ...form, [champ]: valeur });

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      await reinitialiserMotDePasse(form);
      setSucces(true);
      setTimeout(() => navigate("/connexion"), 2200);
    } catch (err) {
      const donnees = err.response?.data;
      const premierMessage =
        donnees && typeof donnees === "object"
          ? Object.values(donnees)[0]
          : null;
      setErreur(
        (Array.isArray(premierMessage) ? premierMessage[0] : premierMessage) ||
          "Impossible de réinitialiser le mot de passe. Vérifiez vos informations."
      );
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panneau-marque">
        <h2>Mot de passe oublié ? Pas de panique.</h2>
        <p>
          Confirmez simplement votre nom d'utilisateur et votre numéro de téléphone
          pour choisir un nouveau mot de passe.
        </p>
        <div className="auth-panneau-points">
          <div className="auth-point"><ShieldCheck size={18} /> Vérification par téléphone</div>
          <div className="auth-point"><KeyRound size={18} /> Nouveau mot de passe immédiat</div>
        </div>
      </div>

      <div className="auth-formulaire-panneau">
        <div className="auth-carte">
          <h1>Réinitialiser mon mot de passe</h1>
          <p className="auth-sous-titre">
            Indiquez votre nom d'utilisateur et le numéro de téléphone associé à votre
            compte FixAfrik.
          </p>

          {succes ? (
            <div className="message-succes">
              <CheckCircle2 size={16} /> Mot de passe réinitialisé. Redirection vers la connexion…
            </div>
          ) : (
            <>
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
                    required
                    value={form.username}
                    onChange={(e) => majChamp("username", e.target.value)}
                  />
                </div>

                <div className="champ">
                  <label htmlFor="phone_number">Numéro de téléphone</label>
                  <input
                    id="phone_number"
                    required
                    placeholder="+225 07 00 00 00 00"
                    value={form.phone_number}
                    onChange={(e) => majChamp("phone_number", e.target.value)}
                  />
                  <small><Phone size={12} style={{ verticalAlign: "-1px" }} /> Le numéro utilisé lors de l'inscription.</small>
                </div>

                <div className="champ">
                  <label htmlFor="nouveau">Nouveau mot de passe</label>
                  <input
                    id="nouveau"
                    type="password"
                    required
                    value={form.nouveau_mot_de_passe}
                    onChange={(e) => majChamp("nouveau_mot_de_passe", e.target.value)}
                  />
                </div>

                <div className="champ">
                  <label htmlFor="confirmation">Confirmer le nouveau mot de passe</label>
                  <input
                    id="confirmation"
                    type="password"
                    required
                    value={form.confirmation_mot_de_passe}
                    onChange={(e) => majChamp("confirmation_mot_de_passe", e.target.value)}
                  />
                </div>

                <button className="bouton bouton-primaire bouton-pleine-largeur" disabled={envoi}>
                  {envoi ? "Réinitialisation…" : "Réinitialiser mon mot de passe"}
                </button>
              </form>
            </>
          )}

          <p className="auth-lien-bas">
            <Link to="/connexion">Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
