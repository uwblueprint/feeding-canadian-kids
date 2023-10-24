from datetime import datetime

from ...models.meal_request import MealRequest
from ..interfaces.meal_request_service import IMealRequestService
from ...graphql.types import SortDirection
from ...resources.meal_request_dto import MealRequestDTO


class MealRequestService(IMealRequestService):
    def __init__(self, logger):
        self.logger = logger

    def create_meal_request(
        self,
        description,
        requestor,
        request_dates,
        meal_info,
        drop_off_time,
        drop_off_location,
        delivery_instructions,
        onsite_staff,
    ):
        try:
            # Create MealRequests
            meal_requests = []
            for request_date in request_dates:
                new_meal_request = MealRequestModel(
                    description=description,
                    requestor=requestor,
                    meal_info=meal_info,
                    drop_off_datetime=datetime.combine(request_date, drop_off_time),
                    drop_off_location=drop_off_location,
                    delivery_instructions=delivery_instructions,
                    onsite_staff=onsite_staff,
                )
                new_meal_request.save()
                meal_requests.append(new_meal_request)
        except Exception as error:
            self.logger.error(str(error))
            raise error

        return map(lambda x: x.to_serializable_dict(), meal_requests)

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

            requests = MealRequest.objects(
                requestor=requestor_id,
                drop_off_datetime__gte=min_drop_off_date,
                drop_off_datetime__lte=max_drop_off_date,
                status__in=status,
            )[offset : offset + limit].order_by(f"{sort_prefix}date_created")

            meal_request_dtos = []
            for request in requests:
                request_dict = request.to_serializable_dict()
                meal_request_dtos.append(MealRequestDTO(**request_dict))

            return meal_request_dtos

        except Exception as error:
            self.logger.error(str(error))
            raise error
