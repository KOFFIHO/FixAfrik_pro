// Espace admin > Contenu : gestion des images du diaporama affiché sur la
// page d'accueil (colonne de droite du hero). C'est ici que l'administrateur
// ajoute, réordonne ou retire les images — rien n'est codé en dur côté site
// public, tout vient de cette liste.
import { useEffect, useState } from "react";
import { Plus, Trash2, X, ImageIcon } from "lucide-react";
import {
  listerImagesAccueil, creerImageAccueil, modifierImageAccueil, supprimerImageAccueil,
} from "../../api/contenu";
import "../AdminCommon.css";

export default function GestionImagesAccueil() {
  const [images, setImages] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [formOuvert, setFormOuvert] = useState(false);
  const [fichier, setFichier] = useState(null);
  const [legende, setLegende] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const charger = async () => {
    setChargement(true);
    const { data } = await listerImagesAccueil();
    setImages(data.results || data);
    setChargement(false);
  };

  useEffect(() => {
    charger();
  }, []);

  const ouvrirCreation = () => {
    setFichier(null);
    setLegende("");
    setErreur("");
    setFormOuvert(true);
  };

  const soumettre = async (e) => {
    e.preventDefault();
    if (!fichier) {
      setErreur("Choisissez une image à ajouter.");
      return;
    }
    setErreur("");
    setEnvoi(true);
    try {
      const formData = new FormData();
      formData.append("image", fichier);
      formData.append("legende", legende);
      formData.append("ordre", images.length);
      await creerImageAccueil(formData);
      setFormOuvert(false);
      charger();
    } catch {
      setErreur("Impossible d'ajouter cette image. Vérifiez le format du fichier.");
    } finally {
      setEnvoi(false);
    }
  };

  const basculerActivation = async (img) => {
    await modifierImageAccueil(img.id, { est_active: !img.est_active });
    charger();
  };

  const supprimer = async (img) => {
    if (!window.confirm("Supprimer définitivement cette image du diaporama ?")) return;
    await supprimerImageAccueil(img.id);
    charger();
  };

  return (
    <div>
      <div className="admin-page-entete">
        <div>
          <h1>Images du diaporama d'accueil</h1>
          <p>Ces images défilent (toutes les 10 secondes) à droite du hero sur la page d'accueil.</p>
        </div>
        <button className="bouton bouton-primaire" onClick={ouvrirCreation}>
          <Plus size={16} /> Ajouter une image
        </button>
      </div>

      {chargement ? (
        <p>Chargement…</p>
      ) : images.length === 0 ? (
        <div className="carte" style={{ textAlign: "center", padding: 48 }}>
          <ImageIcon size={32} style={{ margin: "0 auto 12px auto", color: "var(--encre-douce)" }} />
          <p>Aucune image pour le moment. Le site affiche une illustration par défaut.</p>
        </div>
      ) : (
        <div className="images-accueil-grille">
          {images.map((img) => (
            <div className="carte image-accueil-carte" key={img.id}>
              <img src={img.image} alt={img.legende || "Image du diaporama"} />
              <div className="image-accueil-infos">
                <span>{img.legende || "Sans légende"}</span>
                <div className="table-actions">
                  <button
                    className={`etat-point ${img.est_active ? "actif" : ""}`}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                    onClick={() => basculerActivation(img)}
                  >
                    {img.est_active ? "Active" : "Masquée"}
                  </button>
                  <button className="bouton bouton-discret bouton-sm" onClick={() => supprimer(img)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOuvert && (
        <div className="modale-fond" onClick={() => setFormOuvert(false)}>
          <div className="carte modale" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Ajouter une image</h3>
              <button
                onClick={() => setFormOuvert(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            {erreur && <div className="message-erreur">{erreur}</div>}

            <form onSubmit={soumettre}>
              <div className="champ">
                <label>Fichier image</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setFichier(e.target.files[0])}
                />
                <small>Format recommandé : paysage, moins de 2 Mo pour un chargement rapide.</small>
              </div>
              <div className="champ">
                <label>Légende (optionnelle)</label>
                <input
                  value={legende}
                  onChange={(e) => setLegende(e.target.value)}
                  placeholder="ex : Un plombier chez un client à Cocody"
                />
              </div>
              <button className="bouton bouton-primaire bouton-pleine-largeur" disabled={envoi}>
                {envoi ? "Envoi en cours…" : "Ajouter au diaporama"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
