# Generated by Django 4.2.3 on 2023-10-16 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ads", "0006_remove_country_slug"),
    ]

    operations = [
        migrations.AddField(
            model_name="ad",
            name="status",
            field=models.CharField(
                choices=[("active", "active"), ("inactive", "inactive")],
                default="active",
                max_length=50,
                verbose_name="Status",
            ),
        ),
    ]
