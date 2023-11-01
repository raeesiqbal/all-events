from celery import shared_task
from django.utils.translation import gettext_lazy as _
from django.core.mail import EmailMultiAlternatives
import boto3
import environ


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


@shared_task()
def delete_s3_object_by_urls(media):
    s3_client = boto3.client("s3")
    env = environ.Env()
    bucket_name = env.str("S3_BUCKET_NAME")
    objects_to_delete = []

    for category, urls in media.items():
        for url in urls:
            object_key = url.replace(f"https://s3.amazonaws.com/{bucket_name}/", "")
            objects_to_delete.append({"Key": object_key})

    s3_client.delete_objects(
        Bucket=bucket_name,
        Delete={"Objects": objects_to_delete},
    )
    return True
