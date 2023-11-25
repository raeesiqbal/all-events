from celery import shared_task
from django.utils.translation import gettext_lazy as _
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
import boto3
import environ
from datetime import datetime
from botocore.exceptions import ClientError
import logging
import io
import os
from django.db import transaction


@shared_task()
def send_email_to_user(title, html_message, plaintext_message, to_email):
    msg = EmailMultiAlternatives(
        subject=title,
        body=plaintext_message,
        from_email=settings.EMAIL_HOST_USER,
        to=[to_email],
    )
    msg.attach_alternative(html_message, "text/html")
    msg.send()


@shared_task()
def delete_s3_object_by_url_list(urls):
    s3_client = boto3.client("s3")
    env = environ.Env()
    bucket_name = env.str("S3_BUCKET_NAME")
    objects_to_delete = []
    for url in urls:
        object_key = url.replace(f"https://s3.amazonaws.com/{bucket_name}/", "")
        objects_to_delete.append({"Key": object_key})

    s3_client.delete_objects(
        Bucket=bucket_name,
        Delete={"Objects": objects_to_delete},
    )
    return True


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


@shared_task()
@transaction.atomic
def upload_image(image, content_type, name, ad):
    from apps.ads.models import Gallery

    # s3 init
    s3 = boto3.client("s3")
    env = environ.Env()
    bucket_name = env.str("S3_BUCKET_NAME")

    timestamp = datetime.timestamp(datetime.now())
    upload_folder = f"vendors/{ad.company.user.email}/images"

    # try:
    with open(image, "rb") as file:
        object_name = f"uploads/{upload_folder}/{timestamp}_{name}"
        s3.upload_fileobj(
            file,
            bucket_name,
            object_name,
            ExtraArgs={
                "ACL": "public-read",
                "ContentType": content_type,
            },
        )

    uploaded_image_url = f"{s3.meta.endpoint_url}/{bucket_name}/{object_name}"
    ad_gallery = Gallery.objects.filter(ad=ad).first()
    media_urls = ad_gallery.media_urls
    media_urls["images"].append(uploaded_image_url)
    ad_gallery.save()
    os.remove(image)

    # except ClientError as e:
    #     logging.error(e)
    #     return False
    return True


@shared_task()
@transaction.atomic
def upload_video(video, content_type, name, ad):
    from apps.ads.models import Gallery

    # s3 init
    s3 = boto3.client("s3")
    env = environ.Env()
    bucket_name = env.str("S3_BUCKET_NAME")

    timestamp = datetime.timestamp(datetime.now())
    upload_folder = f"vendors/{ad.company.user.email}/video"

    # try:
    with open(video, "rb") as file:
        object_name = f"uploads/{upload_folder}/{timestamp}_{name}"
        s3.upload_fileobj(
            file,
            bucket_name,
            object_name,
            ExtraArgs={
                "ACL": "public-read",
                "ContentType": content_type,
            },
        )

    uploaded_video_url = f"{s3.meta.endpoint_url}/{bucket_name}/{object_name}"
    ad_gallery = Gallery.objects.filter(ad=ad).first()
    media_urls = ad_gallery.media_urls
    media_urls["video"].append(uploaded_video_url)
    ad_gallery.save()
    os.remove(video)

    # except ClientError as e:
    #     logging.error(e)
    #     return False
    return True


@shared_task()
@transaction.atomic
def upload_pdf(pdf, content_type, name, ad):
    from apps.ads.models import Gallery

    # s3 init
    s3 = boto3.client("s3")
    env = environ.Env()
    bucket_name = env.str("S3_BUCKET_NAME")

    timestamp = datetime.timestamp(datetime.now())
    upload_folder = f"vendors/{ad.company.user.email}/pdfs"

    # try:
    with open(pdf, "rb") as file:
        object_name = f"uploads/{upload_folder}/{timestamp}_{name}"
        s3.upload_fileobj(
            file,
            bucket_name,
            object_name,
            ExtraArgs={
                "ACL": "public-read",
                "ContentType": content_type,
            },
        )

    uploaded_pdf_url = f"{s3.meta.endpoint_url}/{bucket_name}/{object_name}"
    ad_gallery = Gallery.objects.filter(ad=ad).first()
    media_urls = ad_gallery.media_urls
    media_urls["pdf"].append(uploaded_pdf_url)
    ad_gallery.save()
    os.remove(pdf)

    # except ClientError as e:
    #     logging.error(e)
    #     return False
    return True
