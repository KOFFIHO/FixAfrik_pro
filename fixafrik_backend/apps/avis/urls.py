from rest_framework.routers import DefaultRouter
from .views import AvisViewSet

router = DefaultRouter()
router.register("", AvisViewSet, basename="avis")

urlpatterns = router.urls
