# FixAfrik — Frontend (React + Vite)

Site web responsive de la plateforme FixAfrik, connecté au backend Django/PostgreSQL.

## Identité visuelle
- **Vert profond** `#0E5C3E` — confiance, savoir-faire
- **Orange** `#E8622C` — énergie, chaleur
- **Sable** `#FBF6EE` — fond chaleureux et neutre
- Typo : **Fraunces** (titres), **Inter** (interface), **Space Mono** (badges/statuts)
- Icônes : **lucide-react**
- Landing page inspirée des codes du secteur "devis travaux" : hero avec
  mini-formulaire de recherche, bandeau de confiance chiffré, grille de
  métiers avec icônes, étapes reliées visuellement, témoignages clients
- Menu mobile en "hamburger" (trois traits), façon lesartisanspros.fr
- Diaporama d'images sur la page d'accueil, entièrement géré depuis
  l'espace admin (aucune image codée en dur côté frontend)

## Installation

```bash
npm install
cp .env.example .env
# Modifier .env si votre backend Django ne tourne pas sur localhost:8000

npm run dev
```

Le site est alors disponible sur `http://localhost:3000`.

⚠️ Le backend Django doit être lancé (`python manage.py runserver`) et
`django-cors-headers` doit autoriser `http://localhost:3000` (déjà configuré
par défaut dans le backend fourni). Le backend a été complété avec un
endpoint `/api/auth/admin/utilisateurs/` nécessaire à l'espace admin
ci-dessous : pense à récupérer la dernière version du zip backend.

## Structure

```
src/
├── api/            # Appels à l'API Django (axios + gestion JWT)
├── context/        # AuthContext : utilisateur connecté, connexion/déconnexion
├── components/     # Navbar, Footer, cartes, pastilles, AdminLayout (sidebar)
├── pages/          # Une page par écran (accueil, connexion, recherche...)
│   └── admin/      # Pages de l'espace administrateur
├── styles/         # tokens.css : palette, typo, composants de base
├── App.jsx         # Toutes les routes de l'application
└── main.jsx        # Point d'entrée
```

## Parcours utilisateurs

- **Visiteur** : accueil (landing premium), inscription, connexion.
- **Client** : recherche d'artisans par métier/zone, publication de demandes,
  suivi de ses demandes, avis après une mission terminée.
- **Artisan** : création/édition de son profil (en attente de validation),
  consultation des demandes disponibles dans son métier, gestion de ses
  missions (démarrer, terminer).
- **Administrateur** — espace dédié avec sidebar (`/admin`), conforme au
  cahier des charges :
  - **Tableau de bord** : statistiques globales (utilisateurs, artisans,
    demandes, avis) avec accès rapide aux actions en attente
  - **Gestion des utilisateurs** : liste, recherche, filtre par rôle,
    activation/suspension de comptes
  - **Validation des artisans** : onglets en attente / validés / rejetés,
    consultation des documents fournis
  - **Gestion des catégories de métiers** : création, modification,
    activation/désactivation, suppression
  - **Images d'accueil** : ajout/suppression des images du diaporama
    affiché sur la page d'accueil (défilement automatique toutes les 20s)
  - **Modération des avis** : masquer/réafficher un avis inapproprié
  - **Suivi des activités** : fil chronologique des demandes, avis et
    nouveaux artisans sur la plateforme

## Prochaines étapes possibles
- Géolocalisation (carte interactive) pour affiner la recherche par zone
- Paiement mobile (Orange Money, MTN Money, Wave) au moment de la mission
- Chat intégré entre client et artisan
- Notifications push
- Build de production : `npm run build` (dossier `dist/` à déployer)

