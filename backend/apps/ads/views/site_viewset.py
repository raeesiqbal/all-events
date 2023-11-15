# imports
from apps.utils.views.base import BaseViewset, ResponseInfo
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

# models
from apps.ads.models import SiteQuestion, SiteFAQ

# serializers
from apps.ads.serializers.get_serializers import SiteQuestionGetSerializer


class SiteQuestionViewSet(BaseViewset):
    """
    API endpoints that manages Site Questions.
    """

    queryset = SiteQuestion.objects.all()
    action_serializers = {
        "default": SiteQuestionGetSerializer,
        "site_questions": SiteQuestionGetSerializer,
    }
    action_permissions = {
        "default": [],
        "list": [],
        "site_questions": [],
    }

    @action(detail=True, url_path="site-questions", methods=["get"])
    def site_questions(self, request, *args, **kwargs):
        site_faqs = SiteFAQ.objects.filter(
            sub_category__id=kwargs["pk"]
        ).prefetch_related("site_faq_questions")
        # for i in site_faqs:
        #     for c in i.site_faq_questions.all():
        #         print(c)

        # site_questions = SiteQuestion.objects.filter(site_faq=site_faq)
        serializer = self.get_serializer(site_faqs, many=True).data

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=serializer,
                status_code=status.HTTP_200_OK,
                message="Site Questions",
            ),
        )
