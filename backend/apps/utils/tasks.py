# Imports
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
from PIL import Image
from moviepy.editor import VideoFileClip
import tempfile


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
        # https://test-bucket-all-events.s3.amazonaws.com/uploads/vendors/rayiszafar@gmail.com/images/1702555431.260493_tmpikw5alyc.jpg
        # object_key = url.replace(f"https://s3.amazonaws.com/{bucket_name}/", "")
        object_key = url.replace(f"https://{bucket_name}.s3.amazonaws.com/", "")
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
            object_key = url.replace(f"https://{bucket_name}.s3.amazonaws.com/", "")
            objects_to_delete.append({"Key": object_key})

    s3_client.delete_objects(
        Bucket=bucket_name,
        Delete={"Objects": objects_to_delete},
    )
    return True


def delete_s3_object(url):
    s3_client = boto3.client("s3")
    env = environ.Env()
    bucket_name = env.str("S3_BUCKET_NAME")
    object_key = url.replace(f"https://{bucket_name}.s3.amazonaws.com/", "")
    s3_client.delete_object(Bucket=bucket_name, Key=object_key)
    return True


def resize_image(file_path, max_size):
    # Image processing (resize, compress, optimize)
    image = Image.open(file_path)
    original_size = os.path.getsize(file_path) / (1024 * 1024)  # Size in MB
    resize_factor = max_size / original_size
    new_width = int(image.width * resize_factor)
    new_height = int(image.height * resize_factor)
    image.thumbnail((new_width, new_height))

    output_buffer = tempfile.NamedTemporaryFile(delete=True)
    image.save(output_buffer, format="JPEG", quality=85)
    # Reset the file pointer to the beginning of the output_buffer
    output_buffer.seek(0)
    return output_buffer


@shared_task()
@transaction.atomic
def upload_image(image_path, content_type, name, ad, set_main_image):
    from apps.ads.models import Gallery

    # S3 init
    s3 = boto3.client("s3")
    env = environ.Env()
    bucket_name = env.str("S3_BUCKET_NAME")

    timestamp = datetime.timestamp(datetime.now())
    upload_folder = f"vendors/{ad.company.user.email}/images"

    # Try:
    max_size = float(env.str("IMAGE_SIZE", 2))
    # Size in MB
    original_size = os.path.getsize(image_path) / (1024 * 1024)
    if original_size > max_size:
        file = resize_image(image_path, max_size)
        content_type = "image/jpeg"
        name = os.path.basename(file.name) + ".jpg"
        file_content = file.read()
        file.close()
    else:
        with open(image_path, "rb") as file:
            file_content = file.read()

    object_name = f"uploads/{upload_folder}/{timestamp}_{name}"
    s3.upload_fileobj(
        io.BytesIO(file_content),
        bucket_name,
        object_name,
        ExtraArgs={
            "ACL": "public-read",
            "ContentType": content_type,
        },
    )
    uploaded_image_url = f"https://{bucket_name}.s3.amazonaws.com/{object_name}"
    ad_gallery = Gallery.objects.filter(ad=ad).first()
    media_urls = ad_gallery.media_urls
    if set_main_image:
        media_urls["images"].insert(0, uploaded_image_url)
    else:
        media_urls["images"].append(uploaded_image_url)
    ad_gallery.save()
    os.remove(image_path)

    # except ClientError as e:
    #     logging.error(e)
    #     return False
    return True


@shared_task()
@transaction.atomic
def upload_profile_image(image_path, content_type, name, upload_folder, user_id):
    from apps.users.models import User

    # s3 init
    s3 = boto3.client("s3")
    env = environ.Env()
    bucket_name = env.str("S3_BUCKET_NAME")

    user = User.objects.filter(id=user_id).first()
    deleted_image = delete_s3_object(user.image)

    if deleted_image:
        timestamp = datetime.timestamp(datetime.now())
        # try:
        max_size = float(env.str("IMAGE_SIZE", 2))
        original_size = os.path.getsize(image_path) / (1024 * 1024)  # Size in MB
        if original_size > max_size:
            file = resize_image(image_path, max_size)
            content_type = "image/jpeg"
            name = os.path.basename(file.name) + ".jpg"
            file_content = file.read()
            file.close()
        else:
            with open(image_path, "rb") as file:
                file_content = file.read()

        object_name = f"uploads/{upload_folder}/{timestamp}_{name}"

        s3.upload_fileobj(
            io.BytesIO(file_content),
            bucket_name,
            object_name,
            ExtraArgs={
                "ACL": "public-read",
                "ContentType": content_type,
            },
        )

        uploaded_image_url = f"https://{bucket_name}.s3.amazonaws.com/{object_name}"
        user.image = uploaded_image_url
        user.save()
        os.remove(image_path)

        # except ClientError as e:
        #     logging.error(e)
        #     return False
        return True


def resize_video(file_path, max_size):
    # Video processing (resize)
    video = VideoFileClip(file_path)

    # Get the original size of the video in MB
    original_size = os.path.getsize(file_path) / (1024 * 1024)

    # Calculate resize factor based on the maximum size
    resize_factor = max_size / original_size

    # Compute the new width and height
    new_width = int(video.size[0] * resize_factor)
    new_height = int(video.size[1] * resize_factor)

    # Resize the video using moviepy
    output_path = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4").name
    video_resized = video.resize(width=new_width, height=new_height)
    video_resized.write_videofile(output_path, codec="libx264", audio_codec="aac")

    # Close the original and resized videos
    video_resized.close()
    video.close()

    # Copy the contents of the temporary file to the desired location
    # local_save_path = r"C:\Users\Muhammad Raees\OneDrive\Desktop\all-events\all-events"
    # shutil.copy(output_path, os.path.join(local_save_path, "resized_video.mp4"))

    return output_path


@shared_task()
@transaction.atomic
def upload_video(video_path, content_type, name, ad):
    from apps.ads.models import Gallery

    # s3 init
    s3 = boto3.client("s3")
    env = environ.Env()
    bucket_name = env.str("S3_BUCKET_NAME")

    timestamp = datetime.timestamp(datetime.now())
    upload_folder = f"vendors/{ad.company.user.email}/videos"

    try:
        max_size = float(env.str("VIDEO_SIZE", 5))
        original_size = os.path.getsize(video_path) / (1024 * 1024)  # Size in MB
        if original_size > max_size:
            resized_video_path = resize_video(video_path, max_size)
            content_type = "video/mp4"
            name = os.path.basename(resized_video_path)
            object_name = f"uploads/{upload_folder}/{timestamp}_{name}"
            with open(resized_video_path, "rb") as file:
                # Pass the file object directly to upload_fileobj
                s3.upload_fileobj(
                    file,
                    bucket_name,
                    object_name,
                    ExtraArgs={
                        "ACL": "public-read",
                        "ContentType": content_type,
                    },
                )
            os.remove(resized_video_path)
        else:
            with open(video_path, "rb") as file:
                file_content = file.read()
                object_name = f"uploads/{upload_folder}/{timestamp}_{name}"
                s3.upload_fileobj(
                    io.BytesIO(file_content),
                    bucket_name,
                    object_name,
                    ExtraArgs={
                        "ACL": "public-read",
                        "ContentType": content_type,
                    },
                )

        uploaded_video_url = f"https://{bucket_name}.s3.amazonaws.com/{object_name}"
        ad_gallery = Gallery.objects.filter(ad=ad).first()
        media_urls = ad_gallery.media_urls
        media_urls["video"].append(uploaded_video_url)
        ad_gallery.save()
        os.remove(video_path)
    except ClientError as e:
        logging.error(e)
        return False

    return True


@shared_task()
@transaction.atomic
def upload_pdf(pdf_path, content_type, name, ad):
    from apps.ads.models import Gallery

    # s3 init
    s3 = boto3.client("s3")
    env = environ.Env()
    bucket_name = env.str("S3_BUCKET_NAME")

    timestamp = datetime.timestamp(datetime.now())
    upload_folder = f"vendors/{ad.company.user.email}/pdfs"

    try:
        with open(pdf_path, "rb") as file:
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

        uploaded_pdf_url = f"https://{bucket_name}.s3.amazonaws.com/{object_name}"
        ad_gallery = Gallery.objects.filter(ad=ad).first()
        media_urls = ad_gallery.media_urls
        media_urls["pdf"].append(uploaded_pdf_url)
        ad_gallery.save()

    finally:
        os.remove(pdf_path)  # Remove the temporary resized PDF file

    return True
