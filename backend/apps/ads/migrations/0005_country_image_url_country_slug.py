# Generated by Django 4.2.3 on 2023-10-02 22:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ads", "0004_alter_ad_activation_countries"),
    ]

    operations = [
        migrations.AddField(
            model_name="country",
            name="image_url",
            field=models.TextField(blank=True, null=True, verbose_name="Image url"),
        ),
        migrations.AddField(
            model_name="country",
            name="slug",
            field=models.SlugField(blank=True, null=True),
        ),
    ]
