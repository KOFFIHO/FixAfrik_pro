from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Représentation publique d'un utilisateur (sans mot de passe)."""

    class Meta:
        model = User
        fields = (
            "id", "username", "first_name", "last_name", "email",
            "phone_number", "role", "ville", "commune",
            "photo_profil", "est_verifie", "date_creation",
        )
        read_only_fields = ("est_verifie", "role", "date_creation")


class RegisterSerializer(serializers.ModelSerializer):
    """
    Inscription d'un client ou d'un artisan.
    Le rôle 'admin' ne peut jamais être créé via cette route publique.
    """

    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    # ACTION CORRECTIVE : Ajout explicite du champ photo de profil en optionnel
    photo_profil = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = (
            "username", "first_name", "last_name", "email", "phone_number",
            "role", "ville", "commune", "password", "password_confirm",
            "photo_profil",  # <-- ACTION CORRECTIVE : Ajouté aux champs acceptés
        )

    def validate_role(self, value):
        if value == User.Role.ADMIN:
            raise serializers.ValidationError(
                "Impossible de créer un compte administrateur via l'inscription publique."
            )
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError({"password_confirm": "Les mots de passe ne correspondent pas."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Ajoute des informations utiles (rôle, id) directement dans le token JWT."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["username"] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data


class ChangePasswordSerializer(serializers.Serializer):
    ancien_mot_de_passe = serializers.CharField(required=True)
    nouveau_mot_de_passe = serializers.CharField(required=True, validators=[validate_password])


class UserAdminSerializer(serializers.ModelSerializer):
    """
    Utilisé par l'administrateur pour la gestion des utilisateurs :
    consultation de tous les comptes, activation/désactivation, vérification.
    Le rôle n'est volontairement pas modifiable ici (trop sensible pour un simple PATCH).
    """

    class Meta:
        model = User
        fields = (
            "id", "username", "first_name", "last_name", "email",
            "phone_number", "role", "ville", "commune", "is_active",
            "est_verifie", "date_creation", "last_login",
        )
        read_only_fields = (
            "id", "username", "first_name", "last_name", "email",
            "phone_number", "role", "ville", "commune",
            "date_creation", "last_login",
        )


class ReinitialisationMotDePasseSerializer(serializers.Serializer):
    """
    Permet à un utilisateur de réinitialiser son mot de passe sans passer par
    l'ancien mot de passe, en prouvant simplement qu'il connaît à la fois son
    nom d'utilisateur ET son numéro de téléphone (les deux réunis servent de
    preuve d'identité, comme demandé dans le cahier des charges).
    """

    username = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=True)
    nouveau_mot_de_passe = serializers.CharField(required=True, validators=[validate_password])
    confirmation_mot_de_passe = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs["nouveau_mot_de_passe"] != attrs["confirmation_mot_de_passe"]:
            raise serializers.ValidationError(
                {"confirmation_mot_de_passe": "Les mots de passe ne correspondent pas."}
            )

        utilisateur = User.objects.filter(
            username__iexact=attrs["username"],
            phone_number=attrs["phone_number"],
        ).first()

        if not utilisateur:
            raise serializers.ValidationError(
                "Aucun compte ne correspond à ce nom d'utilisateur et ce numéro de téléphone."
            )

        attrs["utilisateur"] = utilisateur
        return attrs

    def save(self):
        utilisateur = self.validated_data["utilisateur"]
        utilisateur.set_password(self.validated_data["nouveau_mot_de_passe"])
        utilisateur.save(update_fields=["password"])
        return utilisateur