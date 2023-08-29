from apps.analytics.models import AdReview, Chat, Message, ContactRequest
from apps.utils.serializers.base import BaseSerializer
from apps.ads.models import Ad, Gallery
from apps.ads.serializers.get_serializers import GalleryChildSerializer
from rest_framework import serializers
from apps.clients.models import Client
from apps.users.models import User


class AdContactGetSerializer(BaseSerializer):
    class Meta:
        model = ContactRequest
        fields = "__all__"


class AdReviewGetSerializer(BaseSerializer):
    class Meta:
        model = AdReview
        fields = "__all__"


class MessageGetChildSerializer(BaseSerializer):
    class Meta:
        model = Message
        fields = ["sender", "text"]


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

    class Meta:
        model = Chat
        fields = [
            "id",
            "ad_image",
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
            if gallery.media_urls.get("images")[0]
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
    class Meta:
        model = Message
        fields = [
            "text",
            "created_at",
            "sender",
        ]
