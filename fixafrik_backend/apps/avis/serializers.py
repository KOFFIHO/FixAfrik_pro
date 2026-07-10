from rest_framework import serializers
from apps.demandes.models import Demande
from .models import Avis


class AvisSerializer(serializers.ModelSerializer):
    client_nom = serializers.CharField(source="client.get_full_name", read_only=True)

    class Meta:
        model = Avis
        fields = (
            "id", "demande", "client", "client_nom", "artisan",
            "note", "commentaire", "est_modere", "date_creation",
        )
        read_only_fields = ("client", "artisan", "est_modere", "date_creation")


class AvisCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avis
        fields = ("demande", "note", "commentaire")

    def validate_demande(self, demande):
        request = self.context["request"]
        if demande.client != request.user:
            raise serializers.ValidationError("Vous ne pouvez noter que vos propres demandes.")
        if demande.statut != Demande.Statut.TERMINEE:
            raise serializers.ValidationError("La mission doit être terminée avant de laisser un avis.")
        if hasattr(demande, "avis"):
            raise serializers.ValidationError("Un avis a déjà été laissé pour cette demande.")
        return demande

    def create(self, validated_data):
        request = self.context["request"]
        demande = validated_data["demande"]
        return Avis.objects.create(
            demande=demande,
            client=request.user,
            artisan=demande.artisan,
            note=validated_data["note"],
            commentaire=validated_data.get("commentaire"),
        )
