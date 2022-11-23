import mongoengine as mg
from .food_request import FoodRequest
from datetime import datetime


# TODO: document why we have this separation between FoodRequestGroup and FoodRequest
class FoodRequestGroup(mg.Document):
    description = mg.StringField(required=True)

    # TODO: make this required=True when we have users populated
    requestor = mg.ObjectIdField()
    requests = mg.EmbeddedDocumentListField(FoodRequest, default=list)

    # TODO: make note about this change in the PR 
    donor = mg.ObjectIdField()

    date_created = mg.DateTimeField(required=True, default=datetime.utcnow)
    date_updated = mg.DateTimeField(required=True, default=datetime.utcnow)

    """
    Open: At least one FoodRequest is open
    Fulfilled: All FoodRequests are fulfilled
    Cancelled: All FoodRequests are cancelled
    """
    status = mg.StringField(
        choices=["Open", "Fulfilled", "Cancelled"], required=True, default="Open"
    )

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
