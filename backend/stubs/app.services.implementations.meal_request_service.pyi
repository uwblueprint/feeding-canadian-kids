from app.models.meal_request import MealRequest
from app.models.user import User
from app.resources.meal_request_dto import MealRequestDTO


class MealRequestService:
    def convert_meal_request_to_dto(
        self,
        request: MealRequest,
        requestor: User
    ) -> MealRequestDTO: ...
