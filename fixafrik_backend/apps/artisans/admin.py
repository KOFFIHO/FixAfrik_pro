from django.contrib import admin
from .models import ArtisanProfile, PhotoRealisation


class PhotoRealisationInline(admin.TabularInline):
    model = PhotoRealisation
    extra = 0


@admin.register(ArtisanProfile)
class ArtisanProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user", "categorie_principale", "zone_geographique",
        "statut_validation", "badge_confiance", "est_premium", "note_moyenne",
    )
    list_filter = ("statut_validation", "badge_confiance", "est_premium", "categorie_principale")
    search_fields = ("user__username", "user__first_name", "user__last_name", "zone_geographique")
    inlines = [PhotoRealisationInline]
    actions = ["valider_artisans", "rejeter_artisans"]

    @admin.action(description="Valider les artisans sélectionnés")
    def valider_artisans(self, request, queryset):
        queryset.update(statut_validation=ArtisanProfile.StatutValidation.VALIDE)

    @admin.action(description="Rejeter les artisans sélectionnés")
    def rejeter_artisans(self, request, queryset):
        queryset.update(statut_validation=ArtisanProfile.StatutValidation.REJETE)
