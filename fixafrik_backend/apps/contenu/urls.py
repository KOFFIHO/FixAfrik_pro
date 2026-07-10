from rest_framework.routers import DefaultRouter
from .views import ImageAccueilViewSet

router = DefaultRouter()
router.register("images-accueil", ImageAccueilViewSet, basename="image-accueil")

urlpatterns = router.urls
