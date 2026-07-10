from django.db import models


class Categorie(models.Model):
    """Catégorie de métier (plomberie, électricité, menuiserie...)."""

    nom = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    icone = models.CharField(
        max_length=50, blank=True, null=True,
        help_text="Nom/clé d'icône utilisée par le frontend (ex: 'plomberie')."
    )
    est_active = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Catégorie de métier"
        verbose_name_plural = "Catégories de métiers"
        ordering = ["nom"]

    def __str__(self):
        return self.nom
