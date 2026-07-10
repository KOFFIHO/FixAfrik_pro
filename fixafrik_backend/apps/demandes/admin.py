from django.contrib import admin
from .models import Demande


@admin.register(Demande)
class DemandeAdmin(admin.ModelAdmin):
    list_display = ("titre", "client", "artisan", "categorie", "statut", "date_creation")
    list_filter = ("statut", "categorie")
    search_fields = ("titre", "description", "zone_geographique")
