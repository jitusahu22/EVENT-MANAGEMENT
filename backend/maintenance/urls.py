from django.urls import path
from .views import MaintenanceListAPI, MaintenanceCreateAPI, MaintenanceUpdateAPI, MaintenanceDeleteAPI

urlpatterns = [
    path("", MaintenanceListAPI.as_view()),
    path("create/", MaintenanceCreateAPI.as_view()),
    path("update/<int:id>/", MaintenanceUpdateAPI.as_view()),
    path("delete/<int:id>/", MaintenanceDeleteAPI.as_view()),
]
