import client from "./client";

// Version corrigée et unique pour gérer le FormData (avec la photo de profil)
export const inscrire = (formData) => {
  return client.post("/auth/register/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const connecter = (username, password) =>
  client.post("/auth/login/", { username, password });

export const recupererProfil = () => client.get("/auth/me/");

export const modifierProfil = (donnees) => client.patch("/auth/me/", donnees);

export const changerMotDePasse = (donnees) =>
  client.post("/auth/me/change-password/", donnees);

export const reinitialiserMotDePasse = (donnees) =>
  client.post("/auth/mot-de-passe-oublie/", donnees);