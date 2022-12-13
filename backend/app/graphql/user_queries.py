import graphene
from .services import services
from .types import QueryList, Query


class User(Query):
    name = graphene.String()
    email = graphene.String()
    role = graphene.String()


class UserQueries(QueryList):
    users = graphene.List(
        User,
        first=graphene.Int(default_value=5),
        offset=graphene.Int(default_value=0),
        role=graphene.String(default_value=""),
    )

    user = graphene.Field(
        User,
        id=graphene.String(required=True),
    )

    def resolve_users(self, info, first, offset, role):
        user_service = services["user_service"]
        users = user_service.get_users()

        if role != "":
            filtered = []
            for user in users:
                if user.role == role:
                    filtered.append(
                        User(
                            name=f"{user.first_name} {user.last_name}",
                            email=user.email,
                            role=user.role,
                        )
                    )
            return filtered[offset: offset + first]  # noqa: E203

        return [
            *map(
                lambda user: User(
                    name=f"{user.first_name} {user.last_name}",
                    email=user.email,
                    role=user.role,
                ),
                users[offset: offset + first],  # noqa: E203
            )
        ]

    def resolve_user(self, info, id):
        user_service = services["user_service"]
        user = user_service.get_user_by_id(id)

        return User(
            name=f"{user.first_name} {user.last_name}",
            email=user.email,
            role=user.role,
        )
