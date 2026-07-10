from django.contrib import admin
from .models import Avis


@admin.register(Avis)
class AvisAdmin(admin.ModelAdmin):
    list_display = ("artisan", "client", "note", "est_modere", "date_creation")
    list_filter = ("note", "est_modere")
    search_fields = ("commentaire",)
