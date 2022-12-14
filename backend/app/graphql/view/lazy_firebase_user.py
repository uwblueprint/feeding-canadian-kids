import firebase_admin.auth

from ..services import services
from .lazy_context import LazyAttribute

class LazyFirebaseUser(LazyAttribute):
    def __call__(self, context):
        decoded_id_token = firebase_admin.auth.verify_id_token(
            context.access_token, check_revoked=True
        )
        return firebase_admin.auth.get_user(decoded_id_token["uid"])
