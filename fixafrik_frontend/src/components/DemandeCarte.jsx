import { MapPin, Wallet, Wrench, User, Users } from "lucide-react";
import Pastille from "./Pastille";
import "./DemandeCarte.css";

export default function DemandeCarte({ demande, actions }) {
  return (
    <div className="carte demande-carte">
      <div className="demande-carte-entete">
        <div>
          <h3>{demande.titre}</h3>
          <p className="demande-categorie">{demande.categorie?.nom}</p>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {demande.type_demande === "demande_devis" && (
            <span className="etiquette-mono demande-badge-devis">
              <Users size={11} /> Devis
            </span>
          )}
          <Pastille statut={demande.statut} />
        </div>
      </div>

      <p className="demande-description">{demande.description}</p>

      <div className="demande-infos">
        <span><MapPin size={14} /> {demande.zone_geographique}</span>
        {demande.budget_estime && <span><Wallet size={14} /> {demande.budget_estime} FCFA</span>}
        {demande.artisan && (
          <span>
            <Wrench size={14} /> {demande.artisan.user?.first_name} {demande.artisan.user?.last_name}
          </span>
        )}
        {demande.client && !demande.artisan && (
          <span>
            <User size={14} /> {demande.client.first_name} {demande.client.last_name}
          </span>
        )}
      </div>

      {actions && <div className="demande-actions">{actions}</div>}
    </div>
  );
}
