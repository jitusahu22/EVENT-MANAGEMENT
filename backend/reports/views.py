from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from membership.models import Membership
from transactions.models import Transaction
from datetime import datetime, timedelta
from django.db.models import Sum
from django.db.models import Q

class SummaryAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        active_memberships = Membership.objects.filter(status="active").count()
        cancelled_memberships = Membership.objects.filter(status="cancelled").count()
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

class DetailedReportAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Breakdown by membership type
        memberships_by_type = {}
        for mtype, _ in Membership.MEMBERSHIP_CHOICES:
            count = Membership.objects.filter(membership_type=mtype).count()
            memberships_by_type[mtype] = count
        
        # Revenue by membership type
        revenue_by_type = {}
        amounts = {"6_months": 50, "1_year": 90, "2_years": 160}
        for mtype, _ in Membership.MEMBERSHIP_CHOICES:
            revenue = 0
            for trx in Transaction.objects.filter(status="completed", membership__membership_type=mtype, type="add"):
                revenue += amounts.get(mtype, 50)
            revenue_by_type[mtype] = revenue
        
        return Response({
            "memberships_by_type": memberships_by_type,
            "revenue_by_type": revenue_by_type,
        })

class RevenueByPeriodAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        period = request.GET.get("period", "all")
        
        amounts = {"6_months": 50, "1_year": 90, "2_years": 160}
        revenue = 0
        
        if period == "30days":
            cutoff_date = datetime.now() - timedelta(days=30)
            transactions = Transaction.objects.filter(status="completed", date__gte=cutoff_date)
        elif period == "year":
            cutoff_date = datetime.now() - timedelta(days=365)
            transactions = Transaction.objects.filter(status="completed", date__gte=cutoff_date)
        else:  # all time
            transactions = Transaction.objects.filter(status="completed")
        
        for trx in transactions:
            if trx.type == "add":
                revenue += amounts.get(trx.membership.membership_type, 50)
            elif trx.type == "update":
                revenue += 50
        
        return Response({
            "period": period,
            "revenue": revenue,
            "transaction_count": transactions.count()
        })
