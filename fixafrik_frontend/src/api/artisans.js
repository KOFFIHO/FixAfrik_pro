import client from "./client";

export const rechercherArtisans = (params) =>
  client.get("/artisans/recherche/", { params });

export const recupererArtisan = (id) => client.get(`/artisans/recherche/${id}/`);

export const creerProfilArtisan = (donnees) =>
  client.post("/artisans/creer-profil/", donnees);

export const recupererMonProfilArtisan = () => client.get("/artisans/mon-profil/");

export const modifierMonProfilArtisan = (donnees) =>
  client.patch("/artisans/mon-profil/", donnees);

export const ajouterPhotoRealisation = (formData) =>
  client.post("/artisans/photos/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Administration
export const listerArtisansEnAttente = () =>
  client.get("/artisans/validation/en_attente/");

export const validerArtisan = (id, donnees) =>
  client.patch(`/artisans/validation/${id}/valider/`, donnees);
