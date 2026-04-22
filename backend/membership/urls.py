from django.urls import path
from .views import MembershipListAPI, MembershipDetailAPI, AddMembershipAPI, UpdateMembershipAPI, DeleteMembershipAPI

urlpatterns = [
    path("", MembershipListAPI.as_view()),
    path("<int:pk>/", MembershipDetailAPI.as_view()),
    path("add/", AddMembershipAPI.as_view()),
    path("update/<str:membership_number>/", UpdateMembershipAPI.as_view()),
    path("delete/<str:membership_number>/", DeleteMembershipAPI.as_view()),
]
