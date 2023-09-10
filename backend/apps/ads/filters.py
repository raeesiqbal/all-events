from django_filters.rest_framework import DjangoFilterBackend


class AdCustomFilterBackend(DjangoFilterBackend):
    def filter_queryset(self, request, queryset, view):
        custom_fields = getattr(view, 'ad_filterset_fields', [])
        filterset_kwargs = self.get_filterset_kwargs(request, queryset, view)
        custom_filterset_kwargs = {
            key: value for key, value in filterset_kwargs['data'].items() if key in custom_fields}

        if custom_filterset_kwargs:
            for key, value in custom_filterset_kwargs.items():
                if key=="sub_category__name":
                    filter_params = {f'{key}__in': value.split(',')}
                    queryset = queryset.filter(**filter_params)

                if key =="site_question_id":
                    filter_params = {f'ad_faq_ad__{key}__in': list(map(int, value.split(',')))}
                    queryset = queryset.filter(**filter_params)
                if key == "answer":
                    filter_params = {f'ad_faq_ad__{key}__in': value.split(',')}
                    queryset = queryset.filter(**filter_params)

        return super().filter_queryset(request, queryset, view)
