from django.apps import AppConfig


class ContenuConfig(AppConfig):
    # App dédiée au contenu géré par l'administrateur : pour l'instant,
    # les images du slide d'accueil (voir cahier des charges : "modération
    # des contenus" fait partie des tâches de l'administrateur).
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.contenu"
    verbose_name = "Contenu du site"
