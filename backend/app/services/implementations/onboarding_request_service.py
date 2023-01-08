from ..interfaces.onboarding_request_service import IOnboardingRequestService
from ...models.onboarding_request import OnboardingRequest
from ...models.user_info import UserInfo
from ...resources.create_user_dto import CreateUserDTO
from ..implementations.email_service import EmailService
from ..implementations.auth_service import AuthService
from ...utilities.firebase_rest_client import FirebaseRestClient
import random
import string


class OnboardingRequestService(IOnboardingRequestService):
    def __init__(self, logger, email_service=None):
        """
        Create an instance of OnboardingRequestService

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger
        self.email_service = email_service
        self.firebase_rest_client = FirebaseRestClient(logger)



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

            print(OnboardingRequest.objects.get(id=request_id).status)
            
            referenced_onboarding_request.status = "Approved" #approve the onboarding request
            
            # create a uid for the user
            random_user_uid = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(20))
            
            # set the uid for the user
            referenced_onboarding_request.user_uid = random_user_uid
            referenced_onboarding_request.save()            
            recipient_email = referenced_onboarding_request.info.contact_email
            AuthService.reset_password(self, recipient_email)            

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to approve onboarding request. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

        return referenced_onboarding_request.to_serializable_dict()
    def get_all_onboarding_requests(self, number=None, offset=0, role="", status=""):
        onboarding_request_dtos = []

        try:
            filteredRequests = OnboardingRequest.objects()
            if role:
                filteredRequests = filteredRequests.filter(info__role=role)
            if status:
                filteredRequests = filteredRequests.filter(status=status)
            for request in filteredRequests.skip(offset).limit(number or 0):
                request_dict = request.to_serializable_dict()
                kwargs = {
                    "contact_name": request_dict["info"]["contact_name"],
                    "contact_email": request_dict["info"]["contact_email"],
                    "contact_phone": request_dict["info"]["contact_phone"],
                    "role": request_dict["info"]["role"],
                    "date_submitted": request_dict["date_submitted"],
                    "status": request_dict["status"],
                }
                onboarding_request_dtos.append(OnboardingRequestDTO(**kwargs))
        except Exception as e:
            self.logger.error("Could not retrieve OnboardingRequest objects")
            raise e
        if number > 0:
            return onboarding_request_dtos[offset : offset + number]
        return onboarding_request_dtos

    def get_onboarding_request_by_id(self, id):
        try:
            request = OnboardingRequest.objects(id=id).first()

            if not request:
                raise Exception("request id {id} not found".format(id=id))

            request_dict = request.to_serializable_dict()

            kwargs = {
                "contact_name": request_dict["info"]["contact_name"],
                "contact_email": request_dict["info"]["contact_email"],
                "contact_phone": request_dict["info"]["contact_phone"],
                "role": request_dict["info"]["role"],
                "date_submitted": request_dict["date_submitted"],
                "status": request_dict["status"],
            }
            return OnboardingRequestDTO(**kwargs)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get onboarding request. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e
