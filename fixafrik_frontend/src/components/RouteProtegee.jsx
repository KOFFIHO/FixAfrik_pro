import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protège une route : redirige vers /connexion si non connecté,
 * ou vers l'accueil si le rôle ne correspond pas.
 */
export default function RouteProtegee({ children, rolesAutorises }) {
  const { utilisateur, chargement } = useAuth();

  if (chargement) {
    return <div className="conteneur" style={{ padding: "80px 24px" }}>Chargement…</div>;
  }

  if (!utilisateur) {
    return <Navigate to="/connexion" replace />;
  }

  if (rolesAutorises && !rolesAutorises.includes(utilisateur.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
