from ..services.implementations.user_service import UserService
import graphene
import logging
from .types import (
    QueryList, 
    UserType,
    Mutation,
)


class UserQuery(QueryList):
    user = graphene.Field(
        UserType,
        id=graphene.String(required=True),
    )

    def resolve_user(self, info, id):
        user_service = UserService(logging.getLogger())
        user = user_service.get_user_by_id(id)

        return UserType(
            name=f"{user.first_name} {user.last_name}",
            email=user.email,
            role=user.role,
        )

class UpdateUser(Mutation):
    class Arguments:
        id = graphene.String(required=True)
    
    

