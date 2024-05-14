from typing import List, Optional

from app.models.onsite_contact import OnsiteContact
from app.resources.onsite_contact_dto import OnsiteContactDTO

from ..interfaces.onsite_contact_service import IOnsiteContactService

from ...models.user import User


class OnsiteContactService(IOnsiteContactService):
    def __init__(self, logger):
        self.logger = logger

    def get_onsite_contact_by_id(
        self,
        id: str,
    ):
        onsite_contacts = OnsiteContact.objects(id=id).first()
        if onsite_contacts:
            return onsite_contacts.to_dto()
        else:
            return None

    def get_onsite_contacts_for_user_by_id(
        self,
        user_id: str,
    ) -> List[OnsiteContactDTO]:
        onsite_contacts = OnsiteContact.objects(organization_id=user_id).all()
        return [staff.to_dto() for staff in onsite_contacts]

    def delete_onsite_contact_by_id(
        self,
        id: str,
    ):
        OnsiteContact.objects(id=id).delete()

    def update_onsite_contact_by_id(
        self,
        id: str,
        name: Optional[str],
        email: Optional[str],
        phone: Optional[str],
    ) -> OnsiteContactDTO:
        existing: OnsiteContact = OnsiteContact.objects(id=id).first()
        if not existing:
            raise Exception(f'onsite contact with id "{id}" not found')
        if name is not None:
            existing.name = name
        if email is not None:
            existing.email = email
        if phone is not None:
            existing.phone = phone
        existing.save()
        existing.to_serializable_dict()

        return existing.to_dto()

    def create_onsite_contact(
        self, organization_id: str, name: str, email: str, phone: str
    ) -> OnsiteContactDTO:
        try:
            # Check that the organization does exist
            organization = User.objects(id=organization_id).first()
            if not organization:
                raise Exception(f'organization with id "{organization_id}" not found')

            new_contact = OnsiteContact(
                organization_id=organization_id,
                name=name,
                email=email,
                phone=phone,
            )
            dto = new_contact.to_dto() # does validation

            new_contact.save()

            return dto

        except Exception as error:
            self.logger.error(str(error))
            raise error
