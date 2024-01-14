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
class UpdateOnsiteContact(Mutation):
    class Arguments:
        id = graphene.String(required=True)
        name = graphene.String()
        phone = graphene.String()
        email = graphene.String()

    onsite_contact = graphene.Field(OnsiteContact)

    def mutate(self, info, id, name=None, phone=None, email=None):
        onsite_contact_service = services["onsite_contact_service"]
        updated_onsite_contact = onsite_contact_service.update_onsite_contact_by_id(id, name, email, phone)
        return UpdateOnsiteContact(updated_onsite_contact)

class DeleteOnsiteContact(Mutation):
    class Arguments:
        requestor_id = graphene.String(required=True)
        id = graphene.String(required=True)

    success = graphene.Boolean()

    def mutate(self, info, requestor_id, id):
        onsite_contact_service = services["onsite_contact_service"]
        user_service = services["user_service"]

        requestor_auth_id = user_service.get_auth_id_by_user_id(requestor_id)
        requestor_role = user_service.get_user_role_by_auth_id(requestor_auth_id)
        onsite_contact = onsite_contact_service.get_onsite_contact_by_id(id)
        organization_id = onsite_contact.organization_id

        if requestor_role != "Admin" and requestor_id != organization_id:
            raise Exception("Unauthorized")

        try:
            onsite_contact_service.delete_onsite_contact_by_id(id)
            success = True
        except Exception as e:
            success = False
        return DeleteOnsiteContact(success)



class OnsiteContactMutations(MutationList):
    createOnsiteContact = CreateOnsiteContact.Field()
    updateOnsiteContact = UpdateOnsiteContact.Field()
    deleteOnsiteContact = DeleteOnsiteContact.Field()

