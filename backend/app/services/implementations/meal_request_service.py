from ...models.meal_request_group import MealRequestGroup
from ...models.meal_request import MealRequest
from ..interfaces.meal_request_service import IMealRequestService
from datetime import datetime


class MealRequestService(IMealRequestService):
    def __init__(self, logger):
        self.logger = logger

    def create_meal_request_group(
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
            # Create MealRequestGroup
            new_meal_request_group = MealRequestGroup(
                description=description,
                requestor=requestor,
                requests=[
                    MealRequest(donation_date=request_date)
                    for request_date in request_dates
                ],
                meal_info=meal_info,
                # Convert the time into a datetime object (date does not matter here)
                drop_off_time=datetime.combine(
                    datetime.today().date(), drop_off_time),
                drop_off_location=drop_off_location,
                delivery_instructions=delivery_instructions,
                onsite_staff=onsite_staff,
            )
            new_meal_request_group.save()
            print(new_meal_request_group.to_serializable_dict())
        except Exception as error:
            self.logger.error(str(error))
            raise error

        return new_meal_request_group.to_serializable_dict()
