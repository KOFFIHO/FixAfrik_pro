from django.utils import timezone
from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from apps.users.permissions import IsClient, IsArtisan, IsAdminRole
from apps.artisans.models import ArtisanProfile
from .models import Demande, PropositionDevis
from .serializers import (
    DemandeSerializer,
    DemandeCreateSerializer,
    DemandeStatutSerializer,
    PropositionDevisSerializer,
    PropositionDevisCreateSerializer,
)


class DemandeViewSet(viewsets.ModelViewSet):
    """
    - Un client crée des demandes et voit uniquement les siennes.
    - Un artisan voit les demandes disponibles dans sa catégorie/zone, et ses missions en cours.
    - Un administrateur voit tout (modération / suivi des activités).
    """

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["statut", "categorie", "zone_geographique"]
    search_fields = ["titre", "description", "zone_geographique"]
    ordering_fields = ["date_creation", "budget_estime"]

    def get_serializer_class(self):
        if self.action == "create":
            return DemandeCreateSerializer
        return DemandeSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsClient()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin_role():
            return Demande.objects.all()
        if user.is_client():
            return Demande.objects.filter(client=user)
        if user.is_artisan():
            profil = ArtisanProfile.objects.filter(user=user).first()
            if not profil:
                return Demande.objects.none()
            return Demande.objects.filter(
                Q(artisan=profil) |
                Q(statut=Demande.Statut.EN_ATTENTE, categorie=profil.categorie_principale)
            )
        return Demande.objects.none()

    @action(detail=True, methods=["post"], permission_classes=[IsArtisan])
    def accepter(self, request, pk=None):
        """L'artisan connecté accepte la demande (mission directe uniquement)."""
        demande = self.get_object()
        if demande.statut != Demande.Statut.EN_ATTENTE:
            return Response({"detail": "Cette demande n'est plus disponible."}, status=status.HTTP_400_BAD_REQUEST)

        if demande.type_demande == Demande.TypeDemande.DEMANDE_DEVIS:
            return Response(
                {"detail": "Cette demande attend des devis : utilisez plutôt 'Envoyer un devis'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profil = ArtisanProfile.objects.filter(user=request.user).first()
        if not profil or profil.statut_validation != ArtisanProfile.StatutValidation.VALIDE:
            return Response(
                {"detail": "Votre profil artisan doit être validé pour accepter des demandes."},
                status=status.HTTP_403_FORBIDDEN,
            )

        demande.artisan = profil
        demande.statut = Demande.Statut.ACCEPTEE
        demande.date_acceptation = timezone.now()
        demande.save()
        return Response(DemandeSerializer(demande).data)

    @action(detail=True, methods=["post"], permission_classes=[IsArtisan])
    def demarrer(self, request, pk=None):
        demande = self.get_object()
        demande.statut = Demande.Statut.EN_COURS
        demande.save(update_fields=["statut"])
        return Response(DemandeSerializer(demande).data)

    @action(detail=True, methods=["post"])
    def terminer(self, request, pk=None):
        """Peut être confirmé par le client ou l'artisan concerné."""
        demande = self.get_object()
        demande.statut = Demande.Statut.TERMINEE
        demande.date_fin = timezone.now()
        demande.save()
        return Response(DemandeSerializer(demande).data)

    @action(detail=True, methods=["post"], permission_classes=[IsClient])
    def annuler(self, request, pk=None):
        demande = self.get_object()
        demande.statut = Demande.Statut.ANNULEE
        demande.save(update_fields=["statut"])
        return Response(DemandeSerializer(demande).data)


class PropositionDevisViewSet(viewsets.ModelViewSet):
    """
    Gestion des devis envoyés par les artisans en réponse à une demande de
    type 'demande_devis' :
    - Le client voit les devis reçus pour ses propres demandes.
    - L'artisan voit les devis qu'il a lui-même envoyés.
    - Seul le client concerné peut accepter un devis.
    """

    http_method_names = ["get", "post", "head", "options"]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["demande"]

    def get_serializer_class(self):
        if self.action == "create":
            return PropositionDevisCreateSerializer
        return PropositionDevisSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsArtisan()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin_role():
            return PropositionDevis.objects.all()
        if user.is_client():
            return PropositionDevis.objects.filter(demande__client=user)
        if user.is_artisan():
            return PropositionDevis.objects.filter(artisan__user=user)
        return PropositionDevis.objects.none()

    @action(detail=True, methods=["post"], permission_classes=[IsClient])
    def accepter(self, request, pk=None):
        """
        Le client accepte un devis : la demande passe à 'acceptée' avec cet
        artisan, et les autres devis reçus pour la même demande sont refusés.
        """
        proposition = self.get_object()
        demande = proposition.demande

        if demande.client != request.user:
            return Response(
                {"detail": "Vous ne pouvez accepter que les devis reçus sur vos propres demandes."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if demande.statut != Demande.Statut.EN_ATTENTE:
            return Response(
                {"detail": "Cette demande n'est plus ouverte."}, status=status.HTTP_400_BAD_REQUEST
            )

        demande.artisan = proposition.artisan
        demande.statut = Demande.Statut.ACCEPTEE
        demande.date_acceptation = timezone.now()
        demande.save()

        proposition.statut = PropositionDevis.Statut.ACCEPTEE
        proposition.save(update_fields=["statut"])
        demande.propositions_devis.exclude(pk=proposition.pk).update(
            statut=PropositionDevis.Statut.REFUSEE
        )

        return Response(DemandeSerializer(demande).data)
