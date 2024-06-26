from app.graphql.middleware.auth import requires_login
import graphene
from .services import services
from .types import OnsiteContact, QueryList


class OnsiteContactQueries(QueryList):
    get_onsite_contact_for_user_by_id = graphene.Field(
        graphene.List(OnsiteContact), user_id=graphene.String(required=True)
    )
    get_onsite_contact_by_id = graphene.Field(
        OnsiteContact, id=graphene.String(required=True)
    )

    @requires_login
    def resolve_get_onsite_contact_for_user_by_id(self, info, user_id):
        return services["onsite_contact_service"].get_onsite_contacts_for_user_by_id(
            user_id
        )

    @requires_login
    def resolve_get_onsite_contact_by_id(self, info, id):
        return services["onsite_contact_service"].get_onsite_contact_by_id(id)
