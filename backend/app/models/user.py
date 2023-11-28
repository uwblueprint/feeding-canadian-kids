import mongoengine as mg

from .user_info import UserInfo
from typing import Dict, List, Union


class User(mg.Document):
    auth_id = mg.StringField(required=True)
    info: UserInfo = mg.EmbeddedDocumentField(UserInfo, required=True)

    def to_serializable_dict(self) -> Dict[str, Union[str, Dict[str, Union[str, List[float], Dict[str, Dict[str, Union[str, List[str]]]], Dict[str, str], List[Dict[str, str]], bool]], Dict[str, Union[str, List[float], Dict[str, Dict[str, int]], Dict[str, str], List[Dict[str, str]], bool]], Dict[str, Union[str, List[float], Dict[str, str], List[Dict[str, str]], bool]]]]:
        """
        Returns a dict representation of the document that is JSON serializable

        ObjectId must be converted to a string.
        """
        user_dict = self.to_mongo().to_dict()
        id = user_dict.pop("_id", None)
        user_dict["id"] = str(id)
        return user_dict

    meta = {"collection": "users"}
