import client from "./client";

export const listerDemandes = (params) => client.get("/demandes/", { params });

export const recupererDemande = (id) => client.get(`/demandes/${id}/`);

export const creerDemande = (donnees) => client.post("/demandes/", donnees);

export const accepterDemande = (id) => client.post(`/demandes/${id}/accepter/`);

export const demarrerDemande = (id) => client.post(`/demandes/${id}/demarrer/`);

export const terminerDemande = (id) => client.post(`/demandes/${id}/terminer/`);

export const annulerDemande = (id) => client.post(`/demandes/${id}/annuler/`);
