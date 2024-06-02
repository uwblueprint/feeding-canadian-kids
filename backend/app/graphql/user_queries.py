import graphene
from .services import services
from .types import QueryList, User, ASPDistance


class UserQueries(QueryList):
    getAllUsers = graphene.List(
        User,
        limit=graphene.Int(default_value=5),
        offset=graphene.Int(default_value=0),
        role=graphene.String(default_value=""),
    )

    getUserById = graphene.Field(User, id=graphene.String(required=True))

    getASPNearLocation = graphene.List(
        ASPDistance,
        requestor_id=graphene.String(required=True),
        max_distance=graphene.Int(required=True),
        limit=graphene.Int(default_value=10),
        offset=graphene.Int(default_value=0),
    )

    def resolve_getAllUsers(self, info, limit, offset, role):
        user_service = services["user_service"]
        users = user_service.get_users(offset, limit, role)
        return users

    def resolve_getUserById(self, info, id):
        user_service = services["user_service"]
        user = user_service.get_user_by_id(id)

        return User(
            id=user.id,
            info=user.info,
        )

    def resolve_getASPNearLocation(
        self, info, requestor_id, max_distance, limit, offset
    ):
        user_service = services["user_service"]
        asps = user_service.get_asp_near_location(
            requestor_id, max_distance, limit, offset
        )

        return [
            ASPDistance(id=asp.id, info=asp.info, distance=asp.distance) for asp in asps
        ]
