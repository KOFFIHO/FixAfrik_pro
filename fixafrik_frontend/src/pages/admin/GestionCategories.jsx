import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  listerCategories, creerCategorie, modifierCategorie, supprimerCategorie,
} from "../../api/categories";
import "../AdminCommon.css";

const VIDE = { nom: "", description: "", icone: "", est_active: true };

export default function GestionCategories() {
  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [formOuvert, setFormOuvert] = useState(false);
  const [enEdition, setEnEdition] = useState(null);
  const [form, setForm] = useState(VIDE);
  const [erreur, setErreur] = useState("");

  const charger = async () => {
    setChargement(true);
    const { data } = await listerCategories();
    setCategories(data.results || data);
    setChargement(false);
  };

  useEffect(() => {
    charger();
  }, []);

  const ouvrirCreation = () => {
    setEnEdition(null);
    setForm(VIDE);
    setErreur("");
    setFormOuvert(true);
  };

  const ouvrirEdition = (cat) => {
    setEnEdition(cat.id);
    setForm({ nom: cat.nom, description: cat.description || "", icone: cat.icone || "", est_active: cat.est_active });
    setErreur("");
    setFormOuvert(true);
  };

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      if (enEdition) {
        await modifierCategorie(enEdition, form);
      } else {
        await creerCategorie(form);
      }
      setFormOuvert(false);
      charger();
    } catch {
      setErreur("Impossible d'enregistrer cette catégorie (nom déjà utilisé ?).");
    }
  };

  const basculerActivation = async (cat) => {
    await modifierCategorie(cat.id, { est_active: !cat.est_active });
    charger();
  };

  const supprimer = async (cat) => {
    if (!window.confirm(`Supprimer définitivement la catégorie "${cat.nom}" ?`)) return;
    await supprimerCategorie(cat.id);
    charger();
  };

  return (
    <div>
      <div className="admin-page-entete">
        <div>
          <h1>Catégories de métiers</h1>
          <p>Gérez les métiers proposés sur la plateforme (plomberie, électricité…).</p>
        </div>
        <button className="bouton bouton-primaire" onClick={ouvrirCreation}>
          <Plus size={16} /> Nouvelle catégorie
        </button>
      </div>

      <div className="carte table-carte">
        <div className="table-scroll">
          <table className="table-admin">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {chargement ? (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: 32 }}>Chargement…</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: 32 }}>Aucune catégorie.</td></tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.nom}</strong></td>
                    <td style={{ maxWidth: 320 }}>{c.description || "—"}</td>
                    <td>
                      <button
                        className={`etat-point ${c.est_active ? "actif" : ""}`}
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        onClick={() => basculerActivation(c)}
                      >
                        {c.est_active ? "Active" : "Désactivée"}
                      </button>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="bouton bouton-discret bouton-sm" onClick={() => ouvrirEdition(c)}>
                          <Pencil size={14} />
                        </button>
                        <button className="bouton bouton-discret bouton-sm" onClick={() => supprimer(c)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOuvert && (
        <div className="modale-fond" onClick={() => setFormOuvert(false)}>
          <div className="carte modale" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>{enEdition ? "Modifier la catégorie" : "Nouvelle catégorie"}</h3>
              <button
                onClick={() => setFormOuvert(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            {erreur && <div className="message-erreur">{erreur}</div>}

            <form onSubmit={soumettre}>
              <div className="champ">
                <label>Nom du métier</label>
                <input
                  required
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                />
              </div>
              <div className="champ">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="champ">
                <label>
                  <input
                    type="checkbox"
                    checked={form.est_active}
                    onChange={(e) => setForm({ ...form, est_active: e.target.checked })}
                    style={{ width: "auto", marginRight: 8 }}
                  />
                  Catégorie active (visible des clients)
                </label>
              </div>
              <button className="bouton bouton-primaire bouton-pleine-largeur">
                {enEdition ? "Enregistrer les modifications" : "Créer la catégorie"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
