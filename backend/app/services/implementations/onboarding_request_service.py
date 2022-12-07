from ..interfaces.onboarding_request_service import IOnboardingRequestService
from ...models.onboarding_request import OnboardingRequest
from ...models.user_info import UserInfo
from ...resources.onboarding_request_dto import OnboardingRequestDTO


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

    def get_all_onboarding_requests(self, number=5, offset=0, role="", status=""):
        onboarding_request_dtos = []

        try:
            if role and status:
                raise Exception("Cannot filter by both role and status")
            filteredRequests = OnboardingRequest.objects()
            if role:
                filteredRequests = filteredRequests.filter(info__role=role)
            if status:
                filteredRequests = filteredRequests.filter(status=status)
            for request in filteredRequests:
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
            return onboarding_request_dtos[offset: offset+number]
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
