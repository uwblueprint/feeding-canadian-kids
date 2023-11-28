import mongoengine as mg
import datetime

from .user_info import UserInfo
from typing import Dict, List, Union

ONBOARDING_REQUEST_STATUS_PENDING = "Pending"
ONBOARDING_REQUEST_STATUS_APPROVED = "Approved"
ONBOARDING_REQUEST_STATUS_REJECTED = "Rejected"
ONBOARDING_REQUEST_STATUSES = [
    ONBOARDING_REQUEST_STATUS_PENDING,
    ONBOARDING_REQUEST_STATUS_APPROVED,
    ONBOARDING_REQUEST_STATUS_REJECTED,
]


class OnboardingRequest(mg.Document):
    info = mg.EmbeddedDocumentField(UserInfo, required=True)
    date_submitted = mg.DateTimeField(default=datetime.datetime.now)
    status = mg.StringField(choices=ONBOARDING_REQUEST_STATUSES, required=True)

    def to_serializable_dict(self) -> Dict[str, Union[Dict[str, Union[str, List[float], Dict[str, Dict[str, int]], Dict[str, str], List[Dict[str, str]], bool]],     datetime.datetime, str, Dict[str, Union[str, List[float], Dict[str, Dict[str, Union[str, List[str]]]], Dict[str, str], List[Dict[str, str]], bool]], Dict[str, Union[str, List[float], Dict[str, str], List[Dict[str, str]], bool]]]]:
        """
        Returns a dict representation of the document that is JSON serializable

        ObjectId must be converted to a string.
        """
        onboarding_request_dict = self.to_mongo().to_dict()
        id = onboarding_request_dict.pop("_id", None)
        onboarding_request_dict["id"] = str(id)
        return onboarding_request_dict
