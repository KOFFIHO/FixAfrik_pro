import { useEffect, useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { listerPropositionsDevis, accepterPropositionDevis } from "../api/devis";
import "./DevisRecus.css";

/**
 * Liste des devis reçus par le client pour une demande donnée
 * (uniquement pertinent pour les demandes de type "demande_devis").
 */
export default function DevisRecus({ demandeId, onAccepte }) {
  const [propositions, setPropositions] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [enCours, setEnCours] = useState(null);

  const charger = async () => {
    setChargement(true);
    const { data } = await listerPropositionsDevis(demandeId);
    setPropositions(data.results || data);
    setChargement(false);
  };

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demandeId]);

  const accepter = async (propositionId) => {
    setEnCours(propositionId);
    try {
      await accepterPropositionDevis(propositionId);
      onAccepte && onAccepte();
    } finally {
      setEnCours(null);
    }
  };

  if (chargement) return <p className="devis-recus-chargement">Chargement des devis…</p>;

  if (propositions.length === 0) {
    return <p className="devis-recus-vide">Aucun devis reçu pour le moment.</p>;
  }

  return (
    <div className="devis-recus-liste">
      {propositions.map((p) => {
        const nomArtisan =
          `${p.artisan.user.first_name || ""} ${p.artisan.user.last_name || ""}`.trim() ||
          p.artisan.user.username;
        return (
          <div className="devis-recu-carte" key={p.id}>
            <div className="devis-recu-entete">
              <div>
                <strong>{nomArtisan}</strong>
                <span className="devis-recu-note">
                  <Star size={13} fill="var(--ambre)" color="var(--ambre)" />{" "}
                  {Number(p.artisan.note_moyenne).toFixed(1)}
                </span>
              </div>
              <span className="devis-recu-montant">{p.montant_propose} FCFA</span>
            </div>
            {p.message && <p className="devis-recu-message">{p.message}</p>}
            <button
              className="bouton bouton-secondaire bouton-sm"
              disabled={enCours === p.id}
              onClick={() => accepter(p.id)}
            >
              <CheckCircle2 size={14} /> {enCours === p.id ? "Acceptation…" : "Accepter ce devis"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
