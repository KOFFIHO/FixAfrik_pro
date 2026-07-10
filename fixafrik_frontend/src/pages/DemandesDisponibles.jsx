import { useEffect, useState } from "react";
import { Inbox, AlertCircle, Send, X } from "lucide-react";
import { listerDemandes, accepterDemande } from "../api/demandes";
import { envoyerPropositionDevis } from "../api/devis";
import DemandeCarte from "../components/DemandeCarte";

export default function DemandesDisponibles() {
  const [demandes, setDemandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  // Formulaire d'envoi de devis, ouvert pour une demande à la fois.
  const [devisOuvertPour, setDevisOuvertPour] = useState(null);
  const [montant, setMontant] = useState("");
  const [messageDevis, setMessageDevis] = useState("");
  const [envoiDevis, setEnvoiDevis] = useState(false);

  const charger = async () => {
    setChargement(true);
    const { data } = await listerDemandes({ statut: "en_attente" });
    setDemandes(data.results || data);
    setChargement(false);
  };

  useEffect(() => {
    charger();
  }, []);

  const accepter = async (id) => {
    setErreur("");
    try {
      await accepterDemande(id);
      charger();
    } catch (err) {
      setErreur(
        err.response?.data?.detail ||
          "Impossible d'accepter cette demande (elle vient peut-être d'être prise)."
      );
    }
  };

  const ouvrirFormulaireDevis = (demandeId) => {
    setDevisOuvertPour(demandeId);
    setMontant("");
    setMessageDevis("");
    setErreur("");
  };

  const envoyerDevis = async (e) => {
    e.preventDefault();
    setEnvoiDevis(true);
    setErreur("");
    try {
      await envoyerPropositionDevis({
        demande: devisOuvertPour,
        montant_propose: montant,
        message: messageDevis,
      });
      setDevisOuvertPour(null);
      charger();
    } catch (err) {
      setErreur("Impossible d'envoyer ce devis. Vérifiez le montant saisi.");
    } finally {
      setEnvoiDevis(false);
    }
  };

  return (
    <div className="conteneur" style={{ padding: "48px 24px 72px 24px", maxWidth: 760 }}>
      <p className="etiquette-mono" style={{ color: "var(--orange-dark)", fontWeight: 700, marginBottom: 8 }}>
        Espace artisan
      </p>
      <h1>Demandes disponibles</h1>
      <p>Demandes de clients correspondant à votre métier.</p>

      {erreur && (
        <div className="message-erreur">
          <AlertCircle size={16} /> {erreur}
        </div>
      )}

      {chargement ? (
        <p>Chargement…</p>
      ) : demandes.length === 0 ? (
        <div className="carte" style={{ textAlign: "center", padding: 48 }}>
          <Inbox size={32} style={{ margin: "0 auto 12px auto", color: "var(--encre-douce)" }} />
          <p>Aucune demande disponible pour le moment dans votre métier.</p>
        </div>
      ) : (
        demandes.map((d) => (
          <DemandeCarte
            key={d.id}
            demande={d}
            actions={
              d.type_demande === "demande_devis" ? (
                <button className="bouton bouton-primaire" onClick={() => ouvrirFormulaireDevis(d.id)}>
                  <Send size={15} /> Envoyer un devis
                </button>
              ) : (
                <button className="bouton bouton-primaire" onClick={() => accepter(d.id)}>
                  Accepter la demande
                </button>
              )
            }
          />
        ))
      )}

      {devisOuvertPour && (
        <div className="modale-fond" onClick={() => setDevisOuvertPour(null)}>
          <div className="carte modale" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Envoyer un devis</h3>
              <button
                onClick={() => setDevisOuvertPour(null)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={envoyerDevis}>
              <div className="champ">
                <label>Montant proposé (FCFA)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  placeholder="ex : 25000"
                />
              </div>
              <div className="champ">
                <label>Message (délai, matériel inclus…)</label>
                <textarea
                  rows={3}
                  value={messageDevis}
                  onChange={(e) => setMessageDevis(e.target.value)}
                  placeholder="ex : Disponible dès demain, pièces comprises."
                />
              </div>
              <button className="bouton bouton-primaire bouton-pleine-largeur" disabled={envoiDevis}>
                {envoiDevis ? "Envoi…" : "Envoyer mon devis"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
