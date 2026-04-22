from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/membership/", include("membership.urls")),
    path("api/transactions/", include("transactions.urls")),
    path("api/reports/", include("reports.urls")),
    path("api/maintenance/", include("maintenance.urls")),
]
