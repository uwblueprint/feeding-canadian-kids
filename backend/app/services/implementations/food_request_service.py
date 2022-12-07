from ...models.food_request_group import FoodRequestGroup
from ...models.food_request import FoodRequest, MealType
from ..interfaces.food_request_service import IFoodRequestService


class FoodRequestService(IFoodRequestService):
    def __init__(self, logger):
        self.logger = logger

    def create_food_request_group(self, description, requestor, commitments):
        try:
            # Create FoodRequestGroup
            new_food_request_group = FoodRequestGroup(
                description=description,
                # TODO: uncomment when we have users populated
                # requestor=requestor,
                status="Open",
            )

            # Create FoodRequests
            for commitment in commitments:
                meal_types = [
                    MealType(tags=meal_type.tags, portions=meal_type.portions)
                    for meal_type in commitment.meal_types
                ]
                new_food_request = FoodRequest(
                    target_fulfillment_date=commitment.date,
                    status="Open",
                    meal_types=meal_types,
                )
                new_food_request_group.requests.append(new_food_request)

            new_food_request_group.save()
        except Exception as error:
            self.logger.error(str(error))
            raise error

        return new_food_request_group.to_serializable_dict()

    def get_food_request_groups_by_user(self):
        pass

    def get_food_request_groups(self):
        pass

    def get_food_request_by_id(self, user_id, role, food_request_group_id):
        permission_granted = True
        try:
            result = FoodRequestGroup.objects.get(id=food_request_group_id)
            if role == "ASP":
                permission_granted = (user_id == result.requestor)
            elif role == "Donor":
                permission_granted = False
                for request in result.requests:
                    if user_id == request.donor:
                        permission_granted = True
                        break

            if permission_granted:
                return result
            else:
                raise Exception("Invalid permission")

        except Exception as error:
            self.logger.error(str(error))
            raise error