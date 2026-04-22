from rest_framework import serializers
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
