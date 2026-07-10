import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, CheckCircle2, Inbox } from "lucide-react";
import { listerDemandes, annulerDemande } from "../api/demandes";
import { laisserAvis } from "../api/avis";
import DemandeCarte from "../components/DemandeCarte";
import DevisRecus from "../components/DevisRecus";
import "./MesDemandes.css";

export default function MesDemandes() {
  const location = useLocation();
  const [demandes, setDemandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState(location.state?.message || "");
  const [avisOuvert, setAvisOuvert] = useState(null);
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");

  const charger = async () => {
    setChargement(true);
    const { data } = await listerDemandes();
    setDemandes(data.results || data);
    setChargement(false);
  };

  useEffect(() => {
    charger();
  }, []);

  const annuler = async (id) => {
    await annulerDemande(id);
    charger();
  };

  const soumettreAvis = async (demandeId) => {
    await laisserAvis({ demande: demandeId, note, commentaire });
    setAvisOuvert(null);
    setNote(5);
    setCommentaire("");
    setMessage("Merci pour votre avis !");
    charger();
  };

  return (
    <div className="conteneur mes-demandes">
      <div className="mes-demandes-entete">
        <h1>Mes demandes</h1>
        <Link to="/nouvelle-demande" className="bouton bouton-primaire">
          <Plus size={16} /> Nouvelle demande
        </Link>
      </div>

      {message && (
        <div className="message-succes">
          <CheckCircle2 size={16} /> {message}
        </div>
      )}

      {chargement ? (
        <p>Chargement…</p>
      ) : demandes.length === 0 ? (
        <div className="carte" style={{ textAlign: "center", padding: 48 }}>
          <Inbox size={32} style={{ margin: "0 auto 12px auto", color: "var(--encre-douce)" }} />
          <p>Vous n'avez pas encore publié de demande.</p>
          <Link to="/nouvelle-demande" className="bouton bouton-primaire">
            Publier ma première demande
          </Link>
        </div>
      ) : (
        demandes.map((d) => (
          <div key={d.id} style={{ marginBottom: 16 }}>
            <DemandeCarte
              demande={d}
              actions={
                <>
                  {d.statut === "en_attente" && (
                    <button className="bouton bouton-discret" onClick={() => annuler(d.id)}>
                      Annuler
                    </button>
                  )}
                  {d.statut === "terminee" && !d.avis && (
                    <button
                      className="bouton bouton-secondaire"
                      onClick={() => setAvisOuvert(d.id)}
                    >
                      Laisser un avis
                    </button>
                  )}
                </>
              }
            />
            {d.type_demande === "demande_devis" && d.statut === "en_attente" && (
              <div className="carte" style={{ marginTop: -8, borderTop: "none", borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                <p className="etiquette-mono" style={{ color: "var(--orange-dark)", fontWeight: 700 }}>
                  Devis reçus ({d.nombre_devis_recus || 0})
                </p>
                <DevisRecus demandeId={d.id} onAccepte={charger} />
              </div>
            )}
          </div>
        ))
      )}

      {avisOuvert && (
        <div className="modale-fond" onClick={() => setAvisOuvert(null)}>
          <div className="carte modale" onClick={(e) => e.stopPropagation()}>
            <h3>Laisser un avis</h3>
            <div className="champ">
              <label>Note</label>
              <select value={note} onChange={(e) => setNote(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} étoile{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="champ">
              <label>Commentaire (optionnel)</label>
              <textarea
                rows={4}
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
              />
            </div>
            <div className="demande-actions">
              <button
                className="bouton bouton-primaire"
                onClick={() => soumettreAvis(avisOuvert)}
              >
                Envoyer l'avis
              </button>
              <button className="bouton bouton-discret" onClick={() => setAvisOuvert(null)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
