from apps.analytics.models import AdReview, Chat, Message, ContactRequest, Calender
from apps.utils.serializers.base import BaseSerializer
from apps.ads.models import Ad, Category, Gallery
from rest_framework import serializers
from apps.analytics.models import FavouriteAd
from django.db.models import Avg
from apps.users.constants import USER_ROLE_TYPES


class AdFavChildSerializer(BaseSerializer):
    ad_image = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    country = serializers.SerializerMethodField()
    sub_category = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Ad
        fields = [
            "ad_image",
            "company",
            "name",
            "country",
            "sub_category",
            "average_rating",
            "description",
        ]

    def get_ad_image(self, obj):
        gallery = Gallery.objects.filter(ad=obj).first()

        return (
            gallery.media_urls.get("images")[0]
            if gallery.media_urls.get("images")
            else None
        )

    def get_company(self, obj):
        return obj.company.name

    def get_country(self, obj):
        return obj.country.name

    def get_sub_category(self, obj):
        return obj.sub_category.name

    def get_average_rating(self, obj):
        avg_rating = AdReview.objects.filter(ad=obj).aggregate(Avg("rating"))
        return avg_rating["rating__avg"]


class FavouriteAdSerializer(BaseSerializer):
    ad = AdFavChildSerializer()

    class Meta:
        model = FavouriteAd
        fields = [
            "ad",
        ]


class AdContactGetSerializer(BaseSerializer):
    class Meta:
        model = ContactRequest
        fields = "__all__"


class CalenderGetSerializer(BaseSerializer):
    ad = serializers.SerializerMethodField()

    class Meta:
        model = Calender
        fields = "__all__"

    def get_ad(self, obj):
        return obj.ad.name


class AdCalenderGetSerializer(BaseSerializer):
    class Meta:
        model = Calender
        fields = ["dates"]


class AdReviewGetSerializer(BaseSerializer):
    # client = AdReviewClientChildSerializer()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = AdReview
        fields = "__all__"

    def get_full_name(self, obj):
        return obj.client.user.first_name + " " + obj.client.user.last_name


class MessageGetChildSerializer(BaseSerializer):
    class Meta:
        model = Message
        fields = ["sender", "text", "attachments"]


# class ChatListSerializer(BaseSerializer):
#     chat_messages = MessageGetChildSerializer(many=True)

#     class Meta:
#         model = Chat
#         fields = ["client", "ad", "event_date", "chat_messages"]


# class AdChildSerializer(BaseSerializer):
#     ad_s = serializers.SerializerMethodField("get_ad_saved_count")

#     class Meta:
#         model = Ad
#         fields = [
#             "name",
#             "ad_media",
#         ]


class MessageChildSerializer(BaseSerializer):
    class Meta:
        model = Message
        fields = [
            "text",
            "attachments",
            "created_at",
        ]


# class UserChildSerializer(BaseSerializer):
#     full_name = serializers.SerializerMethodField("get_full_name")

#     def get_full_name(self, obj):
#         return obj.first_name + " " + obj.last_name

#     class Meta:
#         model = User
#         fields = [
#             "full_name",
#             "phone",
#         ]


# class ClientChildSerializer(BaseSerializer):
#     user = UserChildSerializer()

#     class Meta:
#         model = Client
#         fields = ["user"]


class PersonChildSerializer(serializers.Serializer):
    name = serializers.CharField()
    phone = serializers.CharField()


class ChatListSerializer(BaseSerializer):
    read = serializers.SerializerMethodField()
    archived = serializers.SerializerMethodField()
    person = serializers.SerializerMethodField()
    latest_message = MessageChildSerializer()
    ad_image = serializers.SerializerMethodField("get_ad_image")
    ad_name = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = [
            "id",
            "ad_image",
            "ad_name",
            "event_date",
            "latest_message",
            "archived",
            "read",
            "person",
        ]

    def get_archived(self, obj):
        archived = False
        if self.context["request"].user.role_type == "client":
            if obj.is_archived_client:
                archived = True

        if self.context["request"].user.role_type == "vendor":
            if obj.is_archived_vendor:
                archived = True
        return archived

    def get_read(self, obj):
        read = False
        if self.context["request"].user.role_type == "client":
            if obj.is_read_client:
                read = True

        if self.context["request"].user.role_type == "vendor":
            if obj.is_read_vendor:
                read = True
        return read

    def get_ad_image(self, obj):
        gallery = Gallery.objects.filter(ad=obj.ad).first()

        return (
            gallery.media_urls.get("images")[0]
            if gallery.media_urls.get("images") and gallery.media_urls.get("images")[0]
            else None
        )

    def get_person(self, obj):
        # You can customize the logic to generate the extra data here
        user = self.context["request"].user

        extra_data = {
            "name": "",
            "phone": "",
        }

        if user.role_type == "vendor":
            extra_data["name"] = (
                obj.client.user.first_name + " " + obj.client.user.last_name
            )
            extra_data["phone"] = obj.client.user.phone
        elif user.role_type == "client":
            extra_data["name"] = obj.ad.company.name
            extra_data["phone"] = obj.ad.company.user.phone

        return extra_data

    def get_ad_name(self, obj):
        return obj.ad.name

    def to_representation(self, instance):
        # Call the parent class's to_representation method
        representation = super().to_representation(instance)

        # If the 'extra_data' field is present in the representation
        if "extra_data" in representation:
            # Use the ExtraDataSerializer to serialize the extra data
            extra_data_serializer = PersonChildSerializer(representation["extra_data"])
            representation["extra_data"] = extra_data_serializer.data

        return representation


class ChatMessageSerializer(BaseSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            "text",
            "attachments",
            "created_at",
            "sender",
            "image",
        ]

    def get_image(self, obj):
        if obj.sender.role_type == USER_ROLE_TYPES["VENDOR"]:
            gallery = Gallery.objects.filter(ad=obj.chat.ad).first()
            return (
                gallery.media_urls.get("images")[0]
                if gallery.media_urls.get("images")
                and gallery.media_urls.get("images")[0]
                else None
            )
        else:
            return obj.sender.image
