from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "phone_number", "role", "est_verifie", "ville", "is_active")
    list_filter = ("role", "est_verifie", "is_active", "ville")
    search_fields = ("username", "email", "phone_number", "first_name", "last_name")
    fieldsets = UserAdmin.fieldsets + (
        ("Informations FixAfrik", {
            "fields": ("role", "phone_number", "ville", "commune", "photo_profil", "est_verifie"),
        }),
    )
