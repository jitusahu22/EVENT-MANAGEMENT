import os

files = {
    'accounts/permissions.py': '''from rest_framework import permissions

class IsAdminUserCustom(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class IsNormalUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
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
            role = "admin" if user.is_staff else "user"
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

    'membership/models.py': '''from django.db import models
from django.contrib.auth.models import User

class Membership(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    membership_type = models.CharField(max_length=50, default='6_months')
    status = models.CharField(max_length=20, default="active")
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
''',
    'membership/urls.py': '''from django.urls import path
from .views import MembershipListAPI, MembershipDetailAPI, AddMembershipAPI, UpdateMembershipAPI

urlpatterns = [
    path("", MembershipListAPI.as_view()),
    path("<int:pk>/", MembershipDetailAPI.as_view()),
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
    permission_classes = [IsAdminUserCustom]
    def get(self, request):
        memberships = Membership.objects.all().order_by("-id")
        return Response(MembershipSerializer(memberships, many=True).data)

class MembershipDetailAPI(APIView):
    permission_classes = [IsAdminUserCustom]
    def get(self, request, pk):
        try:
            membership = Membership.objects.get(pk=pk)
            return Response(MembershipSerializer(membership).data)
        except Membership.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

class AddMembershipAPI(APIView):
    permission_classes = [IsAdminUserCustom]
    
    def post(self, request):
        data = request.data
        membership_type = data.get("membership_type", "6_months")
        
        months = {"6_months": 6, "1_year": 12, "2_years": 24}
        end_date = date.today() + relativedelta(months=months.get(membership_type, 6))
        
        membership = Membership.objects.create(
            name=data.get("name"),
            email=data.get("email"),
            phone=data.get("phone"),
            membership_type=membership_type,
            end_date=end_date,
            status="active"
        )
        
        Transaction.objects.create(
            membership=membership,
            type="add",
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
            membership.end_date = membership.end_date + relativedelta(months=6)
            membership.status = "active"
            membership.save()
            Transaction.objects.create(
                membership=membership,
                type="update",
                status="completed"
            )
            return Response(MembershipSerializer(membership).data)
            
        elif action == "cancel":
            membership.status = "cancelled"
            membership.save()
            Transaction.objects.create(
                membership=membership,
                type="cancel",
                status="completed"
            )
            return Response(MembershipSerializer(membership).data)
            
        return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
''',

    'transactions/models.py': '''from django.db import models
from membership.models import Membership

class Transaction(models.Model):
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE)
    type = models.CharField(max_length=50) # add/update/cancel
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="completed")

    def __str__(self):
        return f"{self.membership.name} - {self.type}"
''',
    'transactions/serializers.py': '''from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    membership_name = serializers.CharField(source='membership.name', read_only=True)
    transaction_type = serializers.CharField(source='type', read_only=True)
    amount = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(source='date', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'membership', 'membership_name', 'transaction_type', 'amount', 'status', 'created_at']

    def get_amount(self, obj):
        amounts = {"6_months": 50, "1_year": 90, "2_years": 160}
        if obj.type == "add":
            return amounts.get(obj.membership.membership_type, 50)
        elif obj.type == "update":
            return 50
        return 0
''',

    'reports/views.py': '''from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from membership.models import Membership
from transactions.models import Transaction

class SummaryAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        active_memberships = Membership.objects.filter(status="active").count()
        cancelled_memberships = Membership.objects.filter(status__in=["expired", "cancelled"]).count()
        total_memberships = Membership.objects.count()
        
        revenue = 0
        amounts = {"6_months": 50, "1_year": 90, "2_years": 160}
        for trx in Transaction.objects.filter(status="completed"):
            if trx.type == "add":
                revenue += amounts.get(trx.membership.membership_type, 50)
            elif trx.type == "update":
                revenue += 50
                
        return Response({
            "total_revenue": revenue,
            "active_memberships": active_memberships,
            "expired_memberships": cancelled_memberships,
            "total_memberships": total_memberships
        })
'''
}

for filepath, content in files.items():
    with open(filepath, 'w') as f:
        f.write(content)

print("Backend updated.")
