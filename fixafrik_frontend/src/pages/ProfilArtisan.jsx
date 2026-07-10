import { useEffect, useState } from "react";
import { listerCategories } from "../api/categories";
import {
  recupererMonProfilArtisan,
  creerProfilArtisan,
  modifierMonProfilArtisan,
} from "../api/artisans";
import Pastille from "../components/Pastille";
import { Camera, FileText } from "lucide-react";
import "./ProfilArtisan.css";

const API_BASE_URL = ""; 

export default function ProfilArtisan() {
  const [categories, setCategories] = useState([]);
  const [profil, setProfil] = useState(null);
  const [existeDeja, setExisteDeja] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  // Formulaire unifié contenant les infos de l'Artisan ET de son compte User
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    photo_profil: null,
    categorie_principale: "",
    description: "",
    competences: "",
    annees_experience: 0,
    zone_geographique: "",
    piece_identite: null,
  });

  const [apercuPhotoProfil, setApercuPhotoProfil] = useState("");
  const [urlPieceExistante, setUrlPieceExistante] = useState("");
  const [apercuPieceIdentite, setApercuPieceIdentite] = useState("");

  useEffect(() => {
    const charger = async () => {
      try {
        const { data: cats } = await listerCategories();
        setCategories(cats.results || cats);

        const { data } = await recupererMonProfilArtisan();
        setProfil(data);
        setExisteDeja(true);
        
        setForm({
          first_name: data.user?.first_name || "",
          last_name: data.user?.last_name || "",
          photo_profil: null,
          categorie_principale: data.categorie_principale?.id || "",
          description: data.description || "",
          competences: data.competences || "",
          annees_experience: data.annees_experience || 0,
          zone_geographique: data.zone_geographique || "",
          piece_identite: null,
        });

        // Gestion de l'affichage initial de la photo de profil utilisateur
        if (data.user?.photo_profil) {
          const urlPhoto = data.user.photo_profil.startsWith("http")
            ? data.user.photo_profil
            : `${API_BASE_URL}${data.user.photo_profil}`;
          setApercuPhotoProfil(urlPhoto);
        }

        // Gestion du justificatif / pièce d'identité existant
        if (data.piece_identite) {
          const urlPiece = data.piece_identite.startsWith("http")
            ? data.piece_identite
            : `${API_BASE_URL}${data.piece_identite}`;
          setUrlPieceExistante(urlPiece);
          setApercuPieceIdentite(urlPiece);
        }
      } catch {
        setExisteDeja(false);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const majChamp = (champ, valeur) => setForm({ ...form, [champ]: valeur });

  // Gestion du changement de photo de profil
  const gererPhotoProfil = (fichier) => {
    if (!fichier) return;
    majChamp("photo_profil", fichier);
    setApercuPhotoProfil(URL.createObjectURL(fichier));
  };

  // Gestion du changement de la pièce d'identité
  const gererPieceIdentite = (fichier) => {
    if (!fichier) return;
    majChamp("piece_identite", fichier);

    if (fichier.type.startsWith("image/")) {
      setApercuPieceIdentite(URL.createObjectURL(fichier));
    } else {
      setApercuPieceIdentite("pdf-local");
    }
  };

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    setMessage("");
    setEnvoi(true);

    const formData = new FormData();
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);
    formData.append("categorie_principale", form.categorie_principale);
    formData.append("description", form.description);
    formData.append("competences", form.competences);
    formData.append("annees_experience", form.annees_experience);
    formData.append("zone_geographique", form.zone_geographique);

    // N'ajouter au FormData que si un nouveau fichier a été sélectionné
    if (form.photo_profil) {
      formData.append("photo_profil", form.photo_profil);
    }
    
    if (form.piece_identite) {
      formData.append("piece_identite", form.piece_identite);
    } else if (existeDeja && !urlPieceExistante) {
      formData.append("piece_identite", "");
    }

    try {
      if (existeDeja) {
        const { data } = await modifierMonProfilArtisan(formData);
        setProfil(data);
        setMessage("Profil et informations personnelles mis à jour !");
      } else {
        const { data } = await creerProfilArtisan(formData);
        setProfil(data);
        setExisteDeja(true);
        setMessage("Profil créé avec succès ! En attente de validation.");
      }
      
      // Rafraîchir les états visuels avec les nouvelles URL renvoyées par le serveur
      if (profil?.user?.photo_profil) {
        const urlPhoto = profil.user.photo_profil.startsWith("http") ? profil.user.photo_profil : `${API_BASE_URL}${profil.user.photo_profil}`;
        setApercuPhotoProfil(urlPhoto);
      }
    } catch (err) {
      setErreur("Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setEnvoi(false);
    }
  };

  if (chargement) return <div className="conteneur" style={{ padding: 48 }}>Chargement…</div>;

  const initiale = form.first_name ? form.first_name.charAt(0).toUpperCase() : "?";

  return (
    <div className="conteneur profil-artisan">
      <div className="profil-artisan-entete">
        <h1>Mon Profil Artisan</h1>
        {profil && <Pastille statut={profil.statut_validation} />}
      </div>

      {message && <div className="message-succes">{message}</div>}
      {erreur && <div className="message-erreur">{erreur}</div>}

      <form className="carte" onSubmit={soumettre}>
        
        {/* === SECTION : MODIFICATION DE LA PHOTO ET INFOS DE BASE === */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", paddingBottom: "24px", marginBottom: "24px", borderBottom: "1px solid #edf2f7" }}>
          <div style={{ position: "relative", width: "90px", height: "90px", borderRadius: "50%", overflow: "hidden", backgroundColor: "#e2e8f0", border: "3px solid var(--primaire, #1a73e8)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {apercuPhotoProfil ? (
              <img src={apercuPhotoProfil} alt="Photo profil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "32px", fontWeight: "bold", color: "#4a5568" }}>{initiale}</span>
            )}
            <label htmlFor="edit_photo_profil" style={{ position: "absolute", bottom: 0, width: "100%", background: "rgba(0, 0, 0, 0.6)", padding: "4px 0", display: "flex", justifyContent: "center", cursor: "pointer" }}>
              <Camera size={14} color="#fff" />
            </label>
            <input
              type="file"
              id="edit_photo_profil"
              accept="image/*"
              onChange={(e) => gererPhotoProfil(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--texte-discret)" }}>Cliquez sur l'icône photo pour modifier votre image</p>
        </div>

        {/* MODIFICATION DU PRÉNOM & NOM */}
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

        {/* --- CHAMPS TRADITIONNELS DU PROFIL ARTISAN --- */}
        <div className="champ">
          <label htmlFor="categorie">Métier principal</label>
          <select id="categorie" required value={form.categorie_principale} onChange={(e) => majChamp("categorie_principale", e.target.value)}>
            <option value="">Choisir un métier…</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>

        <div className="champ">
          <label htmlFor="zone">Zone d'intervention</label>
          <input id="zone" required placeholder="ex : Cocody, Marcory" value={form.zone_geographique} onChange={(e) => majChamp("zone_geographique", e.target.value)} />
        </div>

        <div className="champ">
          <label htmlFor="experience">Années d'expérience</label>
          <input id="experience" type="number" min="0" value={form.annees_experience} onChange={(e) => majChamp("annees_experience", Number(e.target.value))} />
        </div>

        <div className="champ">
          <label htmlFor="description">Description</label>
          <textarea id="description" placeholder="Présentez votre parcours et votre savoir-faire…" rows={4} value={form.description} onChange={(e) => majChamp("description", e.target.value)} />
        </div>

        <div className="champ">
          <label htmlFor="competences">Compétences</label>
          <input id="competences" placeholder="ex : plomberie sanitaire, chauffe-eau" value={form.competences} onChange={(e) => majChamp("competences", e.target.value)} />
        </div>

        {/* PIÈCE D'IDENTITÉ */}
        <div className="champ">
          <label htmlFor="piece_identite">Pièce d'identité</label>
          <div style={{ display: "flex", gap: "20px", alignItems: "center", marginTop: "5px", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "250px" }}>
              <input id="piece_identite" type="file" accept="image/*,.pdf" onChange={(e) => gererPieceIdentite(e.target.files[0])} style={{ width: "100%" }} />
            </div>

            <div style={{ flex: "1", minWidth: "200px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px dashed #ced4da", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90px" }}>
              {apercuPieceIdentite === "pdf-local" ? (
                <div style={{ textAlign: "center" }}>
                  <FileText size={24} color="var(--ambre)" />
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--ambre)", fontWeight: "bold" }}>Nouveau PDF</p>
                </div>
              ) : apercuPieceIdentite ? (
                <div style={{ textAlign: "center", width: "100%" }}>
                  {apercuPieceIdentite.match(/\.(jpeg|jpg|gif|png)$/i) || apercuPieceIdentite.startsWith("blob:") ? (
                    <img src={apercuPieceIdentite} alt="Pièce" style={{ maxHeight: "75px", maxWidth: "100%", borderRadius: "4px", objectFit: "contain" }} />
                  ) : (
                    <FileText size={24} />
                  )}
                  {apercuPieceIdentite === urlPieceExistante && (
                    <a href={urlPieceExistante} target="_blank" rel="noopener noreferrer" style={{ display: "block", color: "#1a73e8", fontSize: "11px", marginTop: "4px", textDecoration: "none" }}>Voir en ligne</a>
                  )}
                </div>
              ) : (
                <span style={{ color: "var(--texte-discret)", fontSize: "12px" }}>Aucun document</span>
              )}
            </div>
          </div>
        </div>

        <button className="bouton bouton-primaire bouton-pleine-largeur" disabled={envoi}>
          {envoi ? "Enregistrement…" : existeDeja ? "Mettre à jour mon profil" : "Créer mon profil"}
        </button>
      </form>
    </div>
  );
}