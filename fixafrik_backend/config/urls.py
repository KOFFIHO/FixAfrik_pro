from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),

    # Authentification et utilisateurs
    path("api/auth/", include("apps.users.urls")),

    # Ressources métier
    path("api/categories/", include("apps.categories.urls")),
    path("api/artisans/", include("apps.artisans.urls")),
    path("api/demandes/", include("apps.demandes.urls")),
    path("api/avis/", include("apps.avis.urls")),

    # Tableau de bord administrateur
    path("api/dashboard/", include("apps.dashboard.urls")),

    # Contenu géré par l'admin (ex : images du diaporama d'accueil)
    path("api/contenu/", include("apps.contenu.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
