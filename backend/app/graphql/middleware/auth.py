from flask import current_app, jsonify, request
from functools import wraps
from ..services import services
from ..error_handling import ClientError


def make_decorator(fn_name, lookup_params=False):
    def requires_authorization(*params):
        """
        Determine if request is authorized based on the specific provided validation method.

        :param roles: the set of authorized roles to check for
        :type roles: {str}
        """

        def decorator(resolver):
            @wraps(resolver)
            def wrapper(parent, info, **kwargs):
                nonlocal params

                is_authorized = getattr(services["auth_service"], fn_name)
                if lookup_params:
                    params = list(map(lambda p: kwargs.get(p), params))
                if not is_authorized(info.context, *params):
                    raise ClientError("You are not authorized to make this request.")
                return resolver(parent, info, **kwargs)

            return wrapper

        return decorator
    return requires_authorization

# Require the user to be logged in.
requires_login = make_decorator("is_authenticated")

# Require the user role to match one of the provided ones, or an admin.
requires_role = make_decorator("is_authorized_by_role")

# Require the user ID to match the provided one, or the user to be an admin.
requires_user_id = make_decorator(
    "is_authorized_by_user_id",
    lookup_params=True,
)

# Require the user ID to match the provided one. This EXCLUDES admins.
requires_self = make_decorator(
    "is_authorized_by_self",
    lookup_params=True,
)

# Require the user email to match the provided one, or the user to be an admin.
requires_email = make_decorator(
    "is_authorized_by_email",
    lookup_params=True,
)
