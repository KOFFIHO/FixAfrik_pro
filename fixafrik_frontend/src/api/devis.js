import client from "./client";

// Récupère les devis liés à une demande précise (reçus par le client,
// ou envoyés par l'artisan connecté selon le rôle).
export const listerPropositionsDevis = (demandeId) =>
  client.get("/demandes/propositions-devis/", { params: { demande: demandeId } });

// L'artisan envoie (ou met à jour) son devis pour une demande.
export const envoyerPropositionDevis = (donnees) =>
  client.post("/demandes/propositions-devis/", donnees);

// Le client accepte un devis précis.
export const accepterPropositionDevis = (id) =>
  client.post(`/demandes/propositions-devis/${id}/accepter/`);
