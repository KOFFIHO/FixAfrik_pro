// Page "Mon profil" (espace client) : informations personnelles + photo.
import { useState, useEffect } from "react";
import { Camera, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { modifierProfil } from "../api/auth";
import "./Profil.css";

// Configurez ici l'URL de votre backend si nécessaire pour les images (ex: "http://127.0.0.1:8000")
const API_BASE_URL = ""; 

export default function Profil() {
  const { utilisateur, mettreAJourUtilisateur } = useAuth();
  
  const [form, setForm] = useState({
    first_name: utilisateur?.first_name || "",
    last_name: utilisateur?.last_name || "",
    email: utilisateur?.email || "",
    phone_number: utilisateur?.phone_number || "",
    ville: utilisateur?.ville || "",
    commune: utilisateur?.commune || "",
  });
  const [message, setMessage] = useState("");
  const [envoi, setEnvoi] = useState(false);

  // Fichier photo choisi (pas encore envoyé) et son aperçu local.
  const [nouvellePhoto, setNouvellePhoto] = useState(null);
  const [apercuPhoto, setApercuPhoto] = useState(null);

  // Synchronise les champs et l'image dès que l'utilisateur se connecte ou rafraîchit la page
  useEffect(() => {
    if (utilisateur) {
      setForm({
        first_name: utilisateur.first_name || "",
        last_name: utilisateur.last_name || "",
        email: utilisateur.email || "",
        phone_number: utilisateur.phone_number || "",
        ville: utilisateur.ville || "",
        commune: utilisateur.commune || "",
      });

      if (utilisateur.photo_profil) {
        // Gère le cas où le chemin de l'image commence par "/" (chemin relatif du serveur)
        const urlPhoto = utilisateur.photo_profil.startsWith("http")
          ? utilisateur.photo_profil
          : `${API_BASE_URL}${utilisateur.photo_profil}`;
        setApercuPhoto(urlPhoto);
      } else {
        setApercuPhoto(null);
      }
    }
  }, [utilisateur]);

  const majChamp = (champ, valeur) => setForm({ ...form, [champ]: valeur });

  const choisirPhoto = (fichier) => {
    if (!fichier) return;
    setNouvellePhoto(fichier);
    setApercuPhoto(URL.createObjectURL(fichier));
  };

  const soumettre = async (e) => {
    e.preventDefault();
    setEnvoi(true);
    setMessage("");
    try {
      // On passe obligatoirement par un FormData pour s'assurer que le backend accepte la structure multipart
      const payload = new FormData();
      Object.entries(form).forEach(([cle, valeur]) => payload.append(cle, valeur));
      
      if (nouvellePhoto) {
        payload.append("photo_profil", nouvellePhoto);
      }

      const { data } = await modifierProfil(payload);
      mettreAJourUtilisateur(data);
      setNouvellePhoto(null);
      setMessage("Profil mis à jour avec succès.");
    } catch (erreur) {
      console.error("Erreur de sauvegarde :", erreur);
    } finally {
      setEnvoi(false);
    }
  };

  const initiale = (utilisateur?.first_name || utilisateur?.username || "?").charAt(0).toUpperCase();

  return (
    <div className="conteneur profil-page">
      <h1>Mon profil</h1>
      {message && (
        <div className="message-succes">
          <CheckCircle2 size={16} /> {message}
        </div>
      )}

      <form className="carte" onSubmit={soumettre}>
        {/* Photo de profil : aperçu + bouton pour la changer */}
        <div className="profil-photo-zone">
          <div className="profil-photo-avatar">
            {apercuPhoto ? (
              <img src={apercuPhoto} alt="Photo de profil" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            ) : (
              <span>{initiale}</span>
            )}
            <label className="profil-photo-bouton" title="Changer la photo">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => choisirPhoto(e.target.files[0])}
                hidden
              />
            </label>
          </div>
          <div>
            <strong>{utilisateur?.first_name} {utilisateur?.last_name}</strong>
            <p style={{ margin: "2px 0 0 0" }}>Cliquez sur l'icône pour changer votre photo.</p>
          </div>
        </div>

        <div className="champs-ligne">
          <div className="champ">
            <label>Prénom</label>
            <input value={form.first_name} onChange={(e) => majChamp("first_name", e.target.value)} />
          </div>
          <div className="champ">
            <label>Nom</label>
            <input value={form.last_name} onChange={(e) => majChamp("last_name", e.target.value)} />
          </div>
        </div>
        <div className="champ">
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => majChamp("email", e.target.value)} />
        </div>
        <div className="champ">
          <label>Téléphone</label>
          <input value={form.phone_number} placeholder="ex : plomberie sanitaire, chauffe-eau, canalisation"
          onChange={(e) => majChamp("phone_number", e.target.value)} />
        </div>
        <div className="champs-ligne">
          <div className="champ">
            <label>Ville</label>
            <input value={form.ville} onChange={(e) => majChamp("ville", e.target.value)} />
          </div>
          <div className="champ">
            <label>Commune</label>
            <input value={form.commune} onChange={(e) => majChamp("commune", e.target.value)} />
          </div>
        </div>
        <button className="bouton bouton-primaire bouton-pleine-largeur" disabled={envoi}>
          {envoi ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}