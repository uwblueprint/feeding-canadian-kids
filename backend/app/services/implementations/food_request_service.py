from ...models.food_request_group import FoodRequestGroup
from ...models.food_request import FoodRequest, MealType
from ..interfaces.food_request_service import IFoodRequestService

# TODO: implement get_food_requests and get_food_requests_by_user
# - ASPs will want to see all food requests
# TODO: modify onboarding request creation to include ASP+donor location 
# TODO: test query
# - create users
# - create food request groups
# - query food request groups (donor, admin, asp)
# - test limit, offset
# - test filtering by status
# - test sorting by priority + location
class FoodRequestService(IFoodRequestService):
    def __init__(self, logger, user_service):
        self.logger = logger
        self.user_service = user_service

    def create_food_request_group(self, description, location, requestor, commitments, notes):
        try:
            # Create FoodRequestGroup
            new_food_request_group = FoodRequestGroup(
                description=description,
                location = location, # TODO: initialize point field?
                requestor=requestor,
                status="Open",
                notes = notes if notes else "",
            )

            # Create FoodRequests
            for commitment in commitments:
                meal_types = [
                    MealType(tags=meal_type.tags, portions=meal_type.portions, portions_fulfilled=0)
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
    
    def get_food_request_groups(self, limit, offset, status=None, is_matched=None, near_location=None):
        try:
            result = FoodRequestGroup.objects()
            if status is not None:
                result = result.filter(status=status)
            if is_matched is not None:
                result = result.filter(donor__exists=is_matched)
            if near_location is not None:
                # TODO: adjust max distance
                result = result.filter(location__near=near_location, location__max_distance=15000) 

                def get_asp_priority(food_request_group):
                    requestor = self.user_service.get_user_by_id(food_request_group.requestor)
                    return requestor.priority
                
                # TODO: create custom sort on priority
                # def get_distance(food_request_group):
                    # return food_request_group.location.distance(near_location)

                sort_arr = map(lambda x: (x, get_asp_priority(x)), result)
                sort_arr.sort(key=lambda x: x[1])

            result = result[offset: offset+limit]
        except Exception as e:
            self.logger.error(str(e))
            raise e

        return map(lambda x: x.to_serializable_dict(), result)

    def get_food_request_groups_by_user(self, limit, offset, user_id, user_role, status):
        try:
            result = self.get_food_request_groups(status=status)
            if user_role == "ASP":
                return result.filter(requestor=user_id)
            elif user_role == "Donor":
                return result.filter(donor=user_id)

            result = result[offset: offset+limit]
        except Exception as e:
            self.logger.error(str(e))
            raise e

        return map(lambda x: x.to_serializable_dict(), result)

    # TODO: maybe it's better to ditch the food_request_group??
    # - think about this
    # - denormalizing is better than normalizing
    def get_food_requests(self, limit, offset, status=None):
        try:
            food_request_groups = FoodRequestGroup.objects()

            def denormalize_request_group(food_request_group):
                requests = map(lambda x: x.to_serializable_dict(), food_request_groups.requests)
                return map(lambda x: {**x, "food_request_group": food_request_group.to_serializable_dict()}, requests)


            result = map(lambda x: denormalize_request_group(x), food_request_groups)
            if status is not None:
                result = result.filter(status=status)

            result = result[offset: offset+limit]
        except Exception as e:
            self.logger.error(str(e))
            raise e

        return map(lambda x: x.to_serializable_dict(), result)
    
    def get_food_requests_by_user(self, limit, offset, user_id, user_role, status):
        try:
            result = self.get_food_requests(status=status)
            if user_role == "ASP":
                return result.filter(requestor=user_id)
            elif user_role == "Donor":
                return result.filter(donor=user_id)

            result = result[offset: offset+limit]
        except Exception as e:
            self.logger.error(str(e))
            raise e

        return map(lambda x: x.to_serializable_dict(), result)
        
