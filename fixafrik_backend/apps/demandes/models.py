from django.conf import settings
from django.db import models
from apps.categories.models import Categorie
from apps.artisans.models import ArtisanProfile


class Demande(models.Model):
    """
    Publication d'un besoin par un client, qui peut être pris en charge par un artisan.
    Correspond à la fois à la 'demande' et à la 'mission' du cahier des charges :
    le statut fait évoluer une simple demande vers une mission suivie.
    """

    class Statut(models.TextChoices):
        EN_ATTENTE = "en_attente", "En attente"
        ACCEPTEE = "acceptee", "Acceptée"
        EN_COURS = "en_cours", "En cours"
        TERMINEE = "terminee", "Terminée"
        ANNULEE = "annulee", "Annulée"

    class TypeDemande(models.TextChoices):
        # Mission directe : le premier artisan qui clique "accepter" récupère la mission.
        MISSION_DIRECTE = "mission_directe", "Mission directe"
        # Demande de devis : plusieurs artisans peuvent proposer un prix,
        # le client choisit ensuite l'offre qui lui convient (voir PropositionDevis).
        DEMANDE_DEVIS = "demande_devis", "Demande de devis"

    client = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="demandes_creees"
    )
    artisan = models.ForeignKey(
        ArtisanProfile, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="missions"
    )
    categorie = models.ForeignKey(Categorie, on_delete=models.PROTECT, related_name="demandes")

    type_demande = models.CharField(
        max_length=20, choices=TypeDemande.choices, default=TypeDemande.MISSION_DIRECTE
    )
    titre = models.CharField(max_length=150)
    description = models.TextField()
    zone_geographique = models.CharField(max_length=150)
    budget_estime = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    statut = models.CharField(max_length=15, choices=Statut.choices, default=Statut.EN_ATTENTE)

    date_creation = models.DateTimeField(auto_now_add=True)
    date_acceptation = models.DateTimeField(blank=True, null=True)
    date_fin = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name = "Demande"
        verbose_name_plural = "Demandes"
        ordering = ["-date_creation"]

    def __str__(self):
        return f"{self.titre} ({self.get_statut_display()})"


class PropositionDevis(models.Model):
    """
    Devis (proposition de prix) envoyé par un artisan en réponse à une
    Demande de type 'demande_devis'. Le client peut recevoir plusieurs
    propositions pour une même demande et en accepter une seule.
    """

    class Statut(models.TextChoices):
        EN_ATTENTE = "en_attente", "En attente"
        ACCEPTEE = "acceptee", "Acceptée"
        REFUSEE = "refusee", "Refusée"

    demande = models.ForeignKey(
        Demande, on_delete=models.CASCADE, related_name="propositions_devis"
    )
    artisan = models.ForeignKey(
        ArtisanProfile, on_delete=models.CASCADE, related_name="devis_envoyes"
    )
    montant_propose = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.TextField(
        blank=True, null=True, help_text="Détail du devis : délai, matériel inclus, etc."
    )
    statut = models.CharField(max_length=10, choices=Statut.choices, default=Statut.EN_ATTENTE)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Proposition de devis"
        verbose_name_plural = "Propositions de devis"
        ordering = ["montant_propose"]
        # Un artisan ne peut envoyer qu'un seul devis par demande
        # (il peut en revanche le modifier tant qu'il n'est pas accepté).
        unique_together = ("demande", "artisan")

    def __str__(self):
        return f"Devis de {self.artisan} pour '{self.demande.titre}' ({self.montant_propose} FCFA)"
