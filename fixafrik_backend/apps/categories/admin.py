from django.contrib import admin
from .models import Categorie


@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    list_display = ("nom", "est_active", "date_creation")
    list_filter = ("est_active",)
    search_fields = ("nom",)
