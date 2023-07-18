import mongoengine as mg
from bson.objectid import ObjectId


class MealType(mg.EmbeddedDocument):
    portions = mg.IntField(required=True)
    dietary_restrictions = mg.StringField(required=True, default="No restrictions")
    meal_suggestions = mg.StringField(required=True)


class FoodRequest(mg.EmbeddedDocument):
    _id = mg.ObjectIdField(required=True, default=ObjectId)
    # The date that the food is being
    donation_date = mg.DateField(required=True)
    """
    Open: Request has not been completely fulfilled
    Fulfilled: All meal types have been fulfilled
    Cancelled: FoodRequest has been cancelled by the ASP
    """
    status = mg.StringField(
        choices=["Open", "Fulfilled", "Cancelled"], required=True, default="Open"
    )
    donor_id = mg.ObjectIdField(required=False)
    commitment_date = mg.DateTimeField(required=False)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable

        ObjectId must be converted to a string.
        """
        food_request_dict = self.to_mongo().to_dict()
        id = food_request_dict.pop("_id", None)
        food_request_dict["id"] = str(id)
        return food_request_dict
