from ..interfaces.onboarding_request_service import IOnboardingRequestService
from ...models.onboarding_request import OnboardingRequest
from ...models.user_info import UserInfo
from ...resources.create_user_dto import CreateUserDTO
from ...services.interfaces.user_service import 
import random
import string


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

    def approve_onboarding_request(self, request_id):

        try:
        
            referenced_onboarding_request = OnboardingRequest.objects.get(id=request_id)

            
            referenced_onboarding_request.status = "Approved" #approve the onboarding request
            referenced_onboarding_request.save()

            # create a random password for the new user
            random_password = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))

            
            #create a new user from the onboarding request

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to approve onboarding request. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e
        
        return referenced_onboarding_request.to_serializable_dict()
        
        