import mongoengine as mg

from app.models.user_info import UserInfo


class User(mg.Document):
    auth_id = mg.StringField(required=True)
    info: UserInfo = mg.EmbeddedDocumentField(UserInfo, required=True)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable

        ObjectId must be converted to a string.
        """
        user_dict = self.to_mongo().to_dict()
        id = user_dict.pop("_id", None)
        user_dict["id"] = str(id)
        return user_dict

    meta = {"collection": "users"}
