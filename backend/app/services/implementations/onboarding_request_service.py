from ...services.implementations.auth_service import AuthService
from ..interfaces.onboarding_request_service import IOnboardingRequestService
from ...models.onboarding_request import (
    OnboardingRequest,
    ONBOARDING_REQUEST_STATUS_APPROVED,
    ONBOARDING_REQUEST_STATUS_PENDING,
    ONBOARDING_REQUEST_STATUS_REJECTED,
)
from ...models.user_info import UserInfo
from ...resources.onboarding_request_dto import OnboardingRequestDTO


class OnboardingRequestService(IOnboardingRequestService):
    def __init__(self, logger, email_service):
        """
        Create an instance of OnboardingRequestService

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger
        self.email_service = email_service

    def create_onboarding_request(self, userInfo):
        if UserInfo.objects(email__iexact=userInfo.email).count() > 0:
            error_message = f"""
                Failed to create onboarding request.
                Reason = email {userInfo.email} already exists
                """
            self.logger.error(error_message)
            raise Exception(error_message)
        try:
            # Create initial UserInfo object
            user_info = UserInfo(
                email=userInfo.email,
                organization_address=userInfo.organization_address,
                organization_name=userInfo.organization_name,
                role=userInfo.role,
                primary_contact=userInfo.primary_contact,
                onsite_contacts=userInfo.onsite_contacts,
            )
            # Create OnboardingRequest object
            new_onboarding_request = OnboardingRequest(
                info=user_info,
                status=ONBOARDING_REQUEST_STATUS_PENDING,
            ).save()
            request_dict = new_onboarding_request.to_serializable_dict()
            return OnboardingRequestDTO(**request_dict)

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to create onboarding request. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

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
                onboarding_request_dtos.append(OnboardingRequestDTO(**request_dict))

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                """
                Could not retrieve OnboardingRequest objects.
                Reason = {reason}
                """.format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e
        if number > 0:
            return onboarding_request_dtos[offset : offset + number]
        return onboarding_request_dtos

    def get_onboarding_request_by_id(self, id):
        try:
            request = OnboardingRequest.objects(id=id).first()

            if not request:
                error_message = f"request id {id} not found"
                self.logger.error(error_message)
                raise Exception(error_message)

            request_dict = request.to_serializable_dict()
            return OnboardingRequestDTO(**request_dict)

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get onboarding request. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def approve_onboarding_request(self, request_id):
        try:
            referenced_onboarding_request = OnboardingRequest.objects(
                id=request_id
            ).first()
            referenced_onboarding_request.status = (
                ONBOARDING_REQUEST_STATUS_APPROVED  # approve the onboarding request
            )

            referenced_onboarding_request.save()  # save the changes

            recipient_email = referenced_onboarding_request.info.email
            AuthService.send_onboarding_request_approve_email(
                self, request_id, recipient_email
            )
            request_dict = referenced_onboarding_request.to_serializable_dict()
            return OnboardingRequestDTO(**request_dict)

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to approve onboarding request. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def reject_onboarding_request(self, request_id):
        try:
            referenced_onboarding_request = OnboardingRequest.objects(
                id=request_id
            ).first()

            referenced_onboarding_request.status = (
                ONBOARDING_REQUEST_STATUS_REJECTED  # reject the onboarding request
            )

            referenced_onboarding_request.save()  # save the changes

            recipient_email = referenced_onboarding_request.info.email

            AuthService.send_onboarding_request_rejected_email(self, recipient_email)
            request_dict = referenced_onboarding_request.to_serializable_dict()
            return OnboardingRequestDTO(**request_dict)

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to reject onboarding request. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e
