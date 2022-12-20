import graphene
from ..graphql.services import services
from .types import QueryList, Query


class User(Query):
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String()
    role = graphene.String()


class UserQueries(QueryList):
    users = graphene.List(
        User,
        first=graphene.Int(default_value=5),
        offset=graphene.Int(default_value=0),
        role=graphene.String(),
    )

    def resolve_users(self, info, first, offset, role=None):
        user_service = services["user_service"]
        users = user_service.get_users(role)

        return users[offset: offset + first]
