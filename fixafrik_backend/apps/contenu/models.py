from django.db import models


class ImageAccueil(models.Model):
    """
    Une image du diaporama affiché sur la page d'accueil (à droite du hero).
    Gérée entièrement par l'administrateur depuis l'espace admin : c'est lui
    qui ajoute/retire/réordonne les images, il n'y a rien de codé en dur
    côté frontend.
    """

    image = models.ImageField(upload_to="accueil/slide/")
    legende = models.CharField(
        max_length=150, blank=True, null=True,
        help_text="Texte optionnel affiché sous l'image (ex : 'Un plombier chez un client à Cocody')."
    )
    ordre = models.PositiveIntegerField(
        default=0, help_text="Ordre d'affichage dans le diaporama (0 = premier)."
    )
    est_active = models.BooleanField(
        default=True, help_text="Décochez pour retirer l'image du diaporama sans la supprimer."
    )
    date_ajout = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Image du diaporama d'accueil"
        verbose_name_plural = "Images du diaporama d'accueil"
        ordering = ["ordre", "-date_ajout"]

    def __str__(self):
        return self.legende or f"Image #{self.pk}"
