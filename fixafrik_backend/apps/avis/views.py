from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.users.permissions import IsClient, IsAdminRole
from .models import Avis
from .serializers import AvisSerializer, AvisCreateSerializer


class AvisViewSet(viewsets.ModelViewSet):
    """
    - Lecture publique des avis modérés (visibles sur le profil artisan).
    - Création réservée au client concerné.
    - Modération (masquer un avis) réservée à l'administrateur.
    """

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["artisan", "note"]

    def get_serializer_class(self):
        if self.action == "create":
            return AvisCreateSerializer
        return AvisSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsClient()]
        if self.action in ("moderer",):
            return [IsAdminRole()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.is_admin_role():
            return Avis.objects.all()
        return Avis.objects.filter(est_modere=True)

    @action(detail=True, methods=["patch"], permission_classes=[IsAdminRole])
    def moderer(self, request, pk=None):
        """Masquer/réafficher un avis jugé inapproprié."""
        avis = self.get_object()
        avis.est_modere = request.data.get("est_modere", not avis.est_modere)
        avis.save(update_fields=["est_modere"])
        return Response(AvisSerializer(avis).data)
