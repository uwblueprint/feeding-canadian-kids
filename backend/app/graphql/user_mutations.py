import graphene
from .services import services
from .types import (
    Mutation,
    MutationList,
)
from app.resources.user_dto import UserDTO


class User(graphene.ObjectType):
    name = graphene.String()
    email = graphene.String()
    role = graphene.String()


class UpdateUserByID(Mutation):
    class Arguments:
        auth_id = graphene.String()
        id = graphene.String()
        name = graphene.String()
        email = graphene.String()
        role = graphene.String()

    user = graphene.Field(lambda: User)

    def mutate(self, info, auth_id, id, name, email, role):
        user_service = services["user_service"]
        requester_id = user_service.get_user_id_by_auth_id(auth_id)
        requester_role = user_service.get_user_role_by_auth_id(auth_id)

        if requester_role == "Admin" or requester_id == id:
            user = user_service.update_user_by_id(
                id, UserDTO(id, name.split(" ")[0], name.split(" ")[1], email, role)
            )

            return UpdateUserByID(
                user=User(
                    name=f"{user.first_name} {user.last_name}",
                    email=user.email,
                    role=user.role,
                )
            )


class UserMutations(MutationList):
    updateUserByID = UpdateUserByID.Field()
