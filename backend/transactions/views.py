from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from .serializers import TransactionSerializer
from accounts.permissions import IsAdminUserCustom
from membership.models import Membership

class TransactionListAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Admins see all transactions, users see only their own (if we had user-specific memberships)
        if request.user.is_staff:
            transactions = Transaction.objects.all().order_by("-date")
        else:
            # For now, users see all transactions (can be filtered by membership if needed)
            transactions = Transaction.objects.all().order_by("-date")
        return Response(TransactionSerializer(transactions, many=True).data)

class TransactionDetailAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id):
        try:
            transaction = Transaction.objects.get(id=id)
            return Response(TransactionSerializer(transaction).data)
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=404)

class TransactionByMemberAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, membership_number):
        try:
            membership = Membership.objects.get(membership_number=membership_number)
            transactions = Transaction.objects.filter(membership=membership).order_by("-date")
            return Response(TransactionSerializer(transactions, many=True).data)
        except Membership.DoesNotExist:
            return Response({"error": "Membership not found"}, status=404)
