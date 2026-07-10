from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Utilisateur unique pour les 3 profils du cahier des charges :
    Client, Artisan, Administrateur.
    Le champ `role` détermine les permissions et les fonctionnalités accessibles.
    """

    class Role(models.TextChoices):
        CLIENT = "client", "Client"
        ARTISAN = "artisan", "Artisan"
        ADMIN = "admin", "Administrateur"

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.CLIENT)

    # Champs communs demandés par le cahier des charges
    phone_number = models.CharField(
        max_length=20, unique=True,
        help_text="Numéro de téléphone, utilisé aussi pour la vérification."
    )
    ville = models.CharField(max_length=100, default="Abidjan")
    commune = models.CharField(max_length=100, blank=True, null=True)
    photo_profil = models.ImageField(upload_to="profils/", blank=True, null=True)
    est_verifie = models.BooleanField(
        default=False,
        help_text="Vrai après vérification du numéro/identité (surtout pour les artisans)."
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    def is_client(self):
        return self.role == self.Role.CLIENT

    def is_artisan(self):
        return self.role == self.Role.ARTISAN

    def is_admin_role(self):
        return self.role == self.Role.ADMIN

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"
