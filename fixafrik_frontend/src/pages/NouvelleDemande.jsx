import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClipboardPlus, AlertCircle, Send, Users } from "lucide-react";
import { listerCategories } from "../api/categories";
import { creerDemande } from "../api/demandes";
import "./NouvelleDemande.css";

export default function NouvelleDemande() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  // Si l'utilisateur arrive via "Demander un devis" dans la navigation,
  // le type "demande_devis" est présélectionné (voir Navbar / MesDemandes).
  const typeInitial = searchParams.get("devis") ? "demande_devis" : "mission_directe";

  const [form, setForm] = useState({
    categorie: searchParams.get("categorie") || "",
    type_demande: typeInitial,
    titre: "",
    description: "",
    zone_geographique: "",
    budget_estime: "",
  });

  useEffect(() => {
    listerCategories().then(({ data }) => setCategories(data.results || data));
  }, []);

  const majChamp = (champ, valeur) => setForm({ ...form, [champ]: valeur });

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      const payload = { ...form, budget_estime: form.budget_estime || null };
      await creerDemande(payload);
      const message =
        form.type_demande === "demande_devis"
          ? "Votre demande de devis a été publiée. Les artisans vont pouvoir vous proposer un prix."
          : "Votre demande a été publiée.";
      navigate("/mes-demandes", { state: { message } });
    } catch (err) {
      setErreur("Impossible de publier la demande. Vérifiez les champs et réessayez.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="conteneur nouvelle-demande">
      <p className="etiquette-mono nouvelle-demande-eyebrow"><ClipboardPlus size={14} /> Nouvelle demande</p>
      <h1>Publier une demande</h1>
      <p>Choisissez le mode qui vous convient, puis décrivez votre besoin.</p>

      {erreur && (
        <div className="message-erreur">
          <AlertCircle size={16} /> {erreur}
        </div>
      )}

      <form className="carte" onSubmit={soumettre}>
        {/* Choix du mode : mission directe ou demande de devis */}
        <div className="type-demande-choix">
          <button
            type="button"
            className={`type-demande-carte ${form.type_demande === "mission_directe" ? "actif" : ""}`}
            onClick={() => majChamp("type_demande", "mission_directe")}
          >
            <Send size={18} />
            <div>
              <strong>Mission directe</strong>
              <span>Le premier artisan disponible accepte votre demande.</span>
            </div>
          </button>
          <button
            type="button"
            className={`type-demande-carte ${form.type_demande === "demande_devis" ? "actif" : ""}`}
            onClick={() => majChamp("type_demande", "demande_devis")}
          >
            <Users size={18} />
            <div>
              <strong>Demande de devis</strong>
              <span>Plusieurs artisans vous proposent un prix, vous choisissez.</span>
            </div>
          </button>
        </div>

        <div className="champ">
          <label htmlFor="categorie">Métier recherché</label>
          <select
            id="categorie"
            required
            value={form.categorie}
            onChange={(e) => majChamp("categorie", e.target.value)}
          >
            <option value="">Choisir un métier…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="champ">
          <label htmlFor="titre">Titre de la demande</label>
          <input
            id="titre"
            required
            placeholder="ex : Fuite d'eau sous l'évier"
            value={form.titre}
            onChange={(e) => majChamp("titre", e.target.value)}
          />
        </div>

        <div className="champ">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            required
            rows={5}
            placeholder="Décrivez le problème ou le travail à réaliser…"
            value={form.description}
            onChange={(e) => majChamp("description", e.target.value)}
          />
        </div>

        <div className="champ">
          <label htmlFor="zone">Zone géographique</label>
          <input
            id="zone"
            required
            placeholder="ex : Cocody, Rue des Jardins"
            value={form.zone_geographique}
            onChange={(e) => majChamp("zone_geographique", e.target.value)}
          />
        </div>

        <div className="champ">
          <label htmlFor="budget">Budget estimé (FCFA, optionnel)</label>
          <input
            id="budget"
            type="number"
            min="0"
            placeholder="ex : 15000"
            value={form.budget_estime}
            onChange={(e) => majChamp("budget_estime", e.target.value)}
          />
        </div>

        <button className="bouton bouton-primaire bouton-pleine-largeur" disabled={envoi}>
          {envoi
            ? "Publication…"
            : form.type_demande === "demande_devis"
            ? "Publier ma demande de devis"
            : "Publier la demande"}
        </button>
      </form>
    </div>
  );
}
