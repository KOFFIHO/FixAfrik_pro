from rest_framework import serializers
from apps.users.serializers import UserSerializer
from apps.categories.serializers import CategorieSerializer
from apps.categories.models import Categorie
from .models import ArtisanProfile, PhotoRealisation


class PhotoRealisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotoRealisation
        fields = ("id", "image", "legende", "date_ajout")


class ArtisanProfileSerializer(serializers.ModelSerializer):
    """Vue complète du profil artisan (lecture publique / consultation)."""

    user = UserSerializer(read_only=True)
    categorie_principale = CategorieSerializer(read_only=True)
    categories_secondaires = CategorieSerializer(many=True, read_only=True)
    photos = PhotoRealisationSerializer(many=True, read_only=True)

    class Meta:
        model = ArtisanProfile
        fields = (
            "id", "user", "categorie_principale", "categories_secondaires",
            "description", "competences", "annees_experience", "zone_geographique",
            "latitude", "longitude", "statut_validation", "badge_confiance",
            "est_premium", "note_moyenne", "nombre_avis", "photos",
            "piece_identite", "justificatif_metier",  # Ajoutés ici pour qu'ils soient lisibles à la reconnexion
            "date_creation", "date_maj",
        )
        read_only_fields = (
            "statut_validation", "badge_confiance", "est_premium",
            "note_moyenne", "nombre_avis", "date_creation", "date_maj",
        )

class ArtisanProfileCreateUpdateSerializer(serializers.ModelSerializer):
    """Création/mise à jour du profil par l'artisan lui-même ainsi que ses infos de base."""

    categories_secondaires = serializers.PrimaryKeyRelatedField(
        queryset=Categorie.objects.all(), many=True, required=False
    )
    piece_identite = serializers.FileField(required=False, allow_null=True)
    justificatif_metier = serializers.FileField(required=False, allow_null=True)

    # Ajout des champs utilisateur modifiables depuis le profil artisan
    first_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    photo_profil = serializers.ImageField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = ArtisanProfile
        fields = (
            "categorie_principale", "categories_secondaires", "description",
            "competences", "annees_experience", "zone_geographique",
            "latitude", "longitude", "piece_identite", "justificatif_metier",
            "first_name", "last_name", "photo_profil",  # <-- Ajoutés ici
        )

    def create(self, validated_data):
        # Extraction des données utilisateur si présentes à la création
        first_name = validated_data.pop("first_name", None)
        last_name = validated_data.pop("last_name", None)
        photo_profil = validated_data.pop("photo_profil", None)
        
        user = self.context["request"].user
        if first_name is not None: user.first_name = first_name
        if last_name is not None: user.last_name = last_name
        if photo_profil is not None: user.photo_profil = photo_profil
        user.save()

        validated_data["user"] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Extraction des données utilisateur
        first_name = validated_data.pop("first_name", None)
        last_name = validated_data.pop("last_name", None)
        photo_profil = validated_data.pop("photo_profil", None)
        
        user = instance.user
        if first_name is not None: user.first_name = first_name
        if last_name is not None: user.last_name = last_name
        
        # Gestion de la photo de profil utilisateur (si elle est fournie ou explicitement vidée)
        if 'photo_profil' in self.context['request'].FILES or photo_profil is not None:
            user.photo_profil = photo_profil
        
        user.save()

        # Sécurités existantes pour les fichiers de profil artisan
        if 'piece_identite' not in self.context['request'].FILES and 'piece_identite' not in validated_data:
            validated_data.pop('piece_identite', None)
            
        if 'justificatif_metier' not in self.context['request'].FILES and 'justificatif_metier' not in validated_data:
            validated_data.pop('justificatif_metier', None)

        return super().update(instance, validated_data)

class ValidationArtisanSerializer(serializers.ModelSerializer):
    """Utilisé par l'administrateur pour valider/rejeter un artisan."""

    class Meta:
        model = ArtisanProfile
        fields = ("statut_validation", "note_admin", "badge_confiance")