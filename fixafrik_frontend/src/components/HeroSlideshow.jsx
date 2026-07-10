import { useEffect, useState } from "react";
import { listerImagesAccueil } from "../api/contenu";
import HeroIllustration from "./HeroIllustration";
import "./HeroSlideshow.css";

// Durée d'affichage de chaque image, en millisecondes (10 secondes).
const DUREE_AFFICHAGE_MS = 10000;

export default function HeroSlideshow() {
  // Liste des images renvoyées par le backend (gérées par l'admin).
  const [images, setImages] = useState([]);
  // Index de l'image actuellement affichée dans le diaporama.
  const [indexActif, setIndexActif] = useState(0);
  const [chargement, setChargement] = useState(true);

  // Récupère les images actives une seule fois au montage du composant.
  useEffect(() => {
    listerImagesAccueil()
      .then(({ data }) => setImages(data.results || data))
      .catch(() => setImages([]))
      .finally(() => setChargement(false));
  }, []);

  // Fait défiler automatiquement les images toutes les 20 secondes.
  useEffect(() => {
    if (images.length < 2) return;
    const minuteur = setInterval(() => {
      setIndexActif((precedent) => (precedent + 1) % images.length);
    }, DUREE_AFFICHAGE_MS);
    return () => clearInterval(minuteur);
  }, [images]);

  // Tant qu'aucune image n'a été ajoutée par l'administrateur, on retombe
  // sur l'illustration par défaut plutôt que de laisser un espace vide.
  if (chargement) return null;
  if (images.length === 0) return <HeroIllustration />;

  return (
    <div className="hero-slideshow">
      {images.map((img, i) => (
        <figure
          key={img.id}
          className={`hero-slide ${i === indexActif ? "hero-slide-actif" : ""}`}
        >
          <img src={img.image} alt={img.legende || "FixAfrik"} />
          {img.legende && <figcaption>{img.legende}</figcaption>}
        </figure>
      ))}

      {images.length > 1 && (
        <div className="hero-slideshow-puces">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              aria-label={`Aller à l'image ${i + 1}`}
              className={`hero-slideshow-puce ${i === indexActif ? "active" : ""}`}
              onClick={() => setIndexActif(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
