from celery import shared_task
from django.utils.translation import gettext_lazy as _
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
import boto3
import environ


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


# @shared_task()
# def upload_file(self, file, content_type, upload_folder=None, object_name=None):

#     if upload_folder is None:
#         upload_folder = "ads"

#     timestamp = datetime.timestamp(datetime.now())
#     file_name_gen = f"uploads/{upload_folder}/{timestamp}_{file.name}"
#     if object_name is None:
#         object_name = file_name_gen
#     bucket_name = self.bucket_name

#     s3 = boto3.client("s3")
#     uploaded_file_url = None

#     try:
#         s3.upload_fileobj(
#             file,
#             bucket_name,
#             object_name,
#             ExtraArgs={
#                 "ACL": "public-read",
#                 "ContentType": content_type,
#             },
#         )
#         uploaded_file_url = f"{s3.meta.endpoint_url}/{bucket_name}/{object_name}"

#     except ClientError as e:
#         logging.error(e)
#         return False
#     return uploaded_file_url
