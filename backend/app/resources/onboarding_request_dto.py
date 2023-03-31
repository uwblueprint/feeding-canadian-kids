import datetime
from ..models.onboarding_request import ONBOARDING_REQUEST_STATUSES
from .validate_utils import validate_userinfo


class OnboardingRequestDTO:
    def __init__(
        self,
        info,
        date_submitted,
        status,
    ):
        self.info = info
        self.date_submitted = date_submitted
        self.status = status

    def validate(self):
        error_list = validate_userinfo(self.info, [])

        if type(self.date_submitted) is not datetime.datetime:
            error_list.append("The date_submitted supplied is not a datetime object.")

        if type(self.status) not in ONBOARDING_REQUEST_STATUSES:
            error_list.append(
                f"The status is not one of {', '.join(ONBOARDING_REQUEST_STATUSES)}"
            )

        return error_list
