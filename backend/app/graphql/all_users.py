from backend.app.services.implementations.user_service import UserService
import graphene
from .types import (
    Query
)


class AllUsersQuery(Query):
    all_user = graphene.List(graphene.String, first=graphene.Int(default_value=5), offset=graphene.Int(default_value=0))

    def resolve_all_users(self, info, first, offset):
        users = UserService.get_users()

        return users[first:first+offset]
