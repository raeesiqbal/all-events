import re
import boto3
from datetime import date, datetime
import environ
from botocore.exceptions import ClientError
from urllib.parse import unquote
import logging
import os
from django.conf import settings
from base64 import b64encode


class S3Service:
    s3_client = boto3.client("s3")
    env = environ.Env()

    def __init__(self):
        self.bucket_name = self.env.str("S3_BUCKET_NAME")

    def parse_s3_url(self, s3_object_url):
        s3_url = s3_object_url.replace("https://", "")

        # Split the URL by the first occurrence of '/'
        bucket_and_key, filename = s3_url.split("/", 1)

        # Extract bucket name and object key from the first part
        bucket_name, object_key = bucket_and_key.split("/", 1)

        return bucket_name, object_key, filename

    def delete_s3_object_by_url(self, s3_object_url):
        bucket_name = self.bucket_name
        object_key = s3_object_url.replace(
            f"https://s3.amazonaws.com/{bucket_name}/", ""
        )

        s3_client = boto3.client("s3")

        try:
            s3_client.delete_object(Bucket=bucket_name, Key=object_key)
            return True
        except Exception as e:
            return False

    def upload_file(self, file, content_type, upload_folder=None, object_name=None):
        """Upload a file to an S3 bucket

        :param file_name: File to upload
        :param bucket: Bucket to upload to
        :param object_name: S3 object name. If not specified then file_name is used
        :return: True if file was uploaded, else False
        """

        # If S3 object_name was not specified, use file_name

        if upload_folder is None:
            upload_folder = "ads"

        timestamp = datetime.timestamp(datetime.now())
        file_name_gen = f"uploads/{upload_folder}/{timestamp}_{file.name}"
        if object_name is None:
            object_name = file_name_gen
        bucket_name = self.bucket_name

        s3 = boto3.client("s3")
        uploaded_file_url = None

        try:
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

        except ClientError as e:
            logging.error(e)
            return False
        return uploaded_file_url
