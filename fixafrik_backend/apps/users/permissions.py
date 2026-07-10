from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsClient(BasePermission):
    """Autorise uniquement les utilisateurs ayant le rôle client."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_client())


class IsArtisan(BasePermission):
    """Autorise uniquement les utilisateurs ayant le rôle artisan."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_artisan())


class IsAdminRole(BasePermission):
    """Autorise uniquement les administrateurs FixAfrik."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin_role())


class IsOwnerOrAdmin(BasePermission):
    """
    Autorise le propriétaire de l'objet (ex : sa propre demande, son propre profil)
    ou un administrateur. Lecture seule autorisée pour les autres si besoin.
    """

    owner_field = "user"

    def has_object_permission(self, request, view, obj):
        if request.user.is_admin_role():
            return True
        if request.method in SAFE_METHODS:
            return True
        owner = getattr(obj, self.owner_field, None)
        return owner == request.user
