# imports
from apps.utils.services.s3_service import S3Service
from apps.utils.views.base import BaseViewset, ResponseInfo
from apps.ads.filters import AdCustomFilterBackend
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Value, F, Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from apps.utils.tasks import (
    delete_s3_object_by_urls,
    upload_image,
    upload_video,
    upload_pdf,
    delete_s3_object_by_url_list,
)
from tempfile import NamedTemporaryFile
from ipware import get_client_ip

# filters
from rest_framework.filters import OrderingFilter, SearchFilter


# permissions
from apps.users.permissions import (
    IsClient,
    IsSuperAdmin,
    IsVendorUser,
    IsVerified,
)


# constants
from apps.utils.constants import KEYWORD_MODEL_MAPPING
from apps.users.constants import USER_ROLE_TYPES
from apps.ads.constants import SEARCH_TYPE_MAPPING, AD_STATUS
from apps.subscriptions.constants import SUBSCRIPTION_STATUS

# models
from apps.ads.models import (
    FAQ,
    AdFAQ,
    Ad,
    Category,
    Gallery,
    SubCategory,
    Country,
)
from apps.subscriptions.models import Subscription
from apps.companies.models import Company
from apps.analytics.models import Calender, AdView

# serializers
from apps.ads.serializers.update_serializer import AdUpdateSerializer
from apps.ads.serializers.create_serializers import (
    AdCreateSerializer,
    DeleteUrlOnUpdateSerializer,
    DeleteUrlSerializer,
    GetUploadPresignedUrlSerializer,
    URLListSerializer,
    SearchStringSerializer,
    UploadMediaSerializer,
)
from apps.ads.serializers.get_serializers import (
    AdNameSerializer,
    AdGetSerializer,
    AdPublicGetSerializer,
    CategoryKeywordSerializer,
    SubCategoryKeywordSerializer,
    SuggestionGetSerializer,
    AdRetriveSerializer,
    PremiumAdGetSerializer,
    CategoryGetSerializer,
    SubCategoryFilterSerializer,
    CountryGetSerializer,
)

from apps.analytics.serializers.get_serializer import (
    AdCalenderGetSerializer,
)


class AdViewSet(BaseViewset):
    """
    API endpoints that manages company ads
    """

    queryset = Ad.objects.all()
    action_serializers = {
        "default": AdPublicGetSerializer,
        "my_ads": AdNameSerializer,
        "create": AdCreateSerializer,
        "partial_update": AdUpdateSerializer,
        "get_upload_url": GetUploadPresignedUrlSerializer,
        "upload_media": UploadMediaSerializer,
        "delete_urls": URLListSerializer,
        "delete_url": DeleteUrlSerializer,
        "remove_url_on_update": DeleteUrlOnUpdateSerializer,
        "list": AdGetSerializer,
        "retrieve": AdRetriveSerializer,
        "fetch_suggestion_list": SearchStringSerializer,
        "premium_venue_ads": PremiumAdGetSerializer,
        "premium_vendor_ads": PremiumAdGetSerializer,
        "premium_venue_countries": CountryGetSerializer,
        "public_ad_retrieve": AdPublicGetSerializer,
        "venue_countries": CountryGetSerializer,
        "calender": AdCalenderGetSerializer,
    }
    action_permissions = {
        "default": [],
        "create": [IsAuthenticated, IsVerified, IsSuperAdmin | IsVendorUser],
        "my_ads": [IsAuthenticated, IsVerified, IsVendorUser],
        "list": [IsAuthenticated, IsVerified, IsSuperAdmin | IsVendorUser | IsClient],
        "retrieve": [
            IsAuthenticated,
            IsVerified,
            IsSuperAdmin | IsVendorUser | IsClient,
        ],
        "partial_update": [IsAuthenticated, IsVerified, IsSuperAdmin | IsVendorUser],
        "destroy": [IsAuthenticated, IsVerified, IsSuperAdmin | IsVendorUser],
        "get_upload_url": [IsAuthenticated, IsVerified, IsClient | IsVendorUser],
        "upload_media": [IsAuthenticated, IsVerified, IsVendorUser],
        "delete_urls": [],
        "remove_url_on_update": [
            IsAuthenticated,
            IsVerified,
            IsSuperAdmin | IsVendorUser,
        ],
        "fetch_suggestion_list": [],
        "premium_venue_ads": [],
        "premium_vendor_ads": [],
        "public_ads_list": [],
        "keyword_details": [],
        "premium_venue_countries": [],
        "venue_countries": [],
        "calender": [],
    }
    filter_backends = [AdCustomFilterBackend, SearchFilter, OrderingFilter]
    search_param = "search"
    search_fields = [
        "name",
        "company__name",
        "country__name",
        "sub_category__name",
        "related_sub_category__name",
        "activation_countries__name",
        "city",
        "street",
        "offered_services",
        "site_services",
    ]
    ad_filterset_fields = ["sub_category__name", "site_question_id", "answer"]
    ordering_fields = ["name", "sub_category__name", "id"]
    filterset_fields = {
        "sub_category__category__name": ["exact"],
        "name": ["exact"],
        "country__name": ["exact"],
    }
    user_role_queryset = {
        USER_ROLE_TYPES["VENDOR"]: lambda self: Ad.objects.filter(
            company__user_id=self.request.user.id
        )
    }

    s3_service = S3Service()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        media = Gallery.objects.filter(ad=instance).first()
        if media:
            if media.media_urls and any(media.media_urls.values()):
                delete_s3_object_by_urls.delay(media.media_urls)
                media.delete()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        faqs = serializer.validated_data.pop("faqs", [])
        ad_faqs = serializer.validated_data.pop("ad_faq_ad", [])

        offered_services = serializer.validated_data.pop("offered_services", [])
        activation_countries = serializer.validated_data.pop("activation_countries", [])
        company = Company.objects.filter(user_id=request.user.id).first()
        subscription = Subscription.objects.filter(
            company=company, status=SUBSCRIPTION_STATUS["ACTIVE"]
        ).first()

        if subscription:
            company_ad_count = Ad.objects.filter(company=company).count()
            if company_ad_count >= subscription.type.allowed_ads:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data=ResponseInfo().format_response(
                        data={},
                        status_code=status.HTTP_400_BAD_REQUEST,
                        message="You have reached maximum ads as per your subscription",
                    ),
                )
        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data=ResponseInfo().format_response(
                    data={},
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message="You don't have any active subscription with us",
                ),
            )

        ad = Ad.objects.create(
            **serializer.validated_data,
            offered_services=offered_services,
            company=company,
        )

        ad.activation_countries.add(*activation_countries)

        # faqs
        if faqs:
            faqs_list = []
            for faq in faqs:
                faqs_list.append(FAQ(**faq, ad=ad))
            FAQ.objects.bulk_create(faqs_list)

        # ad faqs
        if ad_faqs:
            ad_faqs_list = []
            for faq in ad_faqs:
                ad_faqs_list.append(AdFAQ(**faq, ad=ad))
            AdFAQ.objects.bulk_create(ad_faqs_list)
        Calender.objects.create(company=company, ad=ad)

        # gallery
        media_urls = {"images": [], "video": [], "pdf": []}
        Gallery.objects.create(ad=ad, media_urls=media_urls)

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=AdGetSerializer(ad).data,
                status_code=status.HTTP_200_OK,
                message="Ad created",
            ),
        )

    def partial_update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        delete_url_list = serializer.validated_data.pop("delete_urls", [])
        media_urls = serializer.validated_data.pop("media_urls", {})
        faqs = serializer.validated_data.pop("faqs", [])
        ad_faqs = serializer.validated_data.pop("ad_faq_ad", [])
        activation_countries = serializer.validated_data.pop("activation_countries", [])

        company = Company.objects.filter(user_id=request.user.id).first()
        subscription = Subscription.objects.filter(
            company=company, status=SUBSCRIPTION_STATUS["ACTIVE"]
        ).first()
        if subscription:
            ad = Ad.objects.filter(id=kwargs.get("pk"))
            ad.first().activation_countries.clear()
            ad.first().activation_countries.add(*activation_countries)
            ad.update(**serializer.validated_data)

            # gallery
            Gallery.objects.filter(ad=ad.first()).update(media_urls=media_urls)

            # delete files from s3
            if delete_url_list:
                delete_s3_object_by_url_list.delay(delete_url_list)

            # faqs
            FAQ.objects.filter(ad=ad.first()).delete()
            if faqs:
                faqs_list = []
                for faq in faqs:
                    faqs_list.append(FAQ(**faq, ad=ad.first()))
                FAQ.objects.bulk_create(faqs_list)

            # ad faqs
            AdFAQ.objects.filter(ad=ad.first()).delete()
            if ad_faqs:
                ad_faqs_list = []
                for faq in ad_faqs:
                    ad_faqs_list.append(AdFAQ(**faq, ad=ad.first()))
                AdFAQ.objects.bulk_create(ad_faqs_list)

            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data=AdGetSerializer(ad.first()).data,
                    status_code=status.HTTP_200_OK,
                    message="Ad has been edited successfully",
                ),
            )
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Add modify can't be performed. You don't have any active subscription with us.",
            ),
        )

    @action(detail=False, url_path="my-ads", methods=["get"])
    def my_ads(self, request, *args, **kwargs):
        my_ads = Ad.objects.filter(company__user=request.user)
        if my_ads:
            serializer = self.get_serializer(my_ads, many=True).data
        else:
            serializer = []
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=serializer,
                status_code=status.HTTP_200_OK,
                message="My ads",
            ),
        )

    @action(detail=True, url_path="upload-media", methods=["post"])
    def upload_media(self, request, *args, **kwargs):
        set_main_image = request.query_params.get("main", False)
        ad = Ad.objects.filter(id=kwargs["pk"]).first()
        ad_gallery = Gallery.objects.filter(ad=ad).first()
        if ad and ad_gallery:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            files = serializer.validated_data.get("file", [])

            for file_obj in files:
                content_type = file_obj.content_type
                name = file_obj.name
                with NamedTemporaryFile(delete=False) as temp_file:
                    temp_file_path = temp_file.name
                    temp_file.write(file_obj.read())
                    temp_file.seek(0)

                if file_obj.name.endswith(".pdf"):
                    upload_pdf.delay(temp_file_path, content_type, name, ad)
                elif file_obj.name.endswith(".mp4"):
                    upload_video.delay(temp_file_path, content_type, name, ad)
                elif file_obj.name.endswith((".jpeg", ".jpg", ".png", ".gif")):
                    upload_image.delay(
                        temp_file_path, content_type, name, ad, set_main_image
                    )
                file_obj.close()

            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={},
                    status_code=status.HTTP_200_OK,
                    message="upload media.",
                ),
            )

        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Ad/Gallery does not exists",
            ),
        )

    @action(detail=False, url_path="upload-url", methods=["post"])
    def get_upload_url(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file = serializer.validated_data.get("file")
        content_type = serializer.validated_data.get("content_type")

        if "image" in content_type:
            upload_folder = f"vendors/{request.user.email}/images"
        elif "pdf" in content_type:
            upload_folder = f"vendors/{request.user.email}/pdfs"
        elif "video" in content_type:
            upload_folder = f"vendors/{request.user.email}/videos"

        file_url = None
        # # Uploading resume to S3.
        s3_service = S3Service()
        # file_url = s3_service.upload_file(file, content_type, upload_folder)
        file_url = s3_service.create_presigned_url(
            file.name, content_type, upload_folder
        )

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={"file_url": file_url},
                status_code=status.HTTP_200_OK,
                message="uploads media.",
            ),
        )

    @action(detail=False, url_path="delete-url", methods=["post"])
    def delete_url(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.s3_service.delete_s3_object_by_url(serializer.validated_data.get("url"))
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={}, status_code=status.HTTP_200_OK, message="delete media"
            ),
        )

    @action(detail=False, url_path="delete-urls", methods=["post"])
    def delete_urls(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        urls = serializer.validated_data.get("urls")

        for url in urls:
            self.s3_service.delete_s3_object_by_url(url)
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={}, status_code=status.HTTP_200_OK, message="delete media list"
            ),
        )

    @action(detail=False, url_path="public-list", methods=["post"])
    def public_ads_list(self, request, *args, **kwargs):
        payload = request.data
        # Extract data from the payload
        payload_data = payload.get("data", {})
        categories = payload_data.get("categories", [])
        sub_categories = payload_data.get("subcategories", [])
        questions = payload_data.get("questions", [])
        commercial_name = payload_data.get("commercial_name", "")
        country = payload_data.get("country", "")

        # Build Q objects for filtering Ads based on categories and subcategories
        category_q = Q()
        subcategory_q = Q()

        if categories:
            category_q = Q(sub_category__category__name__in=categories)

        if sub_categories:
            subcategory_q = Q(sub_category__name__in=sub_categories)

        # Combine the Q objects
        combined_q = category_q | subcategory_q

        # Filter Ads by commercial_name
        if commercial_name:
            combined_q |= Q(name=commercial_name)

        if country:
            combined_q &= Q(country__name__iexact=country)

        # Filter Ads by FAQ questions
        if questions:
            faq_conditions = Q()

            for question in questions:
                for key, value in question.items():
                    faq_conditions |= Q(
                        ad_faq_ad__site_question_id=key,
                        ad_faq_ad__answer__icontains=value,
                    )

            # Apply the FAQ conditions to filter Ads
            combined_q &= faq_conditions

        queryset = (
            Ad.objects.filter(combined_q, status=AD_STATUS["ACTIVE"])
            .order_by("sort_order")
            .distinct()
        )

        filter_data = []

        if payload.get("filter", False):
            sub_categories = queryset.values_list("sub_category").distinct()

            sub_categories = (
                SubCategory.objects.filter(id__in=sub_categories)
                .prefetch_related(
                    "site_faq_sub_category__site_faq_questions",
                    "service_sub_category",
                )
                .all()
            )
            grouped_data = {}
            for subcategory in sub_categories:
                category = subcategory.category
                if category not in grouped_data:
                    grouped_data[category] = []
                grouped_data[category].append(subcategory)
            subcategory_serializer = SubCategoryFilterSerializer(many=True)
            category_serializer = CategoryGetSerializer()
            for category, subcategories in grouped_data.items():
                category_data = category_serializer.to_representation(category)
                category_data["subcategories"] = (
                    subcategory_serializer.to_representation(subcategories)
                )
                filter_data.append(category_data)

        page = self.paginate_queryset(queryset)

        if page != None:
            serializer = self.get_serializer(
                page,
                many=True,
            )
        else:
            serializer = self.get_serializer(
                queryset,
                many=True,
            )

        data = serializer.data
        if page != None:
            data = self.get_paginated_response(data).data

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={"data": data, "filter": filter_data},
                status_code=status.HTTP_200_OK,
                message="Ads List",
            ),
        )

    @action(detail=True, url_path="public-get", methods=["get"])
    def public_ad_retrieve(self, request, *args, **kwargs):
        data = None
        obj = self.queryset.filter(id=kwargs["pk"]).first()
        serializer = self.get_serializer(obj).data
        if obj:
            data = serializer

        # Ad view analytics
        ip, _ = get_client_ip(request)
        if request.user.is_authenticated:
            user = request.user
            if AdView.objects.filter(visitor_ip=ip, ad=obj, user=None).exists():
                AdView.objects.filter(visitor_ip=ip, ad=obj, user=None).update(
                    user=user
                )
        else:
            user = None
        if not AdView.objects.filter(visitor_ip=ip, ad=obj).exists():
            AdView.objects.create(visitor_ip=ip, ad=obj, user=user)
            obj.total_views += 1
            obj.save()

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data, status_code=status.HTTP_200_OK, message="Ad public get"
            ),
        )

    @action(detail=True, url_path="remove-url", methods=["post"])
    def remove_url_on_update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        media_type = serializer.validated_data.get("media_type")
        gallery_obj = Gallery.objects.filter(ad_id=kwargs["pk"]).first()
        url = serializer.validated_data.get("url")

        media = gallery_obj.media_urls.get(media_type, [])
        if url in media:
            media.remove(url)
            gallery_obj.media_urls[media_type] = media
            gallery_obj.save()

        self.s3_service.delete_s3_object_by_url(serializer.validated_data.get("url"))
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_200_OK,
                message="delete media on update",
            ),
        )

    @action(detail=False, url_path="view-effect", methods=["get"])
    def increment_view_effect(self, request, *args, **kwargs):
        slug = request.GET.get("slug")
        obj = self.queryset.filter(slug=slug)
        if len(obj):
            obj.update(total_views=F("total_views") + 1)

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={}, status_code=status.HTTP_200_OK, message="Ads Get"
            ),
        )

    @action(detail=False, url_path="suggestion-list", methods=["post"])
    def fetch_suggestion_list(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        search_string = serializer.validated_data.get("search_string")

        categories = (
            Category.objects.filter(name__icontains=search_string)
            .values("name")
            .annotate(type=Value("category"))
        )
        categories_dict_list = list(categories)

        sub_categories = (
            SubCategory.objects.filter(name__icontains=search_string)
            .values("name")
            .annotate(type=Value("sub_categories"))
        )
        sub_categories_dict_list = list(sub_categories)

        ad = (
            Ad.objects.filter(name__icontains=search_string)
            .values("name")
            .annotate(type=Value("commercial_name"))
        )
        ad_dict_list = list(ad)

        data_list = categories_dict_list + sub_categories_dict_list + ad_dict_list
        data = SuggestionGetSerializer(data_list, many=True).data
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data, status_code=status.HTTP_200_OK, message="Ads Get"
            ),
        )

    @action(detail=False, url_path="premium-venues", methods=["get"])
    def premium_venue_ads(self, request, *args, **kwargs):
        venue_ads = Ad.objects.filter(
            sub_category__category__name__icontains="venues",
            status=AD_STATUS["ACTIVE"],
        ).order_by("-sort_order")[:10]

        data = self.get_serializer(venue_ads, many=True).data

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data,
                status_code=status.HTTP_200_OK,
                message="Premium venue ads",
            ),
        )

    @action(detail=False, url_path="premium-vendors", methods=["get"])
    def premium_vendor_ads(self, request, *args, **kwargs):
        vendor_ads = Ad.objects.filter(
            sub_category__category__name__icontains="vendors",
            status=AD_STATUS["ACTIVE"],
        ).order_by("-sort_order")[:10]

        data = self.get_serializer(vendor_ads, many=True).data

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data,
                status_code=status.HTTP_200_OK,
                message="Premium vendor ads",
            ),
        )

    @action(detail=False, url_path="venue-countries", methods=["get"])
    def venue_countries(self, request, *args, **kwargs):
        category_name = "Venues"
        countries = (
            Ad.objects.filter(
                sub_category__category__name__icontains=category_name,
                status=AD_STATUS["ACTIVE"],
            )
            .values_list("country", flat=True)
            .distinct()
        )[:10]
        countries = Country.objects.filter(id__in=countries)
        data = self.get_serializer(countries, many=True).data

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data,
                status_code=status.HTTP_200_OK,
                message="Venue countries",
            ),
        )

    @action(detail=False, url_path="keyword-details", methods=["get"])
    def keyword_details(self, request, *args, **kwargs):
        data = []
        type = request.GET.get("type")
        keyword = SEARCH_TYPE_MAPPING[type]
        value = request.GET.get(keyword)
        if value and type:
            obj = (
                KEYWORD_MODEL_MAPPING[keyword]
                .objects.filter(name__iexact=value)
                .first()
            )
            if obj._meta.model == Category:
                data = CategoryKeywordSerializer(obj).data
            elif obj._meta.model == SubCategory:
                data = SubCategoryKeywordSerializer(obj).data

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data, status_code=status.HTTP_200_OK, message="Featured Ads List"
            ),
        )

    @action(detail=True, url_path="calender", methods=["get"])
    def calender(self, request, *args, **kwargs):
        calender = None
        if Calender.objects.filter(ad=kwargs["pk"], hide=False).exists():
            calender = Calender.objects.filter(ad=kwargs["pk"]).first()
            calender = self.get_serializer(calender).data
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=calender,
                status_code=status.HTTP_200_OK,
                message="Ad calender",
            ),
        )
