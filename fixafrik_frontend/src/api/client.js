import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const client = axios.create({
  baseURL: API_URL,
});

// Ajoute automatiquement le token d'accès à chaque requête
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("fixafrik_access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si le token a expiré (401), on tente un rafraîchissement automatique une fois
let rafraichissementEnCours = null;

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requeteOriginale = error.config;
    const refresh = localStorage.getItem("fixafrik_refresh");

    if (error.response?.status === 401 && refresh && !requeteOriginale._retry) {
      requeteOriginale._retry = true;
      try {
        if (!rafraichissementEnCours) {
          rafraichissementEnCours = axios.post(`${API_URL}/auth/login/refresh/`, {
            refresh,
          });
        }
        const { data } = await rafraichissementEnCours;
        rafraichissementEnCours = null;
        localStorage.setItem("fixafrik_access", data.access);
        requeteOriginale.headers.Authorization = `Bearer ${data.access}`;
        return client(requeteOriginale);
      } catch (erreurRefresh) {
        localStorage.removeItem("fixafrik_access");
        localStorage.removeItem("fixafrik_refresh");
        localStorage.removeItem("fixafrik_user");
        window.location.href = "/connexion";
        return Promise.reject(erreurRefresh);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
