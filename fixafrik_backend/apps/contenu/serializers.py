from rest_framework import serializers
from .models import ImageAccueil


class ImageAccueilSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageAccueil
        fields = ("id", "image", "legende", "ordre", "est_active", "date_ajout")
        read_only_fields = ("date_ajout",)
