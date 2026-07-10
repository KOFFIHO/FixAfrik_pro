from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ArtisanSearchViewSet,
    MonProfilArtisanView,
    CreerProfilArtisanView,
    ValidationArtisanViewSet,
    PhotoRealisationViewSet,
)

router = DefaultRouter()
router.register("recherche", ArtisanSearchViewSet, basename="artisan-recherche")
router.register("validation", ValidationArtisanViewSet, basename="artisan-validation")
router.register("photos", PhotoRealisationViewSet, basename="artisan-photos")

urlpatterns = [
    path("mon-profil/", MonProfilArtisanView.as_view(), name="mon-profil-artisan"),
    path("creer-profil/", CreerProfilArtisanView.as_view(), name="creer-profil-artisan"),
] + router.urls
