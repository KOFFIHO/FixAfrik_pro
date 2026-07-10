from rest_framework import serializers
from apps.users.serializers import UserSerializer
from apps.categories.serializers import CategorieSerializer
from apps.categories.models import Categorie
from apps.artisans.serializers import ArtisanProfileSerializer
from apps.artisans.models import ArtisanProfile
from .models import Demande, PropositionDevis


class DemandeSerializer(serializers.ModelSerializer):
    """Lecture détaillée d'une demande."""

    client = UserSerializer(read_only=True)
    categorie = CategorieSerializer(read_only=True)
    artisan = ArtisanProfileSerializer(read_only=True)
    nombre_devis_recus = serializers.SerializerMethodField()

    class Meta:
        model = Demande
        fields = (
            "id", "client", "artisan", "categorie", "type_demande", "titre", "description",
            "zone_geographique", "budget_estime", "statut", "nombre_devis_recus",
            "date_creation", "date_acceptation", "date_fin",
        )
        read_only_fields = ("statut", "date_creation", "date_acceptation", "date_fin", "artisan")

    def get_nombre_devis_recus(self, obj):
        return obj.propositions_devis.count()


class DemandeCreateSerializer(serializers.ModelSerializer):
    """
    Création d'une demande par un client. Le champ `type_demande` permet de
    choisir entre une mission directe (le premier artisan qui accepte
    récupère la mission) et une demande de devis (plusieurs artisans
    peuvent proposer un prix, le client choisit ensuite).
    """

    categorie = serializers.PrimaryKeyRelatedField(queryset=Categorie.objects.all())

    class Meta:
        model = Demande
        fields = (
            "categorie", "type_demande", "titre", "description",
            "zone_geographique", "budget_estime",
        )

    def create(self, validated_data):
        validated_data["client"] = self.context["request"].user
        return super().create(validated_data)


class DemandeStatutSerializer(serializers.ModelSerializer):
    """Changement de statut d'une demande (accepter, démarrer, terminer, annuler)."""

    class Meta:
        model = Demande
        fields = ("statut",)


class PropositionDevisSerializer(serializers.ModelSerializer):
    """Lecture d'un devis reçu par le client, ou envoyé par l'artisan."""

    artisan = ArtisanProfileSerializer(read_only=True)

    class Meta:
        model = PropositionDevis
        fields = (
            "id", "demande", "artisan", "montant_propose", "message",
            "statut", "date_creation",
        )
        read_only_fields = ("statut", "date_creation")


class PropositionDevisCreateSerializer(serializers.ModelSerializer):
    """
    Envoi (ou mise à jour) d'un devis par un artisan, en réponse à une
    demande de type 'demande_devis'.
    """

    class Meta:
        model = PropositionDevis
        fields = ("demande", "montant_propose", "message")

    def validate_demande(self, demande):
        if demande.type_demande != Demande.TypeDemande.DEMANDE_DEVIS:
            raise serializers.ValidationError("Cette demande n'accepte pas de devis.")
        if demande.statut != Demande.Statut.EN_ATTENTE:
            raise serializers.ValidationError("Cette demande n'est plus ouverte aux devis.")
        return demande

    def create(self, validated_data):
        request = self.context["request"]
        profil = ArtisanProfile.objects.filter(user=request.user).first()
        if not profil or profil.statut_validation != ArtisanProfile.StatutValidation.VALIDE:
            raise serializers.ValidationError(
                "Votre profil artisan doit être validé pour envoyer un devis."
            )
        # Un artisan ne peut envoyer qu'un devis par demande : s'il en a déjà
        # envoyé un, on met simplement à jour le montant/message existants.
        proposition, _ = PropositionDevis.objects.update_or_create(
            demande=validated_data["demande"],
            artisan=profil,
            defaults={
                "montant_propose": validated_data["montant_propose"],
                "message": validated_data.get("message"),
            },
        )
        return proposition
