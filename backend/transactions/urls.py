from django.urls import path
from .views import TransactionListAPI, TransactionDetailAPI, TransactionByMemberAPI

urlpatterns = [
    path("", TransactionListAPI.as_view()),
    path("<int:id>/", TransactionDetailAPI.as_view()),
    path("member/<str:membership_number>/", TransactionByMemberAPI.as_view()),
]
