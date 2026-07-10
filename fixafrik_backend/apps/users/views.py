from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import User
from .permissions import IsAdminRole
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
    UserAdminSerializer,
    ReinitialisationMotDePasseSerializer,
)


class RegisterView(generics.CreateAPIView):
    """Inscription publique (client ou artisan)."""

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Compte créé avec succès. Vérification en attente si artisan.",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    """Connexion : renvoie access + refresh token ainsi que les infos utilisateur."""

    serializer_class = CustomTokenObtainPairSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    """Consulter / mettre à jour son propre profil."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user

        if not user.check_password(serializer.validated_data["ancien_mot_de_passe"]):
            return Response(
                {"ancien_mot_de_passe": "Mot de passe incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data["nouveau_mot_de_passe"])
        user.save()
        return Response({"message": "Mot de passe modifié avec succès."})


class ReinitialiserMotDePasseView(APIView):
    """
    Réinitialisation du mot de passe SANS être connecté : l'utilisateur
    prouve son identité en fournissant son nom d'utilisateur et son numéro
    de téléphone (les deux doivent correspondre au même compte).
    Accessible à tous (client, artisan, admin).
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ReinitialisationMotDePasseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Votre mot de passe a été réinitialisé avec succès."})


class UserAdminViewSet(viewsets.ModelViewSet):
    """
    Gestion des utilisateurs par l'administrateur : liste, recherche, activation/
    désactivation d'un compte (ex : suspendre un utilisateur qui enfreint les règles).
    """

    queryset = User.objects.all().order_by("-date_creation")
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminRole]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["role", "is_active", "est_verifie"]
    search_fields = ["username", "first_name", "last_name", "email", "phone_number"]
    ordering_fields = ["date_creation", "last_login"]
    http_method_names = ["get", "patch", "head", "options"]

    @action(detail=True, methods=["patch"])
    def basculer_activation(self, request, pk=None):
        """Active ou désactive rapidement un compte utilisateur."""
        utilisateur = self.get_object()
        utilisateur.is_active = not utilisateur.is_active
        utilisateur.save(update_fields=["is_active"])
        return Response(UserAdminSerializer(utilisateur).data)
