// Page d'accueil publique de FixAfrik.
// Structure : hero (texte + diaporama), grille de métiers, étapes,
// témoignages, puis appel à l'action pour les artisans.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, FileCheck2, Zap, Star, ArrowRight, Search,
  Wrench, Hammer, PaintBucket, Wind, Building2, Grid3x3, Trees, Sparkles,
} from "lucide-react";
import { listerCategories } from "../api/categories";
import HeroSlideshow from "../components/HeroSlideshow";
import "./Home.css";

// Associe un mot-clé du nom de catégorie à une icône lucide-react.
// Sert uniquement à l'affichage (fallback = icône générique Sparkles).
const ICONES_METIER = [
  { motsCles: ["plomb"], Icone: Wrench },
  { motsCles: ["electri", "électri"], Icone: Zap },
  { motsCles: ["menuis"], Icone: Hammer },
  { motsCles: ["peintur"], Icone: PaintBucket },
  { motsCles: ["clim"], Icone: Wind },
  { motsCles: ["maçon", "macon"], Icone: Building2 },
  { motsCles: ["carrel"], Icone: Grid3x3 },
  { motsCles: ["jardin"], Icone: Trees },
];

function iconePourMetier(nom = "") {
  const nomLower = nom.toLowerCase();
  const trouve = ICONES_METIER.find((m) => m.motsCles.some((mc) => nomLower.includes(mc)));
  return trouve ? trouve.Icone : Sparkles;
}

// Témoignages d'illustration (contenu d'exemple, à remplacer par de vrais
// avis une fois que la plateforme aura du volume).
const TEMOIGNAGES = [
  {
    nom: "Aïcha K.",
    zone: "Cliente à Cocody",
    note: 5,
    texte:
      "Fuite d'eau réparée le jour même. L'artisan était vérifié, sérieux, et le prix annoncé a été respecté.",
  },
  {
    nom: "Serge B.",
    zone: "Client à Yopougon",
    note: 5,
    texte:
      "J'ai publié ma demande le matin, un électricien certifié m'a contacté avant midi. Simple et rapide.",
  },
  {
    nom: "Marie-Ange T.",
    zone: "Cliente à Marcory",
    note: 4,
    texte:
      "Très bonne expérience pour refaire ma peinture. Le badge de confiance m'a rassurée avant même le premier contact.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Charge les catégories de métiers pour la grille juste sous le hero.
  useEffect(() => {
    listerCategories().then(({ data }) => setCategories((data.results || data).slice(0, 8)));
  }, []);

  return (
    <>
      {/* ---------- HERO (texte à gauche, diaporama à droite) ---------- */}
      <section className="hero">
        <div className="hero-colonne-texte">
          <p className="hero-eyebrow">
            <Sparkles size={14} /> Abidjan &amp; environs
          </p>
          <h1 className="hero-titre">
            Un artisan de confiance.
            <br />
            Le bon pro.
            <br />
            <span className="hero-souligne">Près de chez vous.</span>
          </h1>
          <p className="hero-sous-titre">
            Décrivez votre besoin, recevez la réponse d'artisans qualifiés et vérifiés
            près de chez vous. Simple, rapide, sans intermédiaire.
          </p>

          <div className="hero-badges">
            <span className="hero-badge">
              <ShieldCheck size={16} /> Artisans vérifiés et qualifiés
            </span>
            <span className="hero-badge">
              <FileCheck2 size={16} /> Demandes gratuites et sans engagement
            </span>
          </div>
          <div className="hero-badges">
            <span className="hero-badge">
              <Zap size={16} /> Rapide, simple et 100&nbsp;% gratuit
            </span>
            <span className="hero-badge">
              <Star size={16} /> Note moyenne de 4.8/5
            </span>
          </div>

          <div className="hero-cta-ligne">
            <button className="bouton bouton-primaire" onClick={() => navigate("/recherche")}>
              <Search size={16} /> Trouver un artisan
            </button>
            <a href="#comment-ca-marche" className="bouton bouton-discret">
              Comment ça marche
            </a>
          </div>
        </div>

        {/* Diaporama alimenté par le backend (voir espace admin > contenu) */}
        <div className="hero-colonne-image" aria-hidden="true">
          <HeroSlideshow />
        </div>
      </section>

      {/* ---------- MÉTIERS ---------- */}
      <section className="conteneur section-metiers">
        <div className="section-entete">
          <p className="etiquette-mono section-eyebrow">Métiers</p>
          <h2>Quel que soit votre besoin</h2>
        </div>
        <div className="metiers-grille">
          {(categories.length ? categories : Array.from({ length: 6 })).map((cat, i) => {
            const Icone = iconePourMetier(cat?.nom);
            return (
              <button
                key={cat?.id || i}
                className="metier-tuile"
                onClick={() =>
                  navigate(`/recherche?metier=${encodeURIComponent(cat?.nom || "")}`)
                }
              >
                <span className="icone-halo">
                  <Icone size={20} />
                </span>
                <span>{cat?.nom || "Métier"}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ---------- COMMENT ÇA MARCHE ---------- */}
      <section className="conteneur etapes" id="comment-ca-marche">
        <div className="section-entete">
          <p className="etiquette-mono section-eyebrow">Le processus</p>
          <h2>Comment ça marche</h2>
        </div>
        <div className="etapes-grille">
          <div className="etapes-ligne" aria-hidden="true" />
          <div className="etape">
            <span className="etape-numero">#01</span>
            <h3>Publiez votre besoin</h3>
            <p>Décrivez ce dont vous avez besoin et votre zone. C'est gratuit et rapide.</p>
          </div>
          <div className="etape">
            <span className="etape-numero">#02</span>
            <h3>Un artisan accepte</h3>
            <p>Un professionnel qualifié et vérifié de votre zone prend en charge la demande.</p>
          </div>
          <div className="etape">
            <span className="etape-numero">#03</span>
            <h3>Le travail est fait</h3>
            <p>Une fois la mission terminée, laissez une note pour aider la communauté.</p>
          </div>
        </div>
      </section>

      {/* ---------- TÉMOIGNAGES ---------- */}
      <section className="section-temoignages">
        <div className="conteneur">
          <div className="section-entete">
            <p className="etiquette-mono section-eyebrow">Ils ont utilisé FixAfrik</p>
            <h2>La confiance de nos clients</h2>
          </div>
          <div className="temoignages-grille">
            {TEMOIGNAGES.map((t) => (
              <div className="carte temoignage-carte" key={t.nom}>
                <div className="temoignage-etoiles">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < t.note ? "var(--ambre)" : "none"}
                      color="var(--ambre)"
                    />
                  ))}
                </div>
                <p>“{t.texte}”</p>
                <div className="temoignage-auteur">
                  <strong>{t.nom}</strong>
                  <span>{t.zone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ARTISAN ---------- */}
      <section className="conteneur artisan-cta">
        <div className="carte artisan-cta-carte">
          <div>
            <p className="etiquette-mono" style={{ color: "var(--ambre)" }}>Espace artisan</p>
            <h2>Vous êtes artisan ?</h2>
            <p>
              Rejoignez FixAfrik, faites-vous vérifier, et recevez des demandes de clients
              près de chez vous.
            </p>
          </div>
          <a href="/inscription" className="bouton bouton-blanc">
            Devenir artisan FixAfrik <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
