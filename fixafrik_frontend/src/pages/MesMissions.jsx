import { useEffect, useState } from "react";
import { Hammer } from "lucide-react";
import { listerDemandes, demarrerDemande, terminerDemande } from "../api/demandes";
import DemandeCarte from "../components/DemandeCarte";

export default function MesMissions() {
  const [missions, setMissions] = useState([]);
  const [chargement, setChargement] = useState(true);

  const charger = async () => {
    setChargement(true);
    const { data } = await listerDemandes();
    const toutes = data.results || data;
    setMissions(toutes.filter((d) => d.statut !== "en_attente"));
    setChargement(false);
  };

  useEffect(() => {
    charger();
  }, []);

  const demarrer = async (id) => {
    await demarrerDemande(id);
    charger();
  };

  const terminer = async (id) => {
    await terminerDemande(id);
    charger();
  };

  return (
    <div className="conteneur" style={{ padding: "48px 24px 72px 24px", maxWidth: 760 }}>
      <h1>Mes missions</h1>
      <p>Suivi des demandes que vous avez acceptées.</p>

      {chargement ? (
        <p>Chargement…</p>
      ) : missions.length === 0 ? (
        <div className="carte" style={{ textAlign: "center", padding: 48 }}>
          <Hammer size={32} style={{ margin: "0 auto 12px auto", color: "var(--encre-douce)" }} />
          <p>Vous n'avez encore accepté aucune mission.</p>
        </div>
      ) : (
        missions.map((d) => (
          <DemandeCarte
            key={d.id}
            demande={d}
            actions={
              <>
                {d.statut === "acceptee" && (
                  <button className="bouton bouton-primaire" onClick={() => demarrer(d.id)}>
                    Démarrer la mission
                  </button>
                )}
                {d.statut === "en_cours" && (
                  <button className="bouton bouton-secondaire" onClick={() => terminer(d.id)}>
                    Marquer comme terminée
                  </button>
                )}
              </>
            }
          />
        ))
      )}
    </div>
  );
}
