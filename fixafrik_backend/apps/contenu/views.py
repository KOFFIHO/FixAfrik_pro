from rest_framework import viewsets, permissions
from apps.users.permissions import IsAdminRole
from .models import ImageAccueil
from .serializers import ImageAccueilSerializer


class ImageAccueilViewSet(viewsets.ModelViewSet):
    """
    - Tout le monde (même visiteur) peut lister les images actives : elles
      alimentent le diaporama public de la page d'accueil.
    - Seul l'administrateur peut ajouter/modifier/supprimer des images
      (gestion des contenus, cf. cahier des charges).
    """

    serializer_class = ImageAccueilSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_admin_role():
            return ImageAccueil.objects.all()
        return ImageAccueil.objects.filter(est_active=True)

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsAdminRole()]
