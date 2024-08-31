from functools import wraps
from ..services import services
from ..error_handling import ClientError

"""
Ensures that the the user is either an admin or logged in as the requestor id they claim.
"""


import traceback
def secure_requestor_id(resolver):
    @wraps(resolver)
    def wrapper(parent, info, **kwargs):
        is_admin = services["auth_service"].is_authorized_by_role(info.context, "admin")
        authorized = services["auth_service"].is_authorized_by_user_id(
            info.context, kwargs.get("requestor_id")
        )
        user_id = kwargs.get("requestor_id")
        print("user_id", user_id)
        if not user_id:
            print(traceback.format_exc())
            raise RuntimeError("You are not authorized to make this request. No user id provided!")
            
        if (not is_admin and not authorized) or not user_id:
            raise ClientError("You are not authorized to make this request.")

        if not services["user_service"].is_user_activated(user_id=user_id):
            raise ClientError("You are not authorized to make this request. Your user has been deactivated. Please contact FCK.")

        return resolver(parent, info, **kwargs)

    return wrapper


"""
Ensures that the the user is either an admin or logged in as the donor id they claim.
"""


def secure_donor_id(resolver):
    @wraps(resolver)
    def wrapper(parent, info, **kwargs):
        is_admin = services["auth_service"].is_authorized_by_role(info.context, "admin")
        authorized = services["auth_service"].is_authorized_by_user_id(
            info.context, kwargs.get("donor_id")
        )

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
        authorized = services["auth_service"].is_authenticated(info.context)

        if not authorized:
            raise ClientError(
                "You are not authorized to make this request. You need to be logged in."
            )

        return resolver(parent, info, **kwargs)

    return wrapper


def requires_role(role):
    """
    Ensures that the the user has the role or is an admin.
    """

    def decorator(resolver):
        @wraps(resolver)
        def wrapper(parent, info, **kwargs):
            authorized = services["auth_service"].is_authorized_by_role(
                info.context, [role, "Admin"]
            )

            if not authorized:
                raise ClientError("You are not authorized to make this request. ")

            return resolver(parent, info, **kwargs)

        return wrapper

    return decorator
