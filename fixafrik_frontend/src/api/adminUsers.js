import client from "./client";

export const listerUtilisateurs = (params) =>
  client.get("/auth/admin/utilisateurs/", { params });

export const basculerActivationUtilisateur = (id) =>
  client.patch(`/auth/admin/utilisateurs/${id}/basculer_activation/`);
