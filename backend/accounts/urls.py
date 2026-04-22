from django.urls import path
from .views import LoginAPI, LogoutAPI, RegisterAPI

urlpatterns = [
    path("register/", RegisterAPI.as_view()),
    path("login/", LoginAPI.as_view()),
    path("logout/", LogoutAPI.as_view()),
]
