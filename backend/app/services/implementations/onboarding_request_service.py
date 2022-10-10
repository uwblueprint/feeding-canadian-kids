import firebase_admin.auth

from ..interfaces.onboarding_request_service import IOnboardingRequestService
from ...models.onboarding_request import OnboardingRequest
from ...models.user_info import UserInfo
from ...resources.onboarding_request_dto import OnboardingRequestDTO # TODO

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
            user_info = UserInfo(
                    contact_name=userInfo.contact_name,
                    contact_email=userInfo.contact_email,
                    contact_phone=userInfo.contact_phone,
                    role=userInfo.role,
                )
 
            new_onboarding_request = OnboardingRequest(
                user_info=user_info,
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

        new_onboarding_request_dict = OnboardingRequest.objects.get(id=new_onboarding_request.id).to_mongo().to_dict()
        return OnboardingRequestDTO(**new_onboarding_request_dict)
        

        

        

    

    
