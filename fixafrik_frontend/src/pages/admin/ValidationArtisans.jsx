import { useEffect, useState } from "react";
import { MapPin, Phone, FileText } from "lucide-react";
import client from "../../api/client";
import { listerArtisansEnAttente, validerArtisan } from "../../api/artisans";
import Pastille from "../../components/Pastille";
import "../AdminCommon.css";

const ONGLETS = [
  { valeur: "en_attente", label: "En attente" },
  { valeur: "valide", label: "Validés" },
  { valeur: "rejete", label: "Rejetés" },
];

export default function ValidationArtisans() {
  const [onglet, setOnglet] = useState("en_attente");
  const [artisans, setArtisans] = useState([]);
  const [chargement, setChargement] = useState(true);

  const charger = async () => {
    setChargement(true);
    if (onglet === "en_attente") {
      const { data } = await listerArtisansEnAttente();
      setArtisans(data.results || data);
    } else {
      const { data } = await client.get("/artisans/validation/", {
        params: { statut_validation: onglet },
      });
      setArtisans(data.results || data);
    }
    setChargement(false);
  };

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onglet]);

  const traiter = async (id, statut_validation) => {
    await validerArtisan(id, { statut_validation });
    charger();
  };

  return (
    <div>
      <div className="admin-page-entete">
        <div>
          <h1>Validation des artisans</h1>
          <p>Vérifiez l'identité et le métier des artisans avant leur mise en ligne.</p>
        </div>
      </div>

      <div className="onglet-barre">
        {ONGLETS.map((o) => (
          <button
            key={o.valeur}
            className={`onglet ${onglet === o.valeur ? "actif" : ""}`}
            onClick={() => setOnglet(o.valeur)}
          >
            {o.label}
          </button>
        ))}
      </div>

      {chargement ? (
        <p>Chargement…</p>
      ) : artisans.length === 0 ? (
        <div className="carte admin-etat-vide">
          <p>Aucun artisan dans cette catégorie.</p>
        </div>
      ) : (
        artisans.map((a) => (
          <div key={a.id} className="carte" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <strong style={{ fontSize: "1.05rem" }}>
                    {a.user.first_name} {a.user.last_name}
                  </strong>
                  <Pastille statut={a.statut_validation} />
                </div>
                <p style={{ margin: "2px 0", color: "var(--orange-dark)", fontWeight: 600 }}>
                  {a.categorie_principale?.nom}
                </p>
                <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontSize: "0.85rem", color: "var(--encre-attenue)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <MapPin size={14} /> {a.zone_geographique}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Phone size={14} /> {a.user.phone_number}
                  </span>
                  {(a.piece_identite || a.justificatif_metier) && (
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <FileText size={14} /> Documents fournis
                    </span>
                  )}
                </div>
                {a.description && <p style={{ marginTop: 10 }}>{a.description}</p>}
              </div>

              {onglet === "en_attente" && (
                <div className="demande-actions" style={{ alignSelf: "flex-start" }}>
                  <button className="bouton bouton-secondaire" onClick={() => traiter(a.id, "valide")}>
                    Valider
                  </button>
                  <button className="bouton bouton-discret" onClick={() => traiter(a.id, "rejete")}>
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
