import client from "./client";

export const listerAvis = (artisanId) =>
  client.get("/avis/", { params: { artisan: artisanId } });

export const listerTousLesAvis = (params) => client.get("/avis/", { params });

export const laisserAvis = (donnees) => client.post("/avis/", donnees);

export const modererAvis = (id, est_modere) =>
  client.patch(`/avis/${id}/moderer/`, { est_modere });
