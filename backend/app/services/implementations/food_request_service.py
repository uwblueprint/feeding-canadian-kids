from ...models.food_request_group import FoodRequestGroup
from ...models.food_request import FoodRequest
from ..interfaces.food_request_service import IFoodRequestService
from datetime import datetime


class FoodRequestService(IFoodRequestService):
    def __init__(self, logger):
        self.logger = logger

    def create_food_request_group(
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
            # Create FoodRequestGroup
            new_food_request_group = FoodRequestGroup(
                description=description,
                requestor=requestor,
                requests=[
                    FoodRequest(donation_date=request_date)
                    for request_date in request_dates
                ],
                meal_info=meal_info,
                # Convert the time into a datetime object (date does not matter here)
                drop_off_time=datetime.combine(datetime.today().date(), drop_off_time),
                drop_off_location=drop_off_location,
                delivery_instructions=delivery_instructions,
                onsite_staff=onsite_staff,
            )
            new_food_request_group.save()
            print(new_food_request_group.to_serializable_dict())
        except Exception as error:
            self.logger.error(str(error))
            raise error

        return new_food_request_group.to_serializable_dict()
