from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.utils.models.base import post_archive, post_unarchive


class ResponseInfo(object):
    def __init__(self, **args):
        self.response = {
            'status_code': args.get('error', 200),
            'data': args.get('data', []),
            'message': args.get('message', 'success')
        }

    def format_response(self, data, message, status_code):
        return {
            'data': data,
            'message': message,
            'status_code': status_code
        }


class ResponseModelViewSet(viewsets.ModelViewSet):
    def __init__(self, **kwargs):
        self.response_format = ResponseInfo().response
        super(ResponseModelViewSet, self).__init__(**kwargs)

    def list(self, request, *args, **kwargs):
        response_data = super(ResponseModelViewSet, self).list(
            request, *args, **kwargs)
        self.response_format['data'] = response_data.data
        if not response_data.data:
            self.response_format['message'] = 'List empty'
        return Response(self.response_format)

    def retrieve(self, request, *args, **kwargs):
        response_data = super(ResponseModelViewSet, self).retrieve(
            request, *args, **kwargs)
        self.response_format['data'] = response_data.data
        if not response_data.data:
            self.response_format['message'] = 'Empty'
        return Response(self.response_format)

    def create(self, request, *args, **kwargs):
        response_data = super(ResponseModelViewSet, self).create(
            request, *args, **kwargs)
        self.response_format['data'] = response_data.data
        return Response(self.response_format)

    def update(self, request, *args, **kwargs):
        response_data = super(ResponseModelViewSet, self).update(
            request, *args, **kwargs)
        self.response_format['data'] = response_data.data

        return Response(self.response_format)

    def destroy(self, request, *args, **kwargs):
        response_data = super(ResponseModelViewSet, self).destroy(
            request, *args, **kwargs)
        self.response_format['data'] = response_data.data
        return Response(self.response_format)


class BaseViewset(ResponseModelViewSet):
    action_serializers = dict()
    action_permissions = dict()
    user_role_queryset = dict()

    def get_serializer_class(self):
        if self.action and self.action in self.action_serializers:
            return self.action_serializers[self.action]
        else:
            return self.action_serializers['default']

    def get_permissions(self):
        if self.action and self.action in self.action_permissions:
            self.permission_classes = self.action_permissions[self.action]
        elif 'default' in self.action_permissions:
            self.permission_classes = self.action_permissions['default']

        return super().get_permissions()

    def get_queryset(self):
        if not self.request.user.is_anonymous and self.request.user.role_type in self.user_role_queryset:
            return self.user_role_queryset[self.request.user.role_type](self)
        elif 'default' in self.user_role_queryset:
            return self.user_role_queryset['default']

        return super().get_queryset()
