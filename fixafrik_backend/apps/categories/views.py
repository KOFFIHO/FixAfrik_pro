from rest_framework import viewsets, permissions
from apps.users.permissions import IsAdminRole
from .models import Categorie
from .serializers import CategorieSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    """Tout le monde (même anonyme) peut lister les catégories, seul l'admin peut les modifier."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_admin_role())


class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ["est_active"]
    search_fields = ["nom"]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsAdminRole()]
