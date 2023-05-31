import mongoengine as mg
from .food_request import FoodRequest, MealType
from datetime import datetime
from .user_info import Contact
from bson.objectid import ObjectId

class FoodRequestGroup(mg.Document):
    _id = mg.ObjectIdField(required=True, default=ObjectId)
    description = mg.StringField(required=True)
    requestor = mg.ObjectIdField()  # The ASP making the request

    # TODO: make this required=True when we have users populated
    # requests = mg.EmbeddedDocumentListField(FoodRequest, default=list)

    """
    Open: At least one FoodRequest is open
    Fulfilled: All FoodRequests are fulfilled
    Cancelled: All FoodRequests are cancelled
    """
    status = mg.StringField(
        choices=["Open", "Fulfilled", "Cancelled"], required=True, default="Open"
    )
    
    # Donation Details
    # meal_info = mg.EmbeddedDocumentField(MealType, required=True) # MealType was updated to new schema
    frequency = mg.StringField(
        choices=["Does not repeat", "Weekly", "Monthly"], required=True, default="Does not repeat"
    )
    days = mg.ListField(mg.StringField(choices=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]))
    drop_off_time = mg.DateTimeField(required=True)
    drop_off_location = mg.StringField(required=True)
    delivery_instructions = mg.StringField(required=True)
    # onsite_staff = mg.EmbeddedDocumentField(Contact, required=True)
    
    # Start and end dates for recurring donations
    start_date = mg.DateTimeField(required=True)
    end_date = mg.DateTimeField(required=True)

    # Timestamps
    date_created = mg.DateTimeField(required=True, default=datetime.utcnow)
    date_updated = mg.DateTimeField(required=True, default=datetime.utcnow)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable

        ObjectId must be converted to a string.
        """
        food_request_group_dict = self.to_mongo().to_dict()
        id = food_request_group_dict.pop("_id", None)
        food_request_group_dict["id"] = str(id)
        
        for food_request_dict in food_request_group_dict["requests"]:
            id = food_request_dict.pop("_id", None)
            food_request_dict["id"] = str(id)
        return food_request_group_dict

    meta = {"collection": "food_request_groups"}


