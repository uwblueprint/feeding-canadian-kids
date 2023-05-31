from ...models.food_request_group import FoodRequestGroup
from ...models.food_request import FoodRequest, MealType
from ..interfaces.food_request_service import IFoodRequestService


class FoodRequestService(IFoodRequestService):
    def __init__(self, logger):
        self.logger = logger

    # def create_food_request_group(self, description, requestor, commitments):
    #     try:
    #         # Create FoodRequestGroup
    #         new_food_request_group = FoodRequestGroup(
    #             description=description,
    #             # TODO: uncomment when we have users populated
    #             # requestor=requestor,
    #             status="Open",
    #         )

    #         # Create FoodRequests
    #         for commitment in commitments:
    #             meal_types = [
    #                 MealType(tags=meal_type.tags, portions=meal_type.portions)
    #                 for meal_type in commitment.meal_types
    #             ]
    #             new_food_request = FoodRequest(
    #                 target_fulfillment_date=commitment.date,
    #                 status="Open",
    #                 meal_types=meal_types,
    #             )
    #             new_food_request_group.requests.append(new_food_request)

    #         new_food_request_group.save()
    #     except Exception as error:
    #         self.logger.error(str(error))
    #         raise error

    #     return new_food_request_group.to_serializable_dict()
    
    def create_food_request_group(self, description, requestor, status, meal_info, frequency, days, drop_off_time, drop_off_location, delivery_instructions, start_date, end_date):
        # print("The type of meal_info is ", type(meal_info)["dietary_restrictions"])
        try:
            # # Convert dietary restrictions from list to dictionary
            # print(f"meal_info: ", meal_info)
            # restrictions_old = meal_info['dietary_restrictions']
            # restrictions = {}
            # for restriction in restrictions_old:
            #     restrictions[restriction['key']] = restriction['value']
            # meal_info['dietary_restrictions'] = restrictions
                
            # print("The type of meal_info is ", type(meal_info))
            
            # print("meal_info: ", meal_info)

            # Create FoodRequestGroup
            new_food_request_group = FoodRequestGroup(
                description=description,
                requestor=requestor,
                # requests=requests,
                status=status,
                frequency=frequency,
                days=days,
                drop_off_time=drop_off_time,
                drop_off_location=drop_off_location,
                delivery_instructions=delivery_instructions,
                start_date=start_date,
                end_date=end_date,
            )
            new_food_request_group.save()
        except Exception as error:
            self.logger.error(str(error))
            raise error
    
        return new_food_request_group.to_serializable_dict()            
                
        
