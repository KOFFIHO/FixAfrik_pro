# FixAfrik — Backend (Django + DRF + PostgreSQL)

Backend de la plateforme **FixAfrik**, basé sur le cahier des charges :
mise en relation clients ↔ artisans à Abidjan (Côte d'Ivoire).

## Stack technique
- Django 5 + Django REST Framework
- PostgreSQL
- Authentification par JWT (SimpleJWT)
- django-cors-headers (pour le frontend React)

## Structure du projet
```
fixafrik_backend/
├── config/                 # Réglages Django, urls.py, wsgi/asgi
├── apps/
│   ├── users/               # Comptes, rôles (client/artisan/admin), JWT
│   ├── categories/          # Catégories de métiers (plombier, électricien...)
│   ├── artisans/            # Profils artisans, vérification, badge, premium
│   ├── demandes/             # Demandes clients → missions
│   ├── avis/                 # Notes et avis, modération
│   ├── dashboard/            # Statistiques admin
│   └── contenu/              # Images du diaporama d'accueil (gérées par l'admin)
├── manage.py
├── requirements.txt
└── .env.example
```

## Installation

```bash
# 1. Créer un environnement virtuel
python -m venv venv
source venv/bin/activate      # Windows : venv\Scripts\activate

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Configurer la base de données
cp .env.example .env
# Modifier .env avec vos identifiants PostgreSQL

# 4. Créer la base PostgreSQL
createdb fixafrik_db

# 5. Appliquer les migrations
python manage.py makemigrations
python manage.py migrate

# 6. Créer un super-administrateur
python manage.py createsuperuser

# 7. Lancer le serveur
python manage.py runserver
```

L'API est alors disponible sur `http://localhost:8000/api/`
et l'admin Django sur `http://localhost:8000/admin/`.

## Principaux endpoints

### Authentification (`/api/auth/`)
| Méthode | URL | Description |
|---|---|---|
| POST | `/register/` | Inscription (client ou artisan) |
| POST | `/login/` | Connexion → renvoie `access` + `refresh` |
| POST | `/login/refresh/` | Rafraîchir le token |
| GET/PATCH | `/me/` | Consulter/modifier son profil |
| POST | `/me/change-password/` | Changer son mot de passe |

### Catégories (`/api/categories/`)
- `GET /` : liste publique des métiers
- `POST/PUT/DELETE` : réservé à l'admin

### Artisans (`/api/artisans/`)
| Méthode | URL | Description |
|---|---|---|
| GET | `/recherche/?categorie_principale=&zone_geographique=&search=` | Recherche publique |
| POST | `/creer-profil/` | Créer son profil (artisan connecté) |
| GET/PATCH | `/mon-profil/` | Gérer son propre profil |
| GET | `/validation/en_attente/` | Artisans à valider (admin) |
| PATCH | `/validation/{id}/valider/` | Valider/rejeter un artisan (admin) |
| POST | `/photos/` | Ajouter une photo de réalisation |

### Demandes (`/api/demandes/`)
| Méthode | URL | Description |
|---|---|---|
| POST | `/` | Créer une demande (client) |
| GET | `/` | Lister ses demandes (client) / demandes disponibles (artisan) |
| POST | `/{id}/accepter/` | L'artisan accepte la demande |
| POST | `/{id}/demarrer/` | Démarrer la mission |
| POST | `/{id}/terminer/` | Terminer la mission |
| POST | `/{id}/annuler/` | Annuler (client) |

### Avis (`/api/avis/`)
| Méthode | URL | Description |
|---|---|---|
| GET | `/?artisan={id}` | Avis publics d'un artisan |
| POST | `/` | Laisser un avis (client, mission terminée) |
| PATCH | `/{id}/moderer/` | Masquer/réafficher un avis (admin) |

### Tableau de bord (`/api/dashboard/`)
- `GET /statistiques/` : vue d'ensemble (utilisateurs, artisans, demandes, avis) — admin uniquement

### Contenu (`/api/contenu/`)
| Méthode | URL | Description |
|---|---|---|
| GET | `/images-accueil/` | Liste publique des images actives (diaporama d'accueil) |
| POST | `/images-accueil/` | Ajouter une image (admin, upload multipart) |
| PATCH/DELETE | `/images-accueil/{id}/` | Modifier/supprimer une image (admin) |

## Notes sur le cahier des charges
- Les rôles **Client / Artisan / Administrateur** sont gérés par un seul modèle `User` avec un champ `role`.
- La **vérification des artisans** (numéro, identité, métier) passe par `ArtisanProfile.statut_validation`, validée par l'admin.
- Le **badge de confiance** et l'**abonnement premium** (fonctionnalités avancées optionnelles) sont déjà prévus dans le modèle `ArtisanProfile`, prêts à être branchés sur un système de paiement mobile plus tard (Orange Money, MTN Money, Wave).
- La **géolocalisation** est préparée via les champs `latitude`/`longitude`.
- Le projet est pensé pour rester **léger et performant** (pagination, requêtes optimisées avec `select_related`) pour s'adapter au contexte de connexion internet variable en Côte d'Ivoire.

## Prochaine étape
Une fois ce backend testé et validé, le frontend React (site web responsive) pourra être développé pour consommer cette API.
