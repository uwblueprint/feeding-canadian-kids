from app.models.food_request import MealType, FoodRequest
from app.models.food_request_group import FoodRequestGroup

"""
Unit tests for FoodRequestGroup and FoodRequest mongo models
"""


def test_create_food_request_group():
    MealTypeExample = {"tags": ["Beef", "Chicken"], "portions": 50}

    test_date = "2022-10-17T16:00:00"

    FoodRequestExample = {
        "target_fulfillment_date": test_date,
        "meal_types": MealType(**MealTypeExample),
    }

    FoodRequestGroupExample = {
        "description": "sample_food_request",
        "requests": [FoodRequest(**FoodRequestExample)],
    }

    food_request_group = FoodRequestGroup(**FoodRequestGroupExample)

    assert food_request_group.description == "sample_food_request"
    assert food_request_group.status == "Open"

    food_requests = food_request_group.requests

    assert food_requests[0].status == "Open"
    assert food_requests[0].target_fulfillment_date == test_date

    meal_types = food_requests[0].meal_types

    assert meal_types.portions == 50
    assert meal_types.portions_fulfilled == 0
    assert meal_types.tags == ["Beef", "Chicken"]
