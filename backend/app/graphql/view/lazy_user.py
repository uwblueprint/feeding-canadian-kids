from ..services import services
from .lazy_context import LazyAttribute

class LazyUser(LazyAttribute):
    def __call__(self, context):
        return services["user_service"].get_user_by_auth_id(context.firebase_user.uid)
