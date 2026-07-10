from django.contrib.auth import get_user_model
from django.db.models import Avg
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.users.permissions import IsAdminRole
from apps.artisans.models import ArtisanProfile
from apps.demandes.models import Demande
from apps.avis.models import Avis
from apps.categories.models import Categorie

User = get_user_model()


class StatistiquesView(APIView):
    """
    Tableau de bord administrateur : vue d'ensemble de l'activité de la plateforme.
    Réservé au rôle 'admin' (gestion des utilisateurs, suivi des activités, stats).
    """

    permission_classes = [IsAdminRole]

    def get(self, request):
        maintenant = timezone.now()
        il_y_a_30_jours = maintenant - timedelta(days=30)

        data = {
            "utilisateurs": {
                "total": User.objects.count(),
                "clients": User.objects.filter(role=User.Role.CLIENT).count(),
                "artisans": User.objects.filter(role=User.Role.ARTISAN).count(),
                "nouveaux_30_jours": User.objects.filter(date_creation__gte=il_y_a_30_jours).count(),
            },
            "artisans": {
                "total": ArtisanProfile.objects.count(),
                "valides": ArtisanProfile.objects.filter(
                    statut_validation=ArtisanProfile.StatutValidation.VALIDE
                ).count(),
                "en_attente": ArtisanProfile.objects.filter(
                    statut_validation=ArtisanProfile.StatutValidation.EN_ATTENTE
                ).count(),
                "rejetes": ArtisanProfile.objects.filter(
                    statut_validation=ArtisanProfile.StatutValidation.REJETE
                ).count(),
                "premium": ArtisanProfile.objects.filter(est_premium=True).count(),
            },
            "demandes": {
                "total": Demande.objects.count(),
                "en_attente": Demande.objects.filter(statut=Demande.Statut.EN_ATTENTE).count(),
                "en_cours": Demande.objects.filter(statut=Demande.Statut.EN_COURS).count(),
                "terminees": Demande.objects.filter(statut=Demande.Statut.TERMINEE).count(),
                "annulees": Demande.objects.filter(statut=Demande.Statut.ANNULEE).count(),
            },
            "avis": {
                "total": Avis.objects.count(),
                "note_moyenne_plateforme": Avis.objects.filter(est_modere=True).aggregate(
                    m=Avg("note")
                )["m"] or 0,
            },
            "categories": {
                "total": Categorie.objects.filter(est_active=True).count(),
            },
        }
        return Response(data)
