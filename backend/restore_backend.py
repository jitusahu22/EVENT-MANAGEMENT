import os

files = {
    'backend/__init__.py': '',
    'backend/settings.py': '''import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = "django-insecure-key"
DEBUG = True
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "accounts",
    "membership",
    "transactions",
    "reports",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ]
}
''',
    'backend/urls.py': '''from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/membership/", include("membership.urls")),
    path("api/transactions/", include("transactions.urls")),
    path("api/reports/", include("reports.urls")),
]
''',
    'backend/wsgi.py': '''import os
from django.core.wsgi import get_wsgi_application
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
application = get_wsgi_application()
''',
    'backend/asgi.py': '''import os
from django.core.asgi import get_asgi_application
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
application = get_asgi_application()
''',
    
    # ACCOUNTS
    'accounts/__init__.py': '',
    'accounts/admin.py': 'from django.contrib import admin\n',
    'accounts/apps.py': '''from django.apps import AppConfig
class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"
''',
    'accounts/models.py': 'from django.db import models\n',
    'accounts/permissions.py': '''from rest_framework import permissions

class IsAdminUserCustom(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)

class IsNormalUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
''',
    'accounts/serializers.py': 'from rest_framework import serializers\n',
    'accounts/urls.py': '''from django.urls import path
from .views import LoginAPI, LogoutAPI

urlpatterns = [
    path("login/", LoginAPI.as_view()),
    path("logout/", LogoutAPI.as_view()),
]
''',
    'accounts/views.py': '''from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated

class LoginAPI(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            role = "admin" if user.is_superuser else "user"
            return Response({
                "token": token.key,
                "role": role,
                "user": {"username": user.username, "email": user.email}
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({"success": "Logged out"})
''',

    # MEMBERSHIP
    'membership/__init__.py': '',
    'membership/admin.py': 'from django.contrib import admin\n',
    'membership/apps.py': '''from django.apps import AppConfig
class MembershipConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "membership"
''',
    'membership/models.py': '''from django.db import models
from django.contrib.auth.models import User

class Membership(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    status = models.CharField(max_length=20, default="active")
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField()

    def __str__(self):
        return self.name
''',
    'membership/serializers.py': '''from rest_framework import serializers
from .models import Membership

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = "__all__"
''',
    'membership/urls.py': '''from django.urls import path
from .views import MembershipListAPI, AddMembershipAPI, UpdateMembershipAPI

urlpatterns = [
    path("", MembershipListAPI.as_view()),
    path("add/", AddMembershipAPI.as_view()),
    path("update/<int:pk>/", UpdateMembershipAPI.as_view()),
]
''',
    'membership/views.py': '''from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Membership
from .serializers import MembershipSerializer
from dateutil.relativedelta import relativedelta
from datetime import date
from accounts.permissions import IsAdminUserCustom
from transactions.models import Transaction

class MembershipListAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        memberships = Membership.objects.all().order_by("-id")
        return Response(MembershipSerializer(memberships, many=True).data)

class AddMembershipAPI(APIView):
    permission_classes = [IsAdminUserCustom]
    
    def post(self, request):
        data = request.data
        membership_type = data.get("membership_type", "1_year")
        
        amounts = {"6_months": 50, "1_year": 90, "2_years": 160}
        months = {"6_months": 6, "1_year": 12, "2_years": 24}
        
        amount = amounts.get(membership_type, 90)
        end_date = date.today() + relativedelta(months=months.get(membership_type, 12))
        
        membership = Membership.objects.create(
            name=data.get("name"),
            email=data.get("email"),
            phone=data.get("phone"),
            end_date=end_date,
            status="active"
        )
        
        Transaction.objects.create(
            membership_name=membership.name,
            transaction_type="new_membership",
            amount=amount,
            status="completed"
        )
        
        return Response(MembershipSerializer(membership).data, status=status.HTTP_201_CREATED)

class UpdateMembershipAPI(APIView):
    permission_classes = [IsAdminUserCustom]
    
    def put(self, request, pk):
        try:
            membership = Membership.objects.get(pk=pk)
        except Membership.DoesNotExist:
            return Response({"error": "Membership not found"}, status=status.HTTP_404_NOT_FOUND)
            
        action = request.data.get("action")
        
        if action == "extend":
            membership.end_date = membership.end_date + relativedelta(months=12)
            membership.status = "active"
            membership.save()
            Transaction.objects.create(
                membership_name=membership.name,
                transaction_type="extension",
                amount=90,
                status="completed"
            )
            return Response(MembershipSerializer(membership).data)
            
        elif action == "cancel":
            membership.status = "cancelled"
            membership.save()
            Transaction.objects.create(
                membership_name=membership.name,
                transaction_type="cancellation",
                amount=0,
                status="completed"
            )
            return Response(MembershipSerializer(membership).data)
            
        return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
''',

    # TRANSACTIONS
    'transactions/__init__.py': '',
    'transactions/admin.py': 'from django.contrib import admin\n',
    'transactions/apps.py': '''from django.apps import AppConfig
class TransactionsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "transactions"
''',
    'transactions/models.py': '''from django.db import models

class Transaction(models.Model):
    membership_name = models.CharField(max_length=255)
    transaction_type = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="completed")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.membership_name} - {self.transaction_type}"
''',
    'transactions/serializers.py': '''from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"
''',
    'transactions/urls.py': '''from django.urls import path
from .views import TransactionListAPI

urlpatterns = [
    path("", TransactionListAPI.as_view()),
]
''',
    'transactions/views.py': '''from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionListAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        transactions = Transaction.objects.all().order_by("-created_at")
        return Response(TransactionSerializer(transactions, many=True).data)
''',

    # REPORTS
    'reports/__init__.py': '',
    'reports/admin.py': 'from django.contrib import admin\n',
    'reports/apps.py': '''from django.apps import AppConfig
class ReportsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "reports"
''',
    'reports/urls.py': '''from django.urls import path
from .views import SummaryAPI

urlpatterns = [
    path("summary/", SummaryAPI.as_view()),
]
''',
    'reports/views.py': '''from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from membership.models import Membership
from transactions.models import Transaction
from django.db.models import Sum

class SummaryAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        total_revenue = Transaction.objects.filter(status="completed").aggregate(Sum("amount"))["amount__sum"] or 0
        active_memberships = Membership.objects.filter(status="active").count()
        expired_memberships = Membership.objects.filter(status__in=["expired", "cancelled"]).count()
        total_memberships = Membership.objects.count()
        
        return Response({
            "total_revenue": total_revenue,
            "active_memberships": active_memberships,
            "expired_memberships": expired_memberships,
            "total_memberships": total_memberships
        })
'''
}

for filepath, content in files.items():
    directory = os.path.dirname(filepath)
    if directory and not os.path.exists(directory):
        os.makedirs(directory)
    with open(filepath, 'w') as f:
        f.write(content)

print("Backend restored successfully.")
