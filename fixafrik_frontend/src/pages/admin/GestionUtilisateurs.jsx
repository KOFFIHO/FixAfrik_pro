import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { listerUtilisateurs, basculerActivationUtilisateur } from "../../api/adminUsers";
import "../AdminCommon.css";

const ROLES = [
  { valeur: "", label: "Tous les rôles" },
  { valeur: "client", label: "Clients" },
  { valeur: "artisan", label: "Artisans" },
  { valeur: "admin", label: "Administrateurs" },
];

export default function GestionUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [role, setRole] = useState("");
  const [chargement, setChargement] = useState(true);

  const charger = async () => {
    setChargement(true);
    const params = {};
    if (recherche) params.search = recherche;
    if (role) params.role = role;
    const { data } = await listerUtilisateurs(params);
    setUtilisateurs(data.results || data);
    setChargement(false);
  };

  useEffect(() => {
    const delai = setTimeout(charger, 300);
    return () => clearTimeout(delai);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recherche, role]);

  const basculer = async (id) => {
    await basculerActivationUtilisateur(id);
    charger();
  };

  return (
    <div>
      <div className="admin-page-entete">
        <div>
          <h1>Gestion des utilisateurs</h1>
          <p>Consultez et gérez l'ensemble des comptes clients, artisans et administrateurs.</p>
        </div>
      </div>

      <div className="admin-recherche-barre">
        <div className="champ-icone">
          <Search size={16} />
          <input
            placeholder="Rechercher par nom, email, téléphone…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          {ROLES.map((r) => (
            <option key={r.valeur} value={r.valeur}>{r.label}</option>
          ))}
        </select>
      </div>

      <div className="carte table-carte">
        <div className="table-scroll">
          <table className="table-admin">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Contact</th>
                <th>Rôle</th>
                <th>Localisation</th>
                <th>Vérifié</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {chargement ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 32 }}>Chargement…</td></tr>
              ) : utilisateurs.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 32 }}>Aucun utilisateur trouvé.</td></tr>
              ) : (
                utilisateurs.map((u) => {
                  const nom = `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.username;
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="table-avatar-nom">
                          <span className="table-avatar">{nom.charAt(0).toUpperCase()}</span>
                          <div>
                            <strong>{nom}</strong>
                            <div style={{ fontSize: "0.78rem", color: "var(--encre-douce)" }}>
                              @{u.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{u.email}</div>
                        <div style={{ fontSize: "0.82rem", color: "var(--encre-douce)" }}>
                          {u.phone_number}
                        </div>
                      </td>
                      <td style={{ textTransform: "capitalize" }}>{u.role}</td>
                      <td>{u.commune ? `${u.commune}, ` : ""}{u.ville}</td>
                      <td>{u.est_verifie ? "Oui" : "—"}</td>
                      <td>
                        <span className={`etat-point ${u.is_active ? "actif" : ""}`}>
                          {u.is_active ? "Actif" : "Suspendu"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`bouton bouton-sm ${u.is_active ? "bouton-discret" : "bouton-secondaire"}`}
                          onClick={() => basculer(u.id)}
                        >
                          {u.is_active ? "Suspendre" : "Réactiver"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
