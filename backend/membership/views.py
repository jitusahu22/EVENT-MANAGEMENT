from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Membership
from .serializers import MembershipSerializer
from dateutil.relativedelta import relativedelta
from datetime import date
from accounts.permissions import IsAdminUserCustom
from transactions.models import Transaction
from maintenance.models import Maintenance

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
        membership_number = data.get("membership_number")

        if not membership_number:
            return Response({"error": "Membership number is required"}, status=status.HTTP_400_BAD_REQUEST)

        if Membership.objects.filter(membership_number=membership_number).exists():
            return Response({"error": "Membership number already exists"}, status=status.HTTP_400_BAD_REQUEST)

        months = {"6_months": 6, "1_year": 12, "2_years": 24}
        end_date = date.today() + relativedelta(months=months.get(membership_type, 6))

        membership = Membership.objects.create(
            membership_number=membership_number,
            name=data.get("name"),
            email=data.get("email"),
            phone=data.get("phone"),
            membership_type=membership_type,
            end_date=end_date,
            status="active"
        )

        # Create maintenance record for new membership
        Maintenance.objects.create(
            description=f"New membership created for {membership.name} ({membership_number})",
            status="completed",
            priority="low"
        )

        Transaction.objects.create(
            membership=membership,
            type="add",
            status="completed"
        )

        return Response(MembershipSerializer(membership).data, status=status.HTTP_201_CREATED)

class UpdateMembershipAPI(APIView):
    permission_classes = [IsAdminUserCustom]

    def get(self, request, membership_number):
        try:
            membership = Membership.objects.get(membership_number=membership_number)
            return Response(MembershipSerializer(membership).data)
        except Membership.DoesNotExist:
            return Response({"error": "Membership not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, membership_number):
        try:
            membership = Membership.objects.get(membership_number=membership_number)
        except Membership.DoesNotExist:
            return Response({"error": "Membership not found"}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get("action")

        if action == "extend":
            membership.end_date = membership.end_date + relativedelta(months=6)
            membership.status = "active"
            membership.save()
            
            # Create maintenance record for extension
            Maintenance.objects.create(
                description=f"Membership extended for {membership.name} ({membership_number})",
                status="completed",
                priority="medium"
            )
            
            Transaction.objects.create(
                membership=membership,
                type="update",
                status="completed"
            )
            return Response(MembershipSerializer(membership).data)

        elif action == "cancel":
            membership.status = "cancelled"
            membership.save()
            
            # Create maintenance record for cancellation
            Maintenance.objects.create(
                description=f"Membership cancelled for {membership.name} ({membership_number})",
                status="completed",
                priority="high"
            )
            
            Transaction.objects.create(
                membership=membership,
                type="cancel",
                status="completed"
            )
            return Response(MembershipSerializer(membership).data)

        return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

class DeleteMembershipAPI(APIView):
    permission_classes = [IsAdminUserCustom]

    def delete(self, request, membership_number):
        try:
            membership = Membership.objects.get(membership_number=membership_number)
            membership.delete()
            return Response({"success": "Membership deleted successfully"}, status=status.HTTP_200_OK)
        except Membership.DoesNotExist:
            return Response({"error": "Membership not found"}, status=status.HTTP_404_NOT_FOUND)
