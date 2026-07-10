import { useEffect, useState } from "react";
import { Star, EyeOff, Eye } from "lucide-react";
import { listerTousLesAvis, modererAvis } from "../../api/avis";
import "../AdminCommon.css";

export default function ModerationAvis() {
  const [avis, setAvis] = useState([]);
  const [chargement, setChargement] = useState(true);

  const charger = async () => {
    setChargement(true);
    const { data } = await listerTousLesAvis();
    setAvis(data.results || data);
    setChargement(false);
  };

  useEffect(() => {
    charger();
  }, []);

  const basculerModeration = async (a) => {
    await modererAvis(a.id, !a.est_modere);
    charger();
  };

  return (
    <div>
      <div className="admin-page-entete">
        <div>
          <h1>Modération des avis</h1>
          <p>Masquez les avis inappropriés. Les avis masqués restent invisibles pour les clients.</p>
        </div>
      </div>

      {chargement ? (
        <p>Chargement…</p>
      ) : avis.length === 0 ? (
        <div className="carte admin-etat-vide">
          <p>Aucun avis pour le moment.</p>
        </div>
      ) : (
        avis.map((a) => (
          <div key={a.id} className="carte" style={{ marginBottom: 14, opacity: a.est_modere ? 1 : 0.6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <strong>{a.client_nom || "Client FixAfrik"}</strong>
                  <span style={{ display: "flex", color: "var(--ambre)" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < a.note ? "var(--ambre)" : "none"} />
                    ))}
                  </span>
                  {!a.est_modere && (
                    <span className="etiquette-mono" style={{ color: "var(--danger)" }}>Masqué</span>
                  )}
                </div>
                {a.commentaire && <p style={{ margin: 0 }}>{a.commentaire}</p>}
              </div>
              <button
                className="bouton bouton-discret bouton-sm"
                style={{ alignSelf: "flex-start" }}
                onClick={() => basculerModeration(a)}
              >
                {a.est_modere ? <><EyeOff size={14} /> Masquer</> : <><Eye size={14} /> Réafficher</>}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
