from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    ProfileView,
    ChangePasswordView,
    UserAdminViewSet,
    ReinitialiserMotDePasseView,
)

router = DefaultRouter()
router.register("admin/utilisateurs", UserAdminViewSet, basename="admin-utilisateurs")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("login/refresh/", TokenRefreshView.as_view(), name="login-refresh"),
    path("me/", ProfileView.as_view(), name="profile"),
    path("me/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("mot-de-passe-oublie/", ReinitialiserMotDePasseView.as_view(), name="mot-de-passe-oublie"),
] + router.urls
