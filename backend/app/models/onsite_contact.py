import mongoengine as mg

from ..resources.onsite_contact_dto import OnsiteContactDTO


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

    def to_dto(self) -> OnsiteContactDTO:
        return OnsiteContactDTO(**self.to_serializable_dict())  # type: ignore #

    def __str__(self):
        return f"OnsiteContact({self.id}, {self.organization_id}, {self.name}, {self.email}, {self.phone})"

    meta = {
        "indexes": [
            "organization_id",
        ],
        "collection": "onsite_contacts",
    }
