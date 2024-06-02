import mongoengine as mg
from datetime import datetime
from enum import Enum

from .onsite_contact import OnsiteContact
from ..resources.meal_request_dto import MealRequestDTO

from .user import User


class MealStatus(Enum):
    OPEN = "Open"
    UPCOMING = "Upcoming"
    FULFILLED = "Fulfilled"
    CANCELLED = "Cancelled"


MEAL_STATUSES_ENUMS = [status for status in MealStatus]
MEAL_STATUSES_STRINGS = [status.value for status in MealStatus]


# Information on the requested meals, provided by the ASP
class MealInfo(mg.EmbeddedDocument):
    portions = mg.IntField(required=True)
    dietary_restrictions = mg.StringField(default=None)


# Information on the donation once a donor has committed to the request
class DonationInfo(mg.EmbeddedDocument):
    donor = mg.ReferenceField(User, required=True)
    commitment_date = mg.DateTimeField(required=True)
    meal_description = mg.StringField(required=True)
    additional_info = mg.StringField(default=None)
    # https://docs.mongoengine.org/apireference.html#mongoengine.fields.ReferenceField
    donor_onsite_contacts = mg.ListField(
        mg.ReferenceField(OnsiteContact, required=True)
    )  # 4 = PULL


class MealRequest(mg.Document):
    requestor = mg.ReferenceField(User, required=True)
    # status = mg.EnumField(MealStatus, default=MealStatus.OPEN)
    status = mg.StringField(
        choices=MEAL_STATUSES_STRINGS, required=True, default=MealStatus.OPEN.value
    )

    drop_off_datetime = mg.DateTimeField(required=True)
    drop_off_location = mg.StringField(required=True)
    meal_info = mg.EmbeddedDocumentField(MealInfo, required=True)

    # https://docs.mongoengine.org/apireference.html#mongoengine.fields.ReferenceField
    onsite_contacts = mg.ListField(
        mg.ReferenceField(OnsiteContact, required=True, reverse_delete_rule=4)
    )  # 4 = PULL
    date_created = mg.DateTimeField(required=True, default=datetime.utcnow)
    date_updated = mg.DateTimeField(required=True, default=datetime.utcnow)
    delivery_instructions = mg.StringField(default=None)
    donation_info = mg.EmbeddedDocumentField(DonationInfo, default=None)

    def validate_onsite_contacts(self):
        if self.onsite_contacts:
            # Try to fetch the referenced document to ensure it exists, will throw an error if it doesn't
            for contact in self.onsite_contacts:
                contact = OnsiteContact.objects(id=contact.id).first()
                if not contact or contact.organization_id != self.requestor.id:
                    raise Exception(
                        f"onsite contact {contact.id} not found or not associated with the requestor's organization"
                    )

            if self.donation_info:
                for contact in self.donation_info.donor_onsite_contacts:
                    contact = OnsiteContact.objects(id=contact.id).first()
                    if (
                        not contact
                        or contact.organization_id != self.donation_info.donor.id
                    ):
                        raise Exception(
                            f"onsite contact {contact.id} not found or not associated with the donor organization"
                        )

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable

        ObjectId must be converted to a string.
        """
        meal_request_dict = self.to_mongo().to_dict()
        id = meal_request_dict.pop("_id", None)
        meal_request_dict["id"] = str(id)

        contacts = [contact.to_serializable_dict() for contact in self.onsite_contacts]
        meal_request_dict["onsite_contacts"] = contacts

        if self.donation_info and self.donation_info.donor_onsite_contacts:
            contacts = [
                contact.to_serializable_dict()
                for contact in self.donation_info.donor_onsite_contacts
            ]
            meal_request_dict["donation_info"]["donor_onsite_contacts"] = contacts

        return meal_request_dict

    def to_dto(self):
        dict = self.to_serializable_dict()
        requestor = User.objects(id=dict["requestor"]).first()

        if not requestor:
            raise Exception(f'requestor "{self.requestor.id}" not found')

        requestor_dict = requestor.to_serializable_dict()
        dict["requestor"] = requestor_dict

        if "donation_info" in dict:
            donor_id = dict["donation_info"]["donor"]
            donor = User.objects(id=donor_id).first()
            if not donor:
                raise Exception(f'donor "{donor_id}" not found')
            dict["donation_info"]["donor"] = donor.to_serializable_dict()

        return MealRequestDTO(**dict)

    meta = {"collection": "meal_requests"}
