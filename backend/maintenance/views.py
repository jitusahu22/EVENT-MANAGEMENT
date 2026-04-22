from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdminUserCustom
from .models import Maintenance
from .serializers import MaintenanceSerializer

class MaintenanceListAPI(APIView):
    permission_classes = [IsAdminUserCustom]
    
    def get(self, request):
        maintenance_records = Maintenance.objects.all().order_by("-created_at")
        return Response(MaintenanceSerializer(maintenance_records, many=True).data)

class MaintenanceCreateAPI(APIView):
    permission_classes = [IsAdminUserCustom]
    
    def post(self, request):
        serializer = MaintenanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class MaintenanceUpdateAPI(APIView):
    permission_classes = [IsAdminUserCustom]
    
    def put(self, request, id):
        try:
            maintenance = Maintenance.objects.get(id=id)
            serializer = MaintenanceSerializer(maintenance, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Maintenance.DoesNotExist:
            return Response({"error": "Maintenance record not found"}, status=404)

class MaintenanceDeleteAPI(APIView):
    permission_classes = [IsAdminUserCustom]
    
    def delete(self, request, id):
        try:
            maintenance = Maintenance.objects.get(id=id)
            maintenance.delete()
            return Response({"success": "Maintenance record deleted successfully"}, status=200)
        except Maintenance.DoesNotExist:
            return Response({"error": "Maintenance record not found"}, status=404)
