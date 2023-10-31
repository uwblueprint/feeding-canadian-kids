from ...models.user_info import Contact
from ...models.meal_request import MealRequest, MealType
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
                    donation_datetime=datetime.combine(request_date, drop_off_time),
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

    def update_meal_request(
        self,
        description,
        requestor,
        meal_info,
        donation_datetime,
        drop_off_location,
        delivery_instructions,
        onsite_staff,
        meal_request_id,
    ):
        original_meal_request = MealRequest.objects(_id=meal_request_id).first()

        if description is not None:
            original_meal_request.description = description

        if requestor is not None:
            original_meal_request.requestor = requestor

        if donation_datetime is not None:
            original_meal_request.donation_datetime = donation_datetime

        if meal_info is not None:
            original_meal_request.meal_info = MealType(
                portions=meal_info.portions,
                dietary_restrictions=meal_info.dietary_restrictions,
                meal_suggestions=meal_info.meal_suggestions,
            )

        if drop_off_location is not None:
            original_meal_request.drop_off_location = drop_off_location

        if delivery_instructions is not None:
            original_meal_request.delivery_instructions = delivery_instructions

        if onsite_staff is not None:
            original_meal_request.onsite_staff = [
                Contact(name=staff.name, phone=staff.phone, email=staff.email)
                for staff in onsite_staff
            ]

        original_meal_request.save()

        return original_meal_request.to_serializable_dict()
        # look at update user by id array notation
