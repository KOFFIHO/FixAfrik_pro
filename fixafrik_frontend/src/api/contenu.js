import client from "./client";

// Lecture publique : alimente le diaporama de la page d'accueil
export const listerImagesAccueil = () => client.get("/contenu/images-accueil/");

// Gestion (réservée à l'administrateur)
export const creerImageAccueil = (formData) =>
  client.post("/contenu/images-accueil/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const modifierImageAccueil = (id, donnees) =>
  client.patch(`/contenu/images-accueil/${id}/`, donnees);

export const supprimerImageAccueil = (id) =>
  client.delete(`/contenu/images-accueil/${id}/`);
