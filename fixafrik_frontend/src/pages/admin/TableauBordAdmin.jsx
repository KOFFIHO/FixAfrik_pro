import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, ShieldCheck, ClipboardList, Star, ArrowRight } from "lucide-react";
import client from "../../api/client";
import "../AdminCommon.css";

export default function TableauBordAdmin() {
  const [stats, setStats] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    client.get("/dashboard/statistiques/").then(({ data }) => {
      setStats(data);
      setChargement(false);
    });
  }, []);

  if (chargement) return <p>Chargement…</p>;

  return (
    <div>
      <div className="admin-page-entete">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble de l'activité de la plateforme FixAfrik.</p>
        </div>
      </div>

      <div className="stats-grille">
        <div className="carte stat-carte">
          <span className="icone-halo"><Users size={20} /></span>
          <div className="stat-carte-texte">
            <span>Utilisateurs</span>
            <strong>{stats.utilisateurs.total}</strong>
            <p className="detail">
              {stats.utilisateurs.clients} clients · {stats.utilisateurs.artisans} artisans
            </p>
          </div>
        </div>

        <div className="carte stat-carte">
          <span className="icone-halo icone-halo-orange"><ShieldCheck size={20} /></span>
          <div className="stat-carte-texte">
            <span>Artisans validés</span>
            <strong>{stats.artisans.valides}</strong>
            <p className="detail">{stats.artisans.en_attente} en attente de validation</p>
          </div>
        </div>

        <div className="carte stat-carte">
          <span className="icone-halo"><ClipboardList size={20} /></span>
          <div className="stat-carte-texte">
            <span>Demandes</span>
            <strong>{stats.demandes.total}</strong>
            <p className="detail">
              {stats.demandes.en_cours} en cours · {stats.demandes.terminees} terminées
            </p>
          </div>
        </div>

        <div className="carte stat-carte">
          <span className="icone-halo icone-halo-orange"><Star size={20} /></span>
          <div className="stat-carte-texte">
            <span>Avis</span>
            <strong>{stats.avis.total}</strong>
            <p className="detail">
              Note moyenne : {Number(stats.avis.note_moyenne_plateforme).toFixed(1)}/5
            </p>
          </div>
        </div>
      </div>

      <div className="carte" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {stats.artisans.en_attente > 0 && (
          <Link to="/admin/artisans" className="bouton bouton-secondaire">
            {stats.artisans.en_attente} artisan(s) à valider <ArrowRight size={16} />
          </Link>
        )}
        <Link to="/admin/utilisateurs" className="bouton bouton-discret">
          Gérer les utilisateurs <ArrowRight size={16} />
        </Link>
        <Link to="/admin/categories" className="bouton bouton-discret">
          Gérer les catégories <ArrowRight size={16} />
        </Link>
        <Link to="/admin/avis" className="bouton bouton-discret">
          Modérer les avis <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
