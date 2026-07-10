import { createContext, useContext, useState, useEffect } from "react";
import { connecter, recupererProfil } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("fixafrik_access");
      if (token) {
        try {
          const { data } = await recupererProfil();
          setUtilisateur(data);
        } catch {
          localStorage.removeItem("fixafrik_access");
          localStorage.removeItem("fixafrik_refresh");
        }
      }
      setChargement(false);
    };
    init();
  }, []);

  const connexion = async (username, password) => {
    const { data } = await connecter(username, password);
    localStorage.setItem("fixafrik_access", data.access);
    localStorage.setItem("fixafrik_refresh", data.refresh);
    setUtilisateur(data.user);
    return data.user;
  };

  const deconnexion = () => {
    localStorage.removeItem("fixafrik_access");
    localStorage.removeItem("fixafrik_refresh");
    setUtilisateur(null);
  };

  const mettreAJourUtilisateur = (donnees) => {
    setUtilisateur((precedent) => ({ ...precedent, ...donnees }));
  };

  return (
    <AuthContext.Provider
      value={{ utilisateur, chargement, connexion, deconnexion, mettreAJourUtilisateur }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexte = useContext(AuthContext);
  if (!contexte) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  }
  return contexte;
}
