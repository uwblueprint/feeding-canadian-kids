from typing import List

from app.utilities.format_onsite_contacts import (
    get_meal_request_snippet,
)
from app.utilities.get_onsite_contact_emails import (
    get_meal_request_asp_onsite_contact_emails,
    get_meal_request_donor_onsite_contact_emails,
)

from .email_service import EmailService
from ...models.meal_request import MealInfo, MealRequest
from ..interfaces.email_service import IEmailService
from ..interfaces.meal_request_service import IMealRequestService
from datetime import datetime, timedelta, timezone

from ...models.meal_request import DonationInfo, MealStatus
from ...models.user import User
from ...models.user_info import UserInfoRole
from ...graphql.types import SortDirection
from ...resources.meal_request_dto import MealRequestDTO


class MealRequestService(IMealRequestService):
    def __init__(self, logger, email_service: IEmailService):
        self.logger = logger
        self.email_service = email_service
        MealRequest.ensure_indexes()

    def create_meal_request(
        self,
        requestor_id,
        request_dates,
        meal_info,
        drop_off_time,
        delivery_instructions,
        onsite_contacts: List[str],
    ):
        try:
            # Verify that the requestor exists
            requestor = User.objects(id=requestor_id).first()
            if not requestor:
                raise Exception(f'Requestor "{requestor_id}" not found')

            if requestor.info.role != UserInfoRole.ASP.value:
                raise Exception(f'Requestor "{requestor_id}" is not an ASP')

            # Make sure the request dates do not contain duplicates
            if len(request_dates) != len(set(request_dates)):
                raise Exception("Cannot make multiple requests for the same date")

            # Verify and create MealRequests
            meal_requests = []
            for request_date in request_dates:
                # Make sure the request date is in the future
                request_datetime = datetime.combine(
                    request_date, drop_off_time, timezone.utc
                )

                if request_datetime < datetime.now(timezone.utc):
                    raise Exception("Request date must be in the future")

                # Verify that no meal request exists for the same requestor and drop-off date
                # check that no meal request exists in a 12 hour window centered at the request date time
                existing_request = MealRequest.objects(
                    requestor=requestor,
                    drop_off_datetime__gte=request_datetime - timedelta(hours=6),
                    drop_off_datetime__lte=request_datetime + timedelta(hours=6),
                ).first()
                if existing_request:
                    raise Exception(
                        f"Meal request already exists for this ASP on {existing_request.drop_off_datetime.isoformat()}"
                    )

                new_meal_request = MealRequest(
                    requestor=requestor,
                    meal_info=meal_info,
                    drop_off_datetime=datetime.combine(
                        request_date, drop_off_time, timezone.utc
                    ),
                    delivery_instructions=delivery_instructions,
                    onsite_contacts=onsite_contacts,
                )
                new_meal_request.validate_onsite_contacts()
                meal_requests.append(new_meal_request)

            # Save the meal requests
            for meal_request in meal_requests:
                meal_request.save()

            requestor.info.involved_meal_requests += len(meal_requests)
            requestor.save()

            return list(
                map(lambda request: request.to_serializable_dict(), meal_requests)
            )

        except Exception as error:
            self.logger.error(str(error))
            raise error

    def update_meal_request(
        self,
        requestor_id,
        meal_info,
        drop_off_datetime,
        delivery_instructions,
        onsite_contacts,
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

        if delivery_instructions is not None:
            original_meal_request.delivery_instructions = delivery_instructions

        if onsite_contacts is not None:
            original_meal_request.onsite_contacts = onsite_contacts

        meal_request_dto = original_meal_request.to_dto()
        original_meal_request.validate_onsite_contacts()

        original_meal_request.save()

        return meal_request_dto

    def update_meal_request_donation(
        self,
        requestor_id: str,
        meal_request_id,
        meal_description: str,
        additional_info: str,
        donor_onsite_contacts: List[str],
    ):
        original_meal_request = MealRequest.objects(id=meal_request_id).first()
        if not original_meal_request:
            raise Exception(f'Meal request "{meal_request_id}" not found')

        if not original_meal_request.donation_info:
            raise Exception("No donation info found")

        original_meal_request.donation_info = DonationInfo(
            donor=original_meal_request.donation_info.donor,
            commitment_date=original_meal_request.donation_info.commitment_date,
            meal_description=meal_description,
            additional_info=additional_info,
            donor_onsite_contacts=donor_onsite_contacts,
        )

        # Does validation,
        meal_request_dto = original_meal_request.to_dto()

        original_meal_request.validate_onsite_contacts()
        original_meal_request.save()

        return meal_request_dto

    def commit_to_meal_request(
        self,
        donor_id: str,
        meal_request_ids: List[str],
        meal_description: str,
        additional_info: str,
        donor_onsite_contacts: List[str],
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

                meal_request.donation_info = DonationInfo(
                    donor=donor,
                    commitment_date=datetime.utcnow(),
                    meal_description=meal_description,
                    additional_info=additional_info,
                    donor_onsite_contacts=donor_onsite_contacts,
                )
                # Change the meal request's status to "Upcoming"
                meal_request.status = MealStatus.UPCOMING.value

                self.send_donor_commit_email(
                    meal_request, donor.info.email, meal_requestor
                )
                self.send_requestor_commit_email(
                    meal_request, meal_requestor.info.email, meal_requestor
                )

                meal_request_dtos.append(meal_request.to_dto())
                meal_request.save()
            donor.info.involved_meal_requests += len(meal_request_dtos)
            donor.save()

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

            donor = User.objects(id=meal_request.donation_info.donor.id).first()
            donor.info.involved_meal_requests = max(
                donor.info.involved_meal_requests - 1, 0
            )
            donor.save()

            meal_request.donation_info = None
            meal_request.status = MealStatus.OPEN.value

            meal_request_dto = meal_request.to_dto()  # does validation
            meal_request.save()

            return meal_request_dto

        except Exception as error:
            self.logger.error(str(error))
            raise error

    def delete_meal_request(self, meal_request_id: str) -> MealRequestDTO:
        try:
            meal_request: MealRequest = MealRequest.objects(id=meal_request_id).first()
            if not meal_request:
                raise Exception(f'Meal request "{meal_request_id}" not found')

            requestor = User.objects(id=meal_request.requestor.id).first()
            requestor.info.involved_meal_requests = max(
                requestor.info.involved_meal_requests - 1, 0
            )
            requestor.save()

            meal_request.delete()

            meal_request_dto = meal_request.to_dto()

            return meal_request_dto

        except Exception as error:
            self.logger.error(str(error))
            raise error

    def get_meal_requests(
        self,
        min_drop_off_date,
        max_drop_off_date,
        status: List[MealStatus],
        offset,
        limit,
        sort_by_date_direction,
    ) -> List[MealRequestDTO]:
        status_value_list = list(map(lambda stat: stat.value, status))
        try:
            sort_prefix = "+"
            if sort_by_date_direction == SortDirection.DESCENDING:
                sort_prefix = "-"
            requests = MealRequest.objects(
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
                meal_request_dtos.append(request.to_dto())

            return meal_request_dtos

        except Exception as error:
            self.logger.error(str(error))
            raise error

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
                meal_request_dtos.append(request.to_dto())

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
                meal_request_dtos.append(request.to_dto())

            return meal_request_dtos

        except Exception as error:
            self.logger.error(str(error))
            raise error

    def get_meal_request_by_id(self, id: str) -> MealRequestDTO:
        meal_request = MealRequest.objects(id=id).first()

        return meal_request.to_dto()

    def get_meal_requests_by_ids(self, ids: str) -> List[MealRequestDTO]:
        meal_requests = MealRequest.objects(id__in=ids).all()
        meal_request_dtos = [meal_request.to_dto() for meal_request in meal_requests]

        return meal_request_dtos

    def send_donor_commit_email(self, meal_request: MealRequest, email, meal_requestor):
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
                meal_request_snippet=get_meal_request_snippet(meal_request),
            )
            self.email_service.send_email(
                email,
                "Thank you for committing to a meal request!",
                email_body,
                get_meal_request_donor_onsite_contact_emails(meal_request),
            )

        except Exception as e:
            self.logger.error(
                f"Failed to send committed to meal request email for user {meal_request.id if meal_request else ''} {email}"
            )
            raise e

    def send_requestor_commit_email(self, meal_request, email, meal_requestor):
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
                meal_request_snippet=get_meal_request_snippet(meal_request),
            )
            self.email_service.send_email(
                email,
                "Your meal request has been fulfilled!",
                email_body,
                get_meal_request_asp_onsite_contact_emails(meal_request),
            )
        except Exception as e:
            self.logger.error(
                f"Failed to send committed to meal request email for user {meal_request.id if meal_request else ''} {email}"
            )
            raise e

    def update_meal_request_statuses_to_fulfilled(self, current_time):
        """
        This method is called regularly (every 24 hours) to update the meal statues.
        """
        try:
            six_hours_before = current_time - timedelta(hours=6)
            meal_requests = MealRequest.objects(
                status=MealStatus.UPCOMING.value,
                drop_off_datetime__lte=six_hours_before,
            ).all()

            for meal_request in meal_requests:
                meal_request.status = MealStatus.FULFILLED.value
                meal_request.save()

        except Exception as error:
            self.logger.error(str(error))
            raise error
