from apps.users.constants import USER_ROLE_TYPES
from rest_framework import permissions


class IsSuperAdmin(permissions.BasePermission):
    """
    Permission check for Super Admin role verification.
    """

    def has_permission(self, request, view):
        return request.user.role_type == USER_ROLE_TYPES["SUPER_ADMIN"]


class IsVendorUser(permissions.BasePermission):
    """
    Permission check for Vendor role verification.
    """

    def has_permission(self, request, view):
        return request.user.role_type == USER_ROLE_TYPES["VENDOR"]


class IsClient(permissions.BasePermission):
    """
    Permission check for Vendor role verification.
    """

    def has_permission(self, request, view):
        return request.user.role_type == USER_ROLE_TYPES["CLIENT"]
    
