from ..services.implementations.user_service import UserService
import graphene
from .types import (
    Query,
    QueryList
)


class UserType(graphene.ObjectType):
    name = graphene.String()
    email = graphene.String()
    phone = graphene.String()
    role = graphene.String()


class AllUsersQuery(QueryList):
    all_user = graphene.List(UserType, first=graphene.Int(default_value=5), offset=graphene.Int(default_value=0), role=graphene.String())

    def resolve_all_users(self, info, first, offset, role):
        users = UserService.get_users()

        if role:
            return filter(lambda user: user.role == role, users)[offset:offset+first]

        return users[offset:offset+first]
