import mongoengine as mg
import datetime

from .user_info import UserInfo


class OnboardingRequest(mg.Document):
    info = mg.EmbeddedDocumentField(UserInfo, required=True)
    date_submitted = mg.DateTimeField(default=datetime.datetime.now) 
    status = mg.StringField(choices=["Pending", "Approved", "Rejected"], required=True)

    # def to_serializable_dict(self):
    #     """
    #     Returns a dict representation of the document that is JSON serializable

    #     ObjectId must be converted to a string.
    #     """
    #     user_dict = self.to_mongo().to_dict()
    #     id = user_dict.pop("_id", None)
    #     user_dict["id"] = str(id)
    #     return user_dict

    # meta = {"collection": "users"}
