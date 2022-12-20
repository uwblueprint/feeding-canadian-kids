from ..interfaces.onboarding_request_service import IOnboardingRequestService
from ...models.onboarding_request import OnboardingRequest
from ...models.user_info import UserInfo, ASPInfo, DonorInfo


class OnboardingRequestService(IOnboardingRequestService):
    def __init__(self, logger):
        """
        Create an instance of OnboardingRequestService

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger

    def create_onboarding_request(self, userInfo):
        try:
            # Create initial UserInfo object
            if userInfo.role == "Donor":
                lat, lng = userInfo.location["latitude"], userInfo.location["longitude"]
                user_info = DonorInfo(
                    contact_name=userInfo.contact_name,
                    contact_email=userInfo.contact_email,
                    contact_phone=userInfo.contact_phone,
                    role=userInfo.role,
                    location=[lat, lng],
                )
            elif userInfo.role == "ASP":
                lat, lng = userInfo.location["latitude"], userInfo.location["longitude"]
                user_info = ASPInfo(
                    contact_name=userInfo.contact_name,
                    contact_email=userInfo.contact_email,
                    contact_phone=userInfo.contact_phone,
                    role=userInfo.role,
                    priority=userInfo.priority,
                    location=[lat, lng],
                )
            else:
                user_info = UserInfo(
                    contact_name=userInfo.contact_name,
                    contact_email=userInfo.contact_email,
                    contact_phone=userInfo.contact_phone,
                    role=userInfo.role,
                )

            # Create OnboardingRequest object
            new_onboarding_request = OnboardingRequest(
                info=user_info,
                status="Pending",
            ).save()

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to create onboarding request. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

        return new_onboarding_request.to_serializable_dict()
