import mongoengine as mg
from bson.objectid import ObjectId


class MealType(mg.EmbeddedDocument):
    tags = mg.ListField(mg.StringField(required=True))
    portions = mg.IntField(required=True)
    portions_fulfilled = mg.IntField(required=True, default=0)


class FoodRequest(mg.EmbeddedDocument):
    _id = mg.ObjectIdField(required=True, default=ObjectId)
    donor = mg.ObjectIdField()
    target_fulfillment_date = mg.DateTimeField(required=True)
    actual_fulfillment_date = mg.DateTimeField()
    meal_types = mg.EmbeddedDocumentListField(MealType, default=list)

    """
    Open: Request has not been completely fulfilled
    Fulfilled: All meal types have been fulfilled
    Cancelled: FoodRequest has been cancelled by the ASP
    """
    status = mg.StringField(
        choices=["Open", "Fulfilled", "Cancelled"], required=True, default="Open"
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
