# Generated by Django 4.2.3 on 2023-10-19 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("subscriptions", "0006_alter_subscription_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="subscription",
            name="stripe_product",
            field=models.JSONField(
                blank=True, default=dict, null=True, verbose_name="Stripe Product"
            ),
        ),
        migrations.AddField(
            model_name="subscription",
            name="stripe_subscription",
            field=models.JSONField(
                blank=True, default=dict, null=True, verbose_name="Stripe Subscription"
            ),
        ),
    ]
