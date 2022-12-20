import mongoengine as mg
from datetime import datetime

class ContactInfo(mg.EmbeddedDocument):
    name = mg.StringField(required=True)
    email = mg.StringField(required=True)
    phone = mg.StringField()



class FoodRequest(mg.Document):
    date = mg.DateTimeField(required=True)
    location = mg.PointField(required=True)
    requestor_id = mg.ObjectIdField(required=True)
    contacts = mg.EmbeddedDocumentListField(ContactInfo)

    # TODO: this currently only supports 1:1 matching, but we should support 1:N matching
    donor_id = mg.ObjectIdField()

    portions = mg.IntField(required=True)
    portions_fulfilled = mg.IntField(required=True)

    date_created = mg.DateTimeField(required=True)
    date_updated = mg.DateTimeField(required=True)
    date_fulfilled = mg.DateTimeField()

    dietary_restrictions = mg.StringField(required=True)
    delivery_notes = mg.StringField(required=True)

    # indicates whether the food request is open or closed
    is_open = mg.BooleanField(required=True)

    priority = mg.IntField(required=True)

    def save(self, *args, **kwargs):
        now = datetime.utcnow
        # fill in date fields if they are not already set
        if not self.date_created:
            self.date_created = now
        self.date_updated = now

        # if the food request is fulfilled, set the date_fulfilled field
        if self.portions_fulfilled >= self.portions:
            self.date_fulfilled = now

        # if the food request is fulfilled, set the is_open field to false
        if self.date_fulfilled:
            self.is_open = False

        return super(FoodRequest, self).save(*args, **kwargs)

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
