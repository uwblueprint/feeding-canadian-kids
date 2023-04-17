from app.resources.update_user_dto import UpdateUserDTO
import graphene
from .services import services
from .types import (
    Mutation,
    MutationList,
    User,
    UserInfoInput,
)


class UpdateUserByID(Mutation):
    class Arguments:
        requestor_id = graphene.String(required=True)
        id = graphene.String(required=True)
        userInfo = UserInfoInput(required=True)

    user = graphene.Field(User)

    def mutate(self, info, requestor_id, id, userInfo):
        user_service = services["user_service"]
        requestor_auth_id = user_service.get_auth_id_by_user_id(requestor_id)
        requestor_role = user_service.get_user_role_by_auth_id(requestor_auth_id)

        updated_user_auth_id = user_service.get_auth_id_by_user_id(id)

        if requestor_role == "Admin" or requestor_id == id:
            user_dto = user_service.update_user_by_id(
                id,
                UpdateUserDTO(
                    auth_id=updated_user_auth_id,
                    info=userInfo,
                ),
            )

            return UpdateUserByID(
                user=User(
                    id=user_dto.id,
                    info=user_dto.info,
                )
            )


class UserMutations(MutationList):
    updateUserByID = UpdateUserByID.Field()
