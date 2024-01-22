import mongoengine as mg
from datetime import datetime
from enum import Enum

from app.models.onsite_contact import OnsiteContact

from .user import User
from .user_info import Contact


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


class MealRequest(mg.Document):
    requestor = mg.ReferenceField(User, required=True)
    # status = mg.EnumField(MealStatus, default=MealStatus.OPEN)
    status= mg.StringField(
        choices=MEAL_STATUSES_STRINGS, required=True, default=MealStatus.OPEN.value
    )

    drop_off_datetime = mg.DateTimeField(required=True)
    drop_off_location = mg.StringField(required=True)
    meal_info = mg.EmbeddedDocumentField(MealInfo, required=True)
    onsite_staff = mg.ListField(mg.ReferenceField(OnsiteContact, required=True))
    date_created = mg.DateTimeField(required=True, default=datetime.utcnow)
    date_updated = mg.DateTimeField(required=True, default=datetime.utcnow)
    delivery_instructions = mg.StringField(default=None)
    donation_info = mg.EmbeddedDocumentField(DonationInfo, default=None)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable

        ObjectId must be converted to a string.
        """
        meal_request_dict = self.to_mongo().to_dict()
        id = meal_request_dict.pop("_id", None)
        meal_request_dict["id"] = str(id)
        return meal_request_dict

    meta = {"collection": "meal_requests"}
