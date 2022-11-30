from ..interfaces.onboarding_request_service import IOnboardingRequestService
from ...models.onboarding_request import OnboardingRequest
from ...models.user_info import UserInfo
from ...resources.create_user_dto import CreateUserDTO
from ..interfaces.email_service import IEmailService
from ..implementations.email_service import EmailService
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
                user_uid = "",
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
            
            # create a uid for the user
            random_user_uid = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(20))
            
            # set the uid for the user
            referenced_onboarding_request.user_uid = random_user_uid
            referenced_onboarding_request.save()

            # Send an email to the user with the email address. Instantiate the email service
            
            

            recipient_email = referenced_onboarding_request.info.contact_email
            email_subject = "Your account has been approved"
            email_body = "Your account has been approved. Please reset your password"
            

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to approve onboarding request. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e
        
        return referenced_onboarding_request.to_serializable_dict()
        
        