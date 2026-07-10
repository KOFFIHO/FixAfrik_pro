import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Wrench, MapPin, SearchX, AlertCircle } from "lucide-react";
import { rechercherArtisans } from "../api/artisans";
import { listerCategories } from "../api/categories";
import ArtisanCarte from "../components/ArtisanCarte";
import "./RechercheArtisans.css";

export default function RechercheArtisans() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  // Champs du formulaire, synchronisés avec l'URL (?metier=&zone=)
  const [metier, setMetier] = useState(searchParams.get("metier") || "");
  const [zone, setZone] = useState(searchParams.get("zone") || "");

  useEffect(() => {
    listerCategories().then(({ data }) => {
      setCategories(data.results || data);
    });
  }, []);

  // Se resynchronise si l'URL change (ex : clic sur une puce métier depuis l'accueil)
  useEffect(() => {
    setMetier(searchParams.get("metier") || "");
    setZone(searchParams.get("zone") || "");
  }, [searchParams]);

  // La recherche elle-même se relance à chaque changement d'URL ou de catégories chargées
  useEffect(() => {
    const metierActuel = searchParams.get("metier") || "";
    const zoneActuelle = searchParams.get("zone") || "";

    const rechercher = async () => {
      setChargement(true);
      setErreur("");
      try {
        const params = {};
        if (zoneActuelle) params.search = zoneActuelle;
        if (metierActuel) {
          const categorieCorrespondante = categories.find(
            (c) => c.nom.toLowerCase() === metierActuel.toLowerCase()
          );
          if (categorieCorrespondante) {
            params.categorie_principale = categorieCorrespondante.id;
          } else {
            // Le métier tapé ne correspond à aucune catégorie connue : on le
            // passe quand même en recherche texte pour ne pas bloquer l'utilisateur.
            params.search = [zoneActuelle, metierActuel].filter(Boolean).join(" ");
          }
        }

        const { data } = await rechercherArtisans(params);
        setArtisans(data.results || data);
      } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 401) {
          setErreur("Connectez-vous en tant que client pour rechercher des artisans.");
        } else {
          setErreur("Impossible de charger les artisans pour le moment.");
        }
        setArtisans([]);
      } finally {
        setChargement(false);
      }
    };
    rechercher();
  }, [searchParams, categories]);

  const soumettre = (e) => {
    e.preventDefault();
    const params = {};
    if (metier) params.metier = metier;
    if (zone) params.zone = zone;
    setSearchParams(params);
  };

  return (
    <div className="recherche-hero">
      <div className="conteneur">
        <p className="etiquette-mono recherche-eyebrow">Recherche</p>
        <h1>Trouver un artisan</h1>
        <p className="recherche-sous-titre">
          Filtrez par métier et par zone géographique pour trouver le bon professionnel à Abidjan.
        </p>

        <form className="recherche-barre" onSubmit={soumettre}>
          <div className="recherche-champ">
            <Wrench size={18} />
            <input
              type="text"
              placeholder="Métier (ex : plombier)"
              value={metier}
              onChange={(e) => setMetier(e.target.value)}
              list="liste-metiers"
            />
          </div>
          <datalist id="liste-metiers">
            {categories.map((c) => (
              <option key={c.id} value={c.nom} />
            ))}
          </datalist>
          <div className="recherche-champ">
            <MapPin size={18} />
            <input
              type="text"
              placeholder="Zone / commune"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            />
          </div>
          <button className="bouton bouton-primaire" type="submit">
            Rechercher
          </button>
        </form>
      </div>

      <div className="conteneur recherche-resultats">
        {erreur && (
          <div className="message-erreur">
            <AlertCircle size={16} /> {erreur}
          </div>
        )}

        {chargement ? (
          <p>Recherche en cours…</p>
        ) : artisans.length === 0 && !erreur ? (
          <div className="carte recherche-vide">
            <SearchX size={32} style={{ margin: "0 auto 12px auto", color: "var(--encre-douce)" }} />
            <p>Aucun artisan ne correspond à cette recherche pour le moment.</p>
          </div>
        ) : (
          <>
            {!erreur && (
              <p className="recherche-compteur">
                {artisans.length} artisan{artisans.length > 1 ? "s" : ""} trouvé{artisans.length > 1 ? "s" : ""}
              </p>
            )}
            <div className="recherche-grille">
              {artisans.map((artisan) => (
                <ArtisanCarte key={artisan.id} artisan={artisan} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
