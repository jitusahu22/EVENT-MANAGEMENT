from django.db import models
from membership.models import Membership

class Transaction(models.Model):
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE)
    type = models.CharField(max_length=50) # add/update/cancel
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="completed")

    def __str__(self):
        return f"{self.membership.name} - {self.type}"
