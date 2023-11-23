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
def upload_file(media):
    s3 = boto3.client("s3")
    env = environ.Env()
    bucket_name = env.str("S3_BUCKET_NAME")
    s3 = boto3.client("s3")

    for item in media:
        timestamp = datetime.timestamp(datetime.now())
        content_type = item["content_type"]
        file = item["file"]
        print("file", file)
        print("content", content_type)

        if not isinstance(file, bytes):
            print("yessssssssssssssssssssssssssssssssssssssss")
            # If the file_data is a string, encode it to bytes
            file = file.encode()
        if "image" in content_type:
            upload_folder = f"vendors/rayiszafar@gmail.com/images"
        elif "pdf" in content_type:
            upload_folder = f"vendors/rayiszafar@gmail.com/pdfs"
        elif "video" in content_type:
            upload_folder = f"vendors/rayiszafar@gmail.com/videos"

        file_name_gen = f"uploads/{upload_folder}/{timestamp}"
        object_name = file_name_gen

        # try:
        file = io.BytesIO(file)
        s3.upload_fileobj(
            file,
            bucket_name,
            object_name,
            ExtraArgs={
                "ACL": "public-read",
                "ContentType": content_type,
            },
        )
        uploaded_file_url = f"{s3.meta.endpoint_url}/{bucket_name}/{object_name}"
        print(uploaded_file_url)
        # except ClientError as e:
        #     logging.error(e)
        #     return False
    return True
