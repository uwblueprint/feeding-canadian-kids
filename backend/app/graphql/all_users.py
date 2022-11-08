from ..services.implementations.user_service import UserService
import graphene
import logging
from .types import Query, QueryList


class UserType(graphene.ObjectType):
    name = graphene.String()
    email = graphene.String()
    role = graphene.String()


class AllUsersQuery(QueryList):
    all_users = graphene.List(
        UserType,
        first=graphene.Int(default_value=5),
        offset=graphene.Int(default_value=0),
        role=graphene.String(default_value=""),
    )

    def resolve_all_users(self, info, first, offset, role):
        user_service = UserService(logging.getLogger())
        users = user_service.get_users()

        if role != "":
            return [*filter(lambda user: user.role == role, users)][
                offset : offset + first
            ]

        print(users)
        return [
            *map(
                lambda user: UserType(
                    name=f"{user['first_name']} {user['last_name']}",
                    email=user["email"],
                    role=user["role"],
                ),
                users[offset : offset + first],
            )
        ]
