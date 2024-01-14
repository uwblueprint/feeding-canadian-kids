import graphene
from .services import services
from .types import OnsiteContact, QueryList, User, ASPDistance

class OnsiteContactQueries(QueryList):
    get_onsite_contact_for_user_by_id = graphene.Field(
        graphene.List(OnsiteContact),
        user_id=graphene.String(required=True)
    )
    get_onsite_contact_by_id = graphene.Field(
        OnsiteContact,
        id=graphene.String(required=True)
    )

    def resolve_get_onsite_contact_for_user_by_id(self, info, user_id):
        return services['onsite_contact_service'].get_onsite_contacts_for_user_by_id(user_id)

    def resolve_get_onsite_contact_by_id(self, info, id):
        return services['onsite_contact_service'].get_onsite_contact_by_id(id)
