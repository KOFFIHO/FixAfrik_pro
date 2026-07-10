import { Link } from "react-router-dom";
import { MapPin, ShieldCheck, Star, Sparkles } from "lucide-react";
import "./ArtisanCarte.css";

export default function ArtisanCarte({ artisan }) {
  const nom =
    `${artisan.user.first_name || ""} ${artisan.user.last_name || ""}`.trim() ||
    artisan.user.username;

  return (
    <Link to={`/artisans/${artisan.id}`} className="artisan-carte">
      <div className="artisan-carte-entete">
        <div className="artisan-avatar">{nom.charAt(0).toUpperCase()}</div>
        <div>
          <h3>{nom}</h3>
          <p className="artisan-metier">{artisan.categorie_principale?.nom}</p>
        </div>
        {artisan.badge_confiance && (
          <span className="etiquette-mono artisan-badge">
            <ShieldCheck size={12} /> Certifié
          </span>
        )}
      </div>

      <p className="artisan-zone"><MapPin size={14} /> {artisan.zone_geographique}</p>

      {artisan.description && (
        <p className="artisan-description">{artisan.description}</p>
      )}

      <div className="artisan-pied">
        <span className="artisan-note">
          <Star size={14} fill="var(--ambre)" /> {Number(artisan.note_moyenne).toFixed(1)}{" "}
          <span className="artisan-note-total">({artisan.nombre_avis} avis)</span>
        </span>
        {artisan.est_premium && (
          <span className="etiquette-mono artisan-premium">
            <Sparkles size={12} /> Premium
          </span>
        )}
      </div>
    </Link>
  );
}
