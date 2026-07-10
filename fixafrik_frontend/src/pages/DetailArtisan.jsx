import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ShieldCheck, Star, ArrowRight } from "lucide-react";
import { recupererArtisan } from "../api/artisans";
import { listerAvis } from "../api/avis";
import "./DetailArtisan.css";

export default function DetailArtisan() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [avis, setAvis] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const charger = async () => {
      try {
        const [resArtisan, resAvis] = await Promise.all([
          recupererArtisan(id),
          listerAvis(id),
        ]);
        setArtisan(resArtisan.data);
        setAvis(resAvis.data.results || resAvis.data);
      } catch {
        setErreur("Impossible de charger ce profil.");
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [id]);

  if (chargement) return <div className="conteneur" style={{ padding: 48 }}>Chargement…</div>;
  if (erreur) return <div className="conteneur" style={{ padding: 48 }}>{erreur}</div>;

  const nom =
    `${artisan.user.first_name || ""} ${artisan.user.last_name || ""}`.trim() ||
    artisan.user.username;

  return (
    <div className="conteneur detail-artisan">
      <div className="carte detail-entete">
        <div className="artisan-avatar detail-avatar">{nom.charAt(0).toUpperCase()}</div>
        <div>
          <h1>{nom}</h1>
          <p className="detail-metier">{artisan.categorie_principale?.nom}</p>
          <p className="detail-zone"><MapPin size={14} /> {artisan.zone_geographique}</p>
          <div className="detail-badges">
            {artisan.badge_confiance && (
              <span className="etiquette-mono detail-badge">
                <ShieldCheck size={13} /> Artisan certifié
              </span>
            )}
            <span className="detail-note">
              <Star size={14} fill="var(--ambre)" /> {Number(artisan.note_moyenne).toFixed(1)} ({artisan.nombre_avis} avis)
            </span>
          </div>
        </div>
        <Link
          to={`/nouvelle-demande?artisan=${artisan.id}&categorie=${artisan.categorie_principale?.id}`}
          className="bouton bouton-primaire"
        >
          Envoyer une demande <ArrowRight size={16} />
        </Link>
      </div>

      {artisan.description && (
        <div className="carte" style={{ marginTop: 20 }}>
          <h3>À propos</h3>
          <p>{artisan.description}</p>
          {artisan.competences && (
            <>
              <h3>Compétences</h3>
              <p>{artisan.competences}</p>
            </>
          )}
        </div>
      )}

      {artisan.photos?.length > 0 && (
        <div className="carte" style={{ marginTop: 20 }}>
          <h3>Réalisations</h3>
          <div className="detail-photos">
            {artisan.photos.map((p) => (
              <img key={p.id} src={p.image} alt={p.legende || "Réalisation"} />
            ))}
          </div>
        </div>
      )}

      <div className="carte" style={{ marginTop: 20 }}>
        <h3>Avis clients ({avis.length})</h3>
        {avis.length === 0 ? (
          <p>Aucun avis pour le moment.</p>
        ) : (
          <div className="detail-avis-liste">
            {avis.map((a) => (
              <div key={a.id} className="detail-avis">
                <div className="detail-avis-entete">
                  <strong>{a.client_nom || "Client FixAfrik"}</strong>
                  <span className="detail-note"><Star size={13} fill="var(--ambre)" /> {a.note}/5</span>
                </div>
                {a.commentaire && <p>{a.commentaire}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
