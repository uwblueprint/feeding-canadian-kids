from ..interfaces.onboarding_request_service import IOnboardingRequestService
from ...models.onboarding_request import OnboardingRequest
from ...models.user_info import UserInfo


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

    def get_all_onboarding_requests(self):
        onboarding_request_objects = []

        try:
            for request in OnboardingRequest.objects:
                request_dict = request.to_serializable_dict()
                onboarding_request_objects.append(request_dict)
        except Exception as e:
            self.logger.error("Could not retrieve OnboardingRequest objects")
            raise e
        return onboarding_request_objects

    def get_onboarding_request_by_id(self, id):
        try:
            request = OnboardingRequest.objects(id=id).first()

            if not request:
                raise Exception("request id {id} not found".format(id=id))

            return request.to_serializable_dict()
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get onboarding request. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e
