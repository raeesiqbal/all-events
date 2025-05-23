# Generated by Django 4.2.3 on 2023-11-25 18:02

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ads", "0010_alter_ad_number"),
    ]

    operations = [
        migrations.AlterField(
            model_name="ad",
            name="offered_services",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.TextField(),
                blank=True,
                default=[],
                null=True,
                size=None,
            ),
        ),
    ]
