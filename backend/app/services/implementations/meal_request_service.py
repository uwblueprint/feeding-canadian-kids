from ...models.meal_request import MealRequest
from ..interfaces.meal_request_service import IMealRequestService
from datetime import datetime


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
                new_meal_request = MealRequest(
                    description=description,
                    requestor=requestor,
                    meal_info=meal_info,
                    donation_datetime=datetime.combine(
                        request_date, drop_off_time),
                    drop_off_location=drop_off_location,
                    delivery_instructions=delivery_instructions,
                    onsite_staff=onsite_staff,
                )
                new_meal_request.save()
                print(new_meal_request.to_serializable_dict())
                meal_requests.append(new_meal_request)
        except Exception as error:
            self.logger.error(str(error))
            raise error

        return map(lambda x: x.to_serializable_dict(), meal_requests)
