from celery import shared_task
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives


@shared_task()
def send_email_to_user(title, html_message, plaintext_message, from_email, to_email):
    msg = EmailMultiAlternatives(
        subject=title,
        body=plaintext_message,
        from_email="rayiszafar@gmail.com",
        to=[to_email],
    )
    msg.attach_alternative(html_message, "text/html")
    msg.send()
