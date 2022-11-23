import mongoengine as mg
from datetime import datetime

class FoodRequest(mg.Document):
    date = mg.DateTimeField(required=True)
    location = mg.PointField(required=True)
    requestor_id = mg.ObjectIdField(required=True)
    donor_id = mg.ObjectIdField()

    # TODO: do we need primary contact info? and additional info

    portions = mg.IntField(required=True)
    portions_fulfilled = mg.IntField(required=True)

    date_created = mg.DateTimeField(required=True, default=datetime.utcnow)
    date_updated = mg.DateTimeField(required=True, default=datetime.utcnow)
    date_fulfilled = mg.DateTimeField()

    dietary_restrictions = mg.StringField()
    delivery_notes = mg.StringField()

    # TODO: what other statuses do we need?
    """
    Open: Request has not been completely fulfilled
    Closed: FoodRequest has been fulfilled OR cancelled by the ASP/Admin
    """
    status = mg.StringField(
        choices=["Open", "Closed"], required=True, default="Open"
    )

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable

        ObjectId must be converted to a string.
        """
        food_request_dict = self.to_mongo().to_dict()
        id = food_request_dict.pop("_id", None)
        food_request_dict["id"] = str(id)
        return food_request_dict

    meta = {"collection": "food_requests"}
