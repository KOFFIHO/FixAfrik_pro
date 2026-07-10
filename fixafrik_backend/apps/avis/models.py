from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from apps.artisans.models import ArtisanProfile
from apps.demandes.models import Demande


class Avis(models.Model):
    """Note et commentaire laissés par un client après une mission terminée."""

    demande = models.OneToOneField(Demande, on_delete=models.CASCADE, related_name="avis")
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="avis_donnes"
    )
    artisan = models.ForeignKey(
        ArtisanProfile, on_delete=models.CASCADE, related_name="avis"
    )
    note = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    commentaire = models.TextField(blank=True, null=True)
    est_modere = models.BooleanField(
        default=True, help_text="Passe à False si un administrateur masque l'avis (modération)."
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Avis"
        verbose_name_plural = "Avis"
        ordering = ["-date_creation"]

    def __str__(self):
        return f"Avis {self.note}/5 de {self.client} sur {self.artisan}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.artisan.recalculer_note_moyenne()
