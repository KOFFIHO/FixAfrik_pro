import client from "./client";

export const listerCategories = () => client.get("/categories/");

export const creerCategorie = (donnees) => client.post("/categories/", donnees);

export const modifierCategorie = (id, donnees) => client.patch(`/categories/${id}/`, donnees);

export const supprimerCategorie = (id) => client.delete(`/categories/${id}/`);
