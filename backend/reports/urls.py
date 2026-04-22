from django.urls import path
from .views import SummaryAPI, DetailedReportAPI, RevenueByPeriodAPI

urlpatterns = [
    path("summary/", SummaryAPI.as_view()),
    path("detailed/", DetailedReportAPI.as_view()),
    path("revenue/", RevenueByPeriodAPI.as_view()),
]
