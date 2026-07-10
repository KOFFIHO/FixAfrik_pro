from rest_framework.routers import DefaultRouter
from .views import DemandeViewSet, PropositionDevisViewSet

router = DefaultRouter()
# Enregistré avant le préfixe vide pour éviter toute ambiguïté de routage.
router.register("propositions-devis", PropositionDevisViewSet, basename="proposition-devis")
router.register("", DemandeViewSet, basename="demande")

urlpatterns = router.urls
