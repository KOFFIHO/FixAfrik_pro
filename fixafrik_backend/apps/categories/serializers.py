from rest_framework import serializers
from .models import Categorie


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ("id", "nom", "description", "icone", "est_active", "date_creation")
        read_only_fields = ("date_creation",)
