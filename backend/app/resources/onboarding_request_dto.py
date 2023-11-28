import datetime
from ..models.onboarding_request import ONBOARDING_REQUEST_STATUSES
from .validate_utils import validate_userinfo
from typing import Any, Dict, List


class OnboardingRequestDTO:
    def __init__(
        self,
        id: str,
        info: Dict[str, Any],
        date_submitted:     datetime.datetime,
        status: str,
    ) -> None:
        self.id = id
        self.info = info
        self.date_submitted = date_submitted
        self.status = status

        error_list = self.validate()
        if len(error_list) > 0:
            error_message = "\n".join(error_list)
            raise Exception(error_message)

    def validate(self) -> List[Any]:
        error_list = validate_userinfo(self.info, [])

        if type(self.id) is not str:
            error_list.append("The id supplied is not a string.")

        if type(self.date_submitted) is not datetime.datetime:
            error_list.append("The date_submitted supplied is not a datetime object.")

        if type(self.status) is not str:
            error_list.append("The status supplied is not a string.")

        if self.status not in ONBOARDING_REQUEST_STATUSES:
            error_list.append(
                "The status {self_status} is not one of {valid_statuses}".format(
                    self_status=self.status,
                    valid_statuses=", ".join(ONBOARDING_REQUEST_STATUSES),
                )
            )

        return error_list
