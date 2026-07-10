import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, Wrench, ShieldCheck, TrendingUp, AlertCircle, Camera } from "lucide-react";
import { inscrire } from "../api/auth";
import "./Auth.css";

const VALEURS_INITIALES = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  ville: "Abidjan",
  commune: "",
  password: "",
  password_confirm: "",
  photo_profil: null, // Initialisation du champ photo de profil
};

export default function Inscription() {
  const navigate = useNavigate();
  const [role, setRole] = useState("client");
  const [form, setForm] = useState(VALEURS_INITIALES);
  const [apercuPhoto, setApercuPhoto] = useState(null); // Gère l'affichage immédiat de l'image sélectionnée
  const [erreurs, setErreurs] = useState({});
  const [envoi, setEnvoi] = useState(false);

  const majChamp = (champ, valeur) => setForm({ ...form, [champ]: valeur });

  const gererPhoto = (e) => {
    const fichier = e.target.files[0];
    if (fichier) {
      majChamp("photo_profil", fichier);
      setApercuPhoto(URL.createObjectURL(fichier)); // Crée un lien local temporaire pour l'image
    }
  };

  const soumettre = async (e) => {
    e.preventDefault();
    setErreurs({});
    setEnvoi(true);

    // Transformation en FormData pour transporter le fichier de manière appropriée
    const formData = new FormData();
    formData.append("role", role);
    formData.append("username", form.username);
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);
    formData.append("email", form.email);
    formData.append("phone_number", form.phone_number);
    formData.append("ville", form.ville);
    formData.append("commune", form.commune);
    formData.append("password", form.password);
    formData.append("password_confirm", form.password_confirm);
    
    // Le champ n'étant pas obligatoire, on l'ajoute uniquement si l'utilisateur a choisi un fichier
    if (form.photo_profil) {
      formData.append("photo_profil", form.photo_profil);
    }

    try {
      // Passer formData à la fonction d'inscription
      await inscrire(formData);
      navigate("/connexion", {
        state: { message: "Compte créé avec succès. Connectez-vous pour continuer." },
      });
    } catch (err) {
      setErreurs(err.response?.data || { general: "Une erreur est survenue. Réessayez." });
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panneau-marque">
        <h2>Rejoignez une communauté d'artisans et de clients de confiance.</h2>
        <p>Que vous cherchiez un artisan ou que vous en soyez un client, FixAfrik simplifie tout.</p>
        <div className="auth-panneau-points">
          <div className="auth-point"><UserRound size={18} /> Inscription gratuite en 1 minute</div>
          <div className="auth-point"><ShieldCheck size={18} /> Vérification sérieuse des artisans</div>
          <div className="auth-point"><TrendingUp size={18} /> Développez votre clientèle locale</div>
        </div>
      </div>

      <div className="auth-formulaire-panneau">
        <div className="auth-carte">
          <h1>Rejoindre FixAfrik</h1>
          <p className="auth-sous-titre">Créez votre compte en quelques instants.</p>

          <div className="role-choix">
            <button
              type="button"
              className={`role-bouton ${role === "client" ? "actif" : ""}`}
              onClick={() => setRole("client")}
            >
              <UserRound size={16} /> Je suis client
            </button>
            <button
              type="button"
              className={`role-bouton ${role === "artisan" ? "actif" : ""}`}
              onClick={() => setRole("artisan")}
            >
              <Wrench size={16} /> Je suis artisan
            </button>
          </div>

          {erreurs.general && (
            <div className="message-erreur">
              <AlertCircle size={16} /> {erreurs.general}
            </div>
          )}

          <form onSubmit={soumettre}>
            
            {/* --- BLOC D'AJOUT DE LA PHOTO DE PROFIL --- */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px", gap: "8px" }}>
              <div style={{ position: "relative", width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#f3f4f6", border: "2px dashed #cbd5e1", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                {apercuPhoto ? (
                  <img src={apercuPhoto} alt="Aperçu profil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Camera size={28} style={{ color: "#94a3b8" }} />
                )}
                <input
                  type="file"
                  id="photo_profil"
                  accept="image/*"
                  onChange={gererPhoto}
                  style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                />
              </div>
              <label htmlFor="photo_profil" style={{ fontSize: "13px", color: "var(--primaire, #1a73e8)", cursor: "pointer", fontWeight: "500" }}>
                Ajouter une photo de profil (facultatif)
              </label>
              {erreurs.photo_profil && <small style={{ color: "var(--danger)" }}>{erreurs.photo_profil}</small>}
            </div>

            <div className="champs-ligne">
              <div className="champ">
                <label htmlFor="first_name">Prénom</label>
                <input
                  id="first_name"
                  required
                  value={form.first_name}
                  onChange={(e) => majChamp("first_name", e.target.value)}
                />
              </div>
              <div className="champ">
                <label htmlFor="last_name">Nom</label>
                <input
                  id="last_name"
                  required
                  value={form.last_name}
                  onChange={(e) => majChamp("last_name", e.target.value)}
                />
              </div>
            </div>

            <div className="champ">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                id="username"
                required
                value={form.username}
                onChange={(e) => majChamp("username", e.target.value)}
              />
              {erreurs.username && <small style={{ color: "var(--danger)" }}>{erreurs.username}</small>}
            </div>

            <div className="champ">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => majChamp("email", e.target.value)}
              />
              {erreurs.email && <small style={{ color: "var(--danger)" }}>{erreurs.email}</small>}
            </div>

            <div className="champ">
              <label htmlFor="phone_number">Numéro de téléphone</label>
              <input
                id="phone_number"
                required
                placeholder="0700000000"
                maxLength={10}
                value={form.phone_number}
                onChange={(e) => {
                  const chiffresSeuls = e.target.value.replace(/\D/g, "");
                  majChamp("phone_number", chiffresSeuls);
                }}
              />
              {erreurs.phone_number && (
                <small style={{ color: "var(--danger)" }}>{erreurs.phone_number}</small>
              )}
            </div>

            <div className="champs-ligne">
              <div className="champ">
                <label htmlFor="ville">Ville</label>
                <input
                  id="ville"
                  value={form.ville}
                  onChange={(e) => majChamp("ville", e.target.value)}
                />
              </div>
              <div className="champ">
                <label htmlFor="commune">Commune</label>
                <input
                  id="commune"
                  placeholder="ex : Cocody"
                  value={form.commune}
                  onChange={(e) => majChamp("commune", e.target.value)}
                />
              </div>
            </div>

            <div className="champ">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => majChamp("password", e.target.value)}
              />
              {erreurs.password && <small style={{ color: "var(--danger)" }}>{erreurs.password}</small>}
            </div>

            <div className="champ">
              <label htmlFor="password_confirm">Confirmer le mot de passe</label>
              <input
                id="password_confirm"
                type="password"
                required
                value={form.password_confirm}
                onChange={(e) => majChamp("password_confirm", e.target.value)}
              />
              {erreurs.password_confirm && (
                <small style={{ color: "var(--danger)" }}>{erreurs.password_confirm}</small>
              )}
            </div>

            {role === "artisan" && (
              <p className="auth-sous-titre" style={{ fontSize: "0.85rem" }}>
                Après inscription, vous pourrez compléter votre profil (métier, compétences,
                pièce d'identité) pour être vérifié par notre équipe.
              </p>
            )}

            <button className="bouton bouton-primaire bouton-pleine-largeur" disabled={envoi}>
              {envoi ? "Création…" : "Créer mon compte"}
            </button>
          </form>

          <p className="auth-lien-bas">
            Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}