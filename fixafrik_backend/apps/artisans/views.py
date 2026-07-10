from rest_framework import viewsets, generics, permissions, filters, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

from apps.users.permissions import IsArtisan, IsAdminRole, IsClient
from .models import ArtisanProfile, PhotoRealisation
from .serializers import (
    ArtisanProfileSerializer,
    ArtisanProfileCreateUpdateSerializer,
    ValidationArtisanSerializer,
    PhotoRealisationSerializer,
)


class ArtisanSearchViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Recherche d'artisans par métier et zone géographique.
    Réservée aux clients connectés (le cahier des charges précise que la
    recherche d'artisans est une fonctionnalité destinée aux clients).
    """

    serializer_class = ArtisanProfileSerializer
    permission_classes = [IsClient]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["categorie_principale", "zone_geographique", "badge_confiance", "est_premium"]
    search_fields = ["zone_geographique", "competences", "user__first_name", "user__last_name"]
    ordering_fields = ["note_moyenne", "date_creation"]

    def get_queryset(self):
        return ArtisanProfile.objects.filter(
            statut_validation=ArtisanProfile.StatutValidation.VALIDE
        ).select_related("user", "categorie_principale")


class MonProfilArtisanView(generics.RetrieveUpdateAPIView):
    """L'artisan connecté gère son propre profil."""

    permission_classes = [IsArtisan]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return ArtisanProfileCreateUpdateSerializer
        return ArtisanProfileSerializer

    def get_object(self):
        return get_object_or_404(ArtisanProfile, user=self.request.user)


class CreerProfilArtisanView(generics.CreateAPIView):
    """Création initiale du profil artisan après inscription."""

    serializer_class = ArtisanProfileCreateUpdateSerializer
    permission_classes = [IsArtisan]


class ValidationArtisanViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    """
    Endpoints réservés à l'administrateur pour consulter et valider/rejeter les artisans.
    La liste (GET /) accepte ?statut_validation=en_attente|valide|rejete pour les onglets
    de l'espace admin.
    """

    queryset = ArtisanProfile.objects.all().select_related("user", "categorie_principale")
    permission_classes = [IsAdminRole]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["statut_validation", "categorie_principale"]

    def get_serializer_class(self):
        if self.action in ("valider",):
            return ValidationArtisanSerializer
        return ArtisanProfileSerializer

    @action(detail=False, methods=["get"])
    def en_attente(self, request):
        profils = self.get_queryset().filter(
            statut_validation=ArtisanProfile.StatutValidation.EN_ATTENTE
        )
        serializer = ArtisanProfileSerializer(profils, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["patch"])
    def valider(self, request, pk=None):
        profil = self.get_object()
        serializer = self.get_serializer(profil, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        if profil.statut_validation == ArtisanProfile.StatutValidation.VALIDE:
            profil.user.est_verifie = True
            profil.user.save(update_fields=["est_verifie"])
        return Response(ArtisanProfileSerializer(profil).data)


class PhotoRealisationViewSet(viewsets.ModelViewSet):
    """Gestion des photos de réalisations (portfolio) par l'artisan."""

    serializer_class = PhotoRealisationSerializer
    permission_classes = [IsArtisan]

    def get_queryset(self):
        return PhotoRealisation.objects.filter(artisan__user=self.request.user)

    def perform_create(self, serializer):
        profil = ArtisanProfile.objects.get(user=self.request.user)
        serializer.save(artisan=profil)
