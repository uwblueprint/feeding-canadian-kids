from datetime import datetime

from ...models.meal_request import MealRequest
from ...models.user import User
from ..interfaces.meal_request_service import IMealRequestService
from ...graphql.types import SortDirection
from ...resources.meal_request_dto import MealRequestDTO


class MealRequestService(IMealRequestService):
    def __init__(self, logger):
        self.logger = logger

    def create_meal_request(
        self,
        description,
        requestor_id,
        request_dates,
        meal_info,
        drop_off_time,
        drop_off_location,
        delivery_instructions,
        onsite_staff,
    ):
        try:
            # Create MealRequests
            requestor = User.objects(id=requestor_id).first()
            if not requestor:
                raise Exception(f'requestor "{requestor_id}" not found')

            meal_requests = []
            for request_date in request_dates:
                new_meal_request = MealRequest(
                    description=description,
                    requestor=requestor,
                    meal_info=meal_info,
                    drop_off_datetime=datetime.combine(request_date, drop_off_time),
                    drop_off_location=drop_off_location,
                    delivery_instructions=delivery_instructions,
                    onsite_staff=onsite_staff,
                )
                new_meal_request.save()
                meal_requests.append(new_meal_request.to_serializable_dict())
        except Exception as error:
            self.logger.error(str(error))
            raise error

        return meal_requests

    def get_meal_requests_by_requestor_id(
        self,
        requestor_id,
        min_drop_off_date,
        max_drop_off_date,
        status,
        offset,
        limit,
        sort_by_date_direction,
    ):
        try:
            sort_prefix = "+"
            if sort_by_date_direction == SortDirection.DESCENDING:
                sort_prefix = "-"

            requestor = User.objects(id=requestor_id).first()
            requests = MealRequest.objects(
                requestor=requestor,
                status__in=status,
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
                request_dict = request.to_serializable_dict()
                request_dict["requestor"] = requestor.to_serializable_dict()
                if "donation_info" in request_dict:
                    donor_id = request_dict["donation_info"]["donor"]
                    donor = User.objects(id=donor_id).first()
                    if not donor:
                        raise Exception(f'donor "{donor_id}" not found')
                    request_dict["donation_info"][
                        "donor"
                    ] = donor.to_serializable_dict()
                meal_request_dtos.append(MealRequestDTO(**request_dict))

            return meal_request_dtos

        except Exception as error:
            self.logger.error(str(error))
            raise error
