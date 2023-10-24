import mongoengine as mg
from datetime import datetime
from .user_info import Contact
from bson.objectid import ObjectId


class MealType(mg.EmbeddedDocument):
    portions = mg.IntField(required=True)
    dietary_restrictions = mg.StringField(required=True, default="No restrictions")
    meal_suggestions = mg.StringField(required=True)


class MealRequest(mg.Document):
    _id = mg.ObjectIdField(required=True, default=ObjectId)
    description = mg.StringField(required=True)
    requestor = mg.ObjectIdField()  # The ASP making the request

    # Donor Info
    donor_id = mg.ObjectIdField(required=False)
    # The date that the donor committed to fulfilling the request
    commitment_date = mg.DateTimeField(required=False)

    # Donation Details
    """
    Open: At least one MealRequest is open
    Fulfilled: All MealRequests are fulfilled
    Cancelled: All MealRequests are cancelled
    """
    status = mg.StringField(
        choices=["Open", "Fulfilled", "Cancelled"], required=True, default="Open"
    )
    meal_info = mg.EmbeddedDocumentField(MealType, required=True)
    # The date that the meal is being delivered
    donation_datetime = mg.DateTimeField(required=True)
    drop_off_location = mg.StringField(required=True)
    delivery_instructions = mg.StringField(required=True)
    onsite_staff = mg.ListField(mg.ObjectIdField(), required=True)

    # Timestamps
    date_created = mg.DateTimeField(required=True, default=datetime.utcnow)
    date_updated = mg.DateTimeField(required=True, default=datetime.utcnow)

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
