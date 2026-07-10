from django.contrib import admin
from .models import ImageAccueil


@admin.register(ImageAccueil)
class ImageAccueilAdmin(admin.ModelAdmin):
    list_display = ("legende", "ordre", "est_active", "date_ajout")
    list_editable = ("ordre", "est_active")
    list_filter = ("est_active",)
