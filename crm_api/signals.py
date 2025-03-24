from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Lead
from django.core.mail import send_mail
from twilio.rest import Client   # type: ignore
import os

@receiver(post_save, sender=Lead)
def send_lead_notification(sender, instance, created, **kwargs):
    if created:
        # Email
        send_mail(
            'New Lead Received',
            f'New lead from {instance.name} ({instance.email})',
            os.getenv('EMAIL_HOST_USER'),
            [instance.property.agent.email],
            fail_silently=False,
        )
        
        # SMS via Twilio
        if instance.phone:
            client = Client(os.getenv('TWILIO_SID'), os.getenv('TWILIO_AUTH_TOKEN'))
            client.messages.create(
                body=f"New lead: {instance.name} ({instance.phone})",
                from_=os.getenv('TWILIO_PHONE'),
                to=instance.property.agent.phone
            )