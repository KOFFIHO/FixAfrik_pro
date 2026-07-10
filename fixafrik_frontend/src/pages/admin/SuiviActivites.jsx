import { useEffect, useState } from "react";
import { ClipboardList, Star, ShieldCheck } from "lucide-react";
import { listerDemandes } from "../../api/demandes";
import { listerTousLesAvis } from "../../api/avis";
import { listerArtisansEnAttente } from "../../api/artisans";
import Pastille from "../../components/Pastille";
import "../AdminCommon.css";

function formaterDate(iso) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export default function SuiviActivites() {
  const [activite, setActivite] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      const [demandesRes, avisRes, artisansRes] = await Promise.all([
        listerDemandes(),
        listerTousLesAvis(),
        listerArtisansEnAttente(),
      ]);

      const demandes = (demandesRes.data.results || demandesRes.data).map((d) => ({
        type: "demande",
        date: d.date_creation,
        titre: `Nouvelle demande : ${d.titre}`,
        detail: `${d.categorie?.nom} · ${d.zone_geographique}`,
        statut: d.statut,
      }));

      const avis = (avisRes.data.results || avisRes.data).map((a) => ({
        type: "avis",
        date: a.date_creation,
        titre: `Avis laissé (${a.note}/5)`,
        detail: a.commentaire || "Sans commentaire",
      }));

      const artisans = (artisansRes.data.results || artisansRes.data).map((a) => ({
        type: "artisan",
        date: a.date_creation,
        titre: `Nouvel artisan en attente : ${a.user.first_name} ${a.user.last_name}`,
        detail: a.categorie_principale?.nom,
      }));

      const tout = [...demandes, ...avis, ...artisans].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setActivite(tout.slice(0, 40));
      setChargement(false);
    };
    charger();
  }, []);

  const icone = (type) => {
    if (type === "avis") return <Star size={16} />;
    if (type === "artisan") return <ShieldCheck size={16} />;
    return <ClipboardList size={16} />;
  };

  return (
    <div>
      <div className="admin-page-entete">
        <div>
          <h1>Suivi des activités</h1>
          <p>Derniers événements sur la plateforme : demandes, avis, nouveaux artisans.</p>
        </div>
      </div>

      <div className="carte">
        {chargement ? (
          <p>Chargement…</p>
        ) : activite.length === 0 ? (
          <p style={{ textAlign: "center", padding: 32 }}>Aucune activité récente.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {activite.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "16px 0",
                  borderTop: i === 0 ? "none" : "1px solid var(--ligne-douce)",
                }}
              >
                <span className="icone-halo" style={{ width: 36, height: 36 }}>
                  {icone(item.type)}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <strong style={{ fontSize: "0.92rem" }}>{item.titre}</strong>
                    {item.statut && <Pastille statut={item.statut} />}
                  </div>
                  <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem" }}>{item.detail}</p>
                </div>
                <span className="etiquette-mono" style={{ color: "var(--encre-douce)", whiteSpace: "nowrap" }}>
                  {formaterDate(item.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
