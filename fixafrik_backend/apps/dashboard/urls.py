from django.urls import path
from .views import StatistiquesView

urlpatterns = [
    path("statistiques/", StatistiquesView.as_view(), name="dashboard-stats"),
]
