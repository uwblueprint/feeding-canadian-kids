import graphene
from .services import services
from .types import QueryList, User


class UserQueries(QueryList):
    getAllUsers = graphene.List(
        User,
        first=graphene.Int(default_value=5),
        offset=graphene.Int(default_value=0),
        role=graphene.String(default_value=""),
    )

    getUserById = graphene.Field(User, id=graphene.String(required=True))

    def resolve_getAllUsers(self, info, first, offset, role):
        user_service = services["user_service"]
        users = user_service.get_users()

        if role != "":
            filtered = []
            for user in users:
                if user.info.role == role:
                    filtered.append(
                        User(
                            id=user.id,
                            info=user.info,
                        )
                    )
            return filtered[offset : offset + first]  # noqa: E203

        return [
            User(
                id=user.id,
                info=user.info,
            )
            for user in users[offset : offset + first]  # noqa: E203
        ]

    def resolve_getUserById(self, info, id):
        user_service = services["user_service"]
        user = user_service.get_user_by_id(id)

        return User(
            id=user.id,
            info=user.info,
        )
