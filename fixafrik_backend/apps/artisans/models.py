from django.conf import settings
from django.db import models
from apps.categories.models import Categorie


class ArtisanProfile(models.Model):
    """
    Profil détaillé d'un artisan (en plus de son compte User).
    Contient : compétences, zone géographique, vérification, badge, abonnement premium.
    """

    class StatutValidation(models.TextChoices):
        EN_ATTENTE = "en_attente", "En attente"
        VALIDE = "valide", "Validé"
        REJETE = "rejete", "Rejeté"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profil_artisan"
    )
    categorie_principale = models.ForeignKey(
        Categorie, on_delete=models.PROTECT, related_name="artisans_principaux"
    )
    categories_secondaires = models.ManyToManyField(
        Categorie, blank=True, related_name="artisans_secondaires"
    )
    description = models.TextField(blank=True, null=True)
    competences = models.TextField(
        blank=True, null=True, help_text="Liste de compétences séparées par des virgules."
    )
    annees_experience = models.PositiveIntegerField(default=0)
    zone_geographique = models.CharField(
        max_length=150, help_text="Commune / quartier principal d'intervention."
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)

    # Vérification (numéro, identité, métier)
    statut_validation = models.CharField(
        max_length=15, choices=StatutValidation.choices, default=StatutValidation.EN_ATTENTE
    )
    piece_identite = models.FileField(upload_to="verifications/identite/", blank=True, null=True)
    justificatif_metier = models.FileField(upload_to="verifications/metier/", blank=True, null=True)
    note_admin = models.TextField(
        blank=True, null=True, help_text="Commentaire de l'administrateur lors de la validation/rejet."
    )

    # Badge et abonnement premium (fonctionnalités avancées)
    badge_confiance = models.BooleanField(default=False)
    est_premium = models.BooleanField(default=False)
    premium_jusqu_au = models.DateTimeField(blank=True, null=True)

    note_moyenne = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    nombre_avis = models.PositiveIntegerField(default=0)

    date_creation = models.DateTimeField(auto_now_add=True)
    date_maj = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profil artisan"
        verbose_name_plural = "Profils artisans"
        ordering = ["-note_moyenne", "-date_creation"]

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.categorie_principale}"

    def recalculer_note_moyenne(self):
        """Recalcule note_moyenne et nombre_avis à partir des avis liés."""
        agg = self.avis.aggregate(moyenne=models.Avg("note"), total=models.Count("id"))
        self.note_moyenne = agg["moyenne"] or 0
        self.nombre_avis = agg["total"] or 0
        self.save(update_fields=["note_moyenne", "nombre_avis"])


class PhotoRealisation(models.Model):
    """Photos de réalisations/portfolio de l'artisan."""

    artisan = models.ForeignKey(ArtisanProfile, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="realisations/")
    legende = models.CharField(max_length=150, blank=True, null=True)
    date_ajout = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo de {self.artisan}"
