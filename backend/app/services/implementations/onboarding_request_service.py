from ...resources.validate_utils import validate_userinfo
from ...utilities.location_to_coordinates import getGeocodeFromAddress
from ...services.implementations.auth_service import AuthService
from ..interfaces.onboarding_request_service import IOnboardingRequestService
from ...models.onboarding_request import (
    OnboardingRequest,
    ONBOARDING_REQUEST_STATUS_APPROVED,
    ONBOARDING_REQUEST_STATUS_PENDING,
    ONBOARDING_REQUEST_STATUS_REJECTED,
)
from ...models.user_info import UserInfo
from ...graphql.types import SortDirection
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
        OnboardingRequest.ensure_indexes()

    def create_onboarding_request(self, userInfo: UserInfo):
        try:
            # Users will start out as active
            userInfo["active"] = True
            userInfo.active = True

            validation_errors = []
            validate_userinfo(userInfo, validation_errors)
            if validation_errors:
                raise Exception(
                    f"Error validating user info. Reason = {validation_errors}"
                )

            # Create initial UserInfo object
            user_info = UserInfo(
                email=userInfo.email,
                organization_address=userInfo.organization_address,
                organization_name=userInfo.organization_name,
                organization_desc=userInfo.organization_desc,
                organization_coordinates=getGeocodeFromAddress(
                    userInfo.organization_address
                ),
                role=userInfo.role,
                role_info=userInfo.role_info,
                primary_contact=userInfo.primary_contact,
                initial_onsite_contacts=userInfo.initial_onsite_contacts,
                active=userInfo.active,
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

    def get_all_onboarding_requests(
        self,
        number=9,
        offset=0,
        role="",
        status=[],
        sort_by_date_direction=SortDirection.ASCENDING,
    ):
        onboarding_request_dtos = []

        try:
            sort_prefix = "+"
            if sort_by_date_direction == SortDirection.DESCENDING:
                sort_prefix = "-"
            filteredRequests = OnboardingRequest.objects().order_by(
                f"{sort_prefix}date_submitted"
            )
            if role:
                filteredRequests = filteredRequests.filter(info__role=role)
            if status:
                filteredRequests = filteredRequests.filter(status__in=status)
            for request in filteredRequests.skip(offset).limit(number):
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
