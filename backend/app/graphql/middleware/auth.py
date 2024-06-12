from functools import wraps
from ..services import services
from ..error_handling import ClientError


def make_decorator(fn_name, lookup_params=False):
    def requires_authorization(*params):
        """
        Determine if request is authorized based on the specific provided
        validation method.

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
# requires_login = make_decorator("is_authenticated")

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

"""
Ensures that the the user is either an admin or logged in as the requestor id they claim.
"""
def secure_requestor_id(resolver):
    @wraps(resolver)
    def wrapper(parent, info, **kwargs):
        print("Got called!", kwargs)

        is_admin = services["auth_service"].is_authorized_by_role(info.context, "admin")
        authorized = services["auth_service"].is_authorized_by_user_id(info.context, kwargs.get("requestor_id"))
        print("is_admin", is_admin)
        print("authorized", authorized)

        if not is_admin and not authorized:
            raise ClientError("You are not authorized to make this request.")
        return resolver(parent, info, **kwargs)

    return wrapper


"""
Ensures that the the user is logged in.
"""
def requires_login(resolver):
    @wraps(resolver)
    def wrapper(parent, info, **kwargs):
        print("Got called!", kwargs)

        authorized = services["auth_service"].is_authenticated(info.context)

        if not authorized:
            raise ClientError("You are not authorized to make this request. You need to be logged in.")

        return resolver(parent, info, **kwargs)

    return wrapper