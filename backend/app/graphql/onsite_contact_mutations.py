from app.resources.update_user_dto import UpdateUserDTO
import graphene
from .services import services
from .types import (
    Mutation,
    MutationList,
    OnsiteContact,
    User,
    UserInfoInput,
)


class CreateOnsiteContact(Mutation):
    class Arguments:
        requestor_id = graphene.String(required=True)
        organization_id = graphene.String(required=True)
        name = graphene.String(required=True)
        phone = graphene.String(required=True)
        email = graphene.String(required=True)

    onsite_contact = graphene.Field(OnsiteContact)

    def mutate(self, info, requestor_id, organization_id, name, phone, email):
        onsite_contact_service = services["onsite_contact_service"]
        user_service = services["user_service"]
        requestor_auth_id = user_service.get_auth_id_by_user_id(requestor_id)
        requestor_role = user_service.get_user_role_by_auth_id(requestor_auth_id)

        if requestor_role == "Admin" or requestor_id == organization_id:
            onsite_contact_dto = onsite_contact_service.create_onsite_contact(
                organization_id,
                name,
                email,
                phone,
            )
            return CreateOnsiteContact(onsite_contact_dto)


# class ActivateUserByID(Mutation):
#     class Arguments:
#         requestor_id = graphene.String(required=True)
#         id = graphene.String(required=True)

#     user = graphene.Field(User)

#     def mutate(self, info, requestor_id, id):
#         user_service = services["user_service"]
#         requestor_auth_id = user_service.get_auth_id_by_user_id(requestor_id)
#         requestor_role = user_service.get_user_role_by_auth_id(requestor_auth_id)

#         if requestor_role == "Admin":
#             activate_user_dto = user_service.activate_user_by_id(id)

#             return ActivateUserByID(
#                 user=User(id=activate_user_dto.id, info=activate_user_dto.info)
#             )


# class DeactivateUserByID(Mutation):
#     class Arguments:
#         requestor_id = graphene.String(required=True)
#         id = graphene.String(required=True)

#     user = graphene.Field(User)

#     def mutate(self, info, requestor_id, id):
#         user_service = services["user_service"]
#         requestor_auth_id = user_service.get_auth_id_by_user_id(requestor_id)
#         requestor_role = user_service.get_user_role_by_auth_id(requestor_auth_id)

#         if requestor_role == "Admin" or requestor_id == id:
#             deactivate_user_dto = user_service.deactivate_user_by_id(id)

#             return DeactivateUserByID(
#                 user=User(id=deactivate_user_dto.id, info=deactivate_user_dto.info)
#             )


class OnsiteContactMutations(MutationList):
    createOnsiteContact = CreateOnsiteContact.Field()
