import mongoengine as mg
from .meal_request import MealRequest, MealType
from datetime import datetime
from .user_info import Contact
from bson.objectid import ObjectId


class MealRequestGroup(mg.Document):
    _id = mg.ObjectIdField(required=True, default=ObjectId)
    description = mg.StringField(required=True)
    requestor = mg.ObjectIdField()  # The ASP making the request

    # TODO: make this required=True when we have users populated
    requests = mg.EmbeddedDocumentListField(MealRequest, default=list)

    """
    Open: At least one MealRequest is open
    Fulfilled: All MealRequests are fulfilled
    Cancelled: All MealRequests are cancelled
    """
    status = mg.StringField(
        choices=["Open", "Fulfilled", "Cancelled"], required=True, default="Open"
    )

    # Donation Details
    meal_info = mg.EmbeddedDocumentField(MealType, required=True)
    drop_off_time = mg.DateTimeField(required=True)
    drop_off_location = mg.StringField(required=True)
    delivery_instructions = mg.StringField(required=True)
    onsite_staff = mg.EmbeddedDocumentListField(Contact, required=True)

    # Timestamps
    date_created = mg.DateTimeField(required=True, default=datetime.utcnow)
    date_updated = mg.DateTimeField(required=True, default=datetime.utcnow)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable

        ObjectId must be converted to a string.
        """
        meal_request_group_dict = self.to_mongo().to_dict()
        id = meal_request_group_dict.pop("_id", None)
        meal_request_group_dict["id"] = str(id)

        for meal_request_dict in meal_request_group_dict["requests"]:
            id = meal_request_dict.pop("_id", None)
            meal_request_dict["id"] = str(id)
        return meal_request_group_dict

    meta = {"collection": "meal_request_groups"}
