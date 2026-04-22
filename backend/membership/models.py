from django.db import models
from django.contrib.auth.models import User

class Membership(models.Model):
    MEMBERSHIP_CHOICES = (
        ('6_months', '6 Months'),
        ('1_year', '1 Year'),
        ('2_years', '2 Years'),
    )

    membership_number = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    membership_type = models.CharField(max_length=50, choices=MEMBERSHIP_CHOICES, default='6_months')
    status = models.CharField(max_length=20, default="active")
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.membership_number} - {self.name}"
