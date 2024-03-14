from typing import List
from app.services.interfaces.email_service import IEmailService
from app.services.implementations.email_service import EmailService
from ...models.meal_request import MealInfo, MealRequest
from ..interfaces.meal_request_service import IMealRequestService
from datetime import datetime

from ...models.meal_request import DonationInfo, MealStatus
from ...models.user import User
from ...models.user_info import UserInfoRole
from ...graphql.types import SortDirection
from ...resources.meal_request_dto import MealRequestDTO


class MealRequestService(IMealRequestService):
    def __init__(self, logger, email_service: IEmailService):
        self.logger = logger
        self.email_service = email_service

    def create_meal_request(
        self,
        requestor_id,
        request_dates,
        meal_info,
        drop_off_time,
        drop_off_location,
        delivery_instructions,
        onsite_staff: List[str],
    ):
        try:
            # Create MealRequests
            requestor = User.objects(id=requestor_id).first()
            if not requestor:
                raise Exception(f'requestor "{requestor_id}" not found')

            meal_requests = []
            for request_date in request_dates:
                new_meal_request = MealRequest(
                    requestor=requestor,
                    meal_info=meal_info,
                    drop_off_datetime=datetime.combine(request_date, drop_off_time),
                    drop_off_location=drop_off_location,
                    delivery_instructions=delivery_instructions,
                    onsite_staff=onsite_staff,
                )
                new_meal_request.validate_onsite_contacts()
                new_meal_request.save()
                meal_requests.append(new_meal_request.to_serializable_dict())
        except Exception as error:
            self.logger.error(str(error))
            raise error
        return meal_requests

    def update_meal_request(
        self,
        requestor_id,
        meal_info,
        drop_off_datetime,
        drop_off_location,
        delivery_instructions,
        onsite_staff,
        meal_request_id,
    ):
        original_meal_request: MealRequest = MealRequest.objects(
            id=meal_request_id, requestor=requestor_id
        ).first()

        if not original_meal_request:
            raise Exception(
                f"meal request with id {meal_request_id} by {requestor_id} not found"
            )

        if drop_off_datetime is not None:
            original_meal_request.drop_off_datetime = drop_off_datetime

        if meal_info is not None:
            original_meal_request.meal_info = MealInfo(
                portions=meal_info.portions,
                dietary_restrictions=meal_info.dietary_restrictions,
            )

        if drop_off_location is not None:
            original_meal_request.drop_off_location = drop_off_location

        if delivery_instructions is not None:
            original_meal_request.delivery_instructions = delivery_instructions

        if onsite_staff is not None:
            original_meal_request.onsite_staff = onsite_staff

        requestor = original_meal_request.requestor

        # Does validation,
        meal_request_dto = self.convert_meal_request_to_dto(
            original_meal_request, requestor
        )
        original_meal_request.validate_onsite_contacts()

        original_meal_request.save()

        return meal_request_dto

    def commit_to_meal_request(
        self,
        donor_id: str,
        meal_request_ids: [str],
        meal_description: str,
        additional_info: str,
    ) -> List[MealRequestDTO]:
        try:
            donor = User.objects(id=donor_id).first()
            if not donor:
                raise Exception(f'user "{donor_id}" not found')
            # The user committing to the meal request must have the "Donor" role
            if donor.info.role != UserInfoRole.DONOR.value:
                raise Exception(f'user "{donor_id}" is not a donor')

            if len(meal_request_ids) == 0:
                raise Exception("no meal requests to commit to")

            meal_request_dtos = []
            for meal_request_id in meal_request_ids:
                meal_request = MealRequest.objects(id=meal_request_id).first()
                if not meal_request:
                    raise Exception(f'meal request "{meal_request_id}" not found')
                # The meal request must be in the "Open" status
                if meal_request.status != MealStatus.OPEN.value:
                    raise Exception(
                        f'meal request "{meal_request_id}" is not open for commitment'
                    )
                meal_requestor_id = meal_request.requestor.id
                meal_requestor = User.objects(id=meal_requestor_id).first()

                self.send_donor_commit_email(meal_request, donor.info.email)
                self.send_requestor_commit_email(
                    meal_request, meal_requestor.info.email
                )

                meal_request.donation_info = DonationInfo(
                    donor=donor,
                    commitment_date=datetime.utcnow(),
                    meal_description=meal_description,
                    additional_info=additional_info,
                )

                # Change the meal request's status to "Upcoming"
                meal_request.status = MealStatus.UPCOMING.value

                meal_request_dtos.append(
                    self.convert_meal_request_to_dto(
                        meal_request, meal_request.requestor
                    )
                )

                meal_request.save()

            return meal_request_dtos

        except Exception as error:
            self.logger.error(str(error))
            raise error

    def cancel_donation(self, meal_request_id: str) -> MealRequestDTO:
        try:
            meal_request = MealRequest.objects(id=meal_request_id).first()
            if not meal_request:
                raise Exception(f'Meal request "{meal_request_id}" not found')

            if not meal_request.donation_info:
                raise Exception(
                    f'Meal request "{meal_request_id}" does not have a donation'
                )

            meal_request.donation_info = None

            meal_request_dto = self.convert_meal_request_to_dto(
                meal_request, meal_request.requestor
            )

            meal_request.save()

            return meal_request_dto

        except Exception as error:
            self.logger.error(str(error))
            raise error

    def delete_meal_request(self, meal_request_id: str) -> MealRequestDTO:
        try:
            meal_request = MealRequest.objects(id=meal_request_id).first()
            if not meal_request:
                raise Exception(f'Meal request "{meal_request_id}" not found')

            meal_request.delete()

            meal_request_dto = self.convert_meal_request_to_dto(
                meal_request, meal_request.requestor
            )

            return meal_request_dto

        except Exception as error:
            self.logger.error(str(error))
            raise error

    def convert_meal_request_to_dto(
        self, request: MealRequest, requestor: User
    ) -> MealRequestDTO:
        request_dict = request.to_serializable_dict()
        request_dict["requestor"] = requestor.to_serializable_dict()

        if "donation_info" in request_dict:
            donor_id = request_dict["donation_info"]["donor"]
            donor = User.objects(id=donor_id).first()
            if not donor:
                raise Exception(f'donor "{donor_id}" not found')
            request_dict["donation_info"]["donor"] = donor.to_serializable_dict()

        return MealRequestDTO(**request_dict)

    def get_meal_requests_by_requestor_id(
        self,
        requestor_id,
        min_drop_off_date,
        max_drop_off_date,
        status: List[MealStatus],
        offset,
        limit,
        sort_by_date_direction,
    ):
        status_value_list = list(map(lambda stat: stat.value, status))
        try:
            sort_prefix = "+"
            if sort_by_date_direction == SortDirection.DESCENDING:
                sort_prefix = "-"

            requestor = User.objects(id=requestor_id).first()
            requests = MealRequest.objects(
                requestor=requestor,
                status__in=status_value_list,
            ).order_by(f"{sort_prefix}drop_off_datetime")

            # Filter results by optional parameters.
            # Since we want to filter these optionally (i.e. filter only if specified),
            # we cannot include them in the query above.
            if min_drop_off_date is not None:
                requests = requests.filter(
                    drop_off_datetime__gte=min_drop_off_date,
                )
            if max_drop_off_date is not None:
                requests = requests.filter(
                    drop_off_datetime__lte=max_drop_off_date,
                )
            if limit is not None:
                requests = requests[offset : offset + limit]
            else:
                requests = requests[offset:]

            meal_request_dtos = []
            for request in requests:
                meal_request_dtos.append(
                    self.convert_meal_request_to_dto(request, requestor)
                )

            return meal_request_dtos

        except Exception as error:
            self.logger.error(str(error))
            raise error

    def get_meal_requests_by_donor_id(
        self,
        donor_id,
        min_drop_off_date,
        max_drop_off_date,
        status,
        offset,
        limit,
        sort_by_date_direction,
    ):
        status_value_list = list(map(lambda stat: stat.value, status))
        try:
            sort_prefix = "+"
            if sort_by_date_direction == SortDirection.DESCENDING:
                sort_prefix = "-"

            donor = User.objects(id=donor_id).first()
            requests = MealRequest.objects(
                donation_info__donor=donor,
                status__in=status_value_list,
            ).order_by(f"{sort_prefix}date_created")

            # Filter results by optional parameters.
            # Since we want to filter these optionally (i.e. filter only if specified),
            # we cannot include them in the query above.
            if min_drop_off_date is not None:
                requests = requests.filter(
                    drop_off_datetime__gte=min_drop_off_date,
                )
            if max_drop_off_date is not None:
                requests = requests.filter(
                    drop_off_datetime__lte=max_drop_off_date,
                )
            if limit is not None:
                requests = requests[offset : offset + limit]
            else:
                requests = requests[offset:]

            meal_request_dtos = []
            for request in requests:
                meal_request_dtos.append(
                    self.convert_meal_request_to_dto(request, donor)
                )

            return meal_request_dtos

        except Exception as error:
            self.logger.error(str(error))
            raise error

    def get_meal_request_by_id(self, id: str) -> MealRequestDTO:
        meal_request = MealRequest.objects(id=id).first()
        meal_request_dto = self.convert_meal_request_to_dto(
            meal_request, meal_request.requestor
        )

        return meal_request_dto

    def get_meal_requests_by_ids(self, ids: str) -> List[MealRequestDTO]:
        meal_requests = MealRequest.objects(id__in=ids).all()
        meal_request_dtos = [
            self.convert_meal_request_to_dto(meal_request, meal_request.requestor)
            for meal_request in meal_requests
        ]

        return meal_request_dtos

    def send_donor_commit_email(self, meal_request, email):
        if not self.email_service:
            error_message = """
                Attempted to call committed_to_meal_request but this
                instance of AuthService does not have an EmailService instance
                """
            self.logger.error(error_message)
            raise Exception(error_message)

        try:
            email_body = EmailService.read_email_template(
                "email_templates/committed_to_meal_request.html"
            ).format(
                dropoff_location=meal_request.drop_off_location,
                dropoff_time=meal_request.drop_off_datetime,
                num_meals=meal_request.meal_info.portions,
            )
            self.email_service.send_email(
                email, "Thank you for committing to a meal request!", email_body
            )

        except Exception as e:
            self.logger.error(
                f"Failed to send committed to meal request email for user {meal_request.id if meal_request else ''} {email}" 
            )
            raise e

    def send_requestor_commit_email(self, meal_request, email):
        if not self.email_service:
            error_message = """
                Attempted to call meal_request_success but this
                instance of AuthService does not have an EmailService instance
                """
            self.logger.error(error_message)
            raise Exception(error_message)

        try:
            email_body = EmailService.read_email_template(
                "email_templates/meal_request_success.html"
            ).format(
                dropoff_location=meal_request.drop_off_location,
                dropoff_time=meal_request.drop_off_datetime,
                num_meals=meal_request.meal_info.portions,
            )
            self.email_service.send_email(
                email, "Your meal request has been fulfilled!", email_body
            )
        except Exception as e:
            self.logger.error(
                f"Failed to send committed to meal request email for user {meal_request.id if meal_request else ''} {email}" 
            )
            raise e
