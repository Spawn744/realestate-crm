from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('agent', 'Agent'),
        ('client', 'Client'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='agent')
    phone = models.CharField(max_length=20, blank=True)
    agency = models.CharField(max_length=100, blank=True)

class Property(models.Model):
    agent = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    location = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=[
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('pending', 'Pending'),
    ])
    description = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        return super().save(*args, **kwargs)


class Lead(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    status = models.CharField(max_length=20, default='new')
    notes = models.TextField(blank=True)

# Add this to your existing models.py
class Appointment(models.Model):
    agent = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='agent_appointments')
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='client_appointments')
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    datetime = models.DateTimeField()
    TYPE_CHOICES = [
        ('virtual', 'Virtual'),
        ('physical', 'Physical'),
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Appointment for {self.property.title} - {self.datetime}"
    

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property_images/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.property.title}"
# Create your models here.
