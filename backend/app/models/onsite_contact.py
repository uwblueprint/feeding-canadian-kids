import mongoengine as mg

from app.models.user import User

class OnsiteContact(mg.Document):
    organization_id = mg.ObjectIdField(required=True)
    name = mg.StringField(required=True)
    email = mg.StringField(required=True)
    phone = mg.StringField(required=True)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """

        dict = self.to_mongo().to_dict()
        id = dict.pop("_id", None)
        dict["id"] = str(id)
        
        # MongoDB ObjectId type is hard to work with graphQL so convert to a string
        dict["organization_id"] = str(dict["organization_id"])

        return dict

    meta = {"collection": "onsite_contacts"}