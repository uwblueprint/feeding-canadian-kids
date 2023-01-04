from app.models.food_request import FoodRequest

"""
Unit tests for mongo FoodRequest model
"""


def test_create_food_request():
    test_date = "2022-10-17T16:00:00"

    kwargs = {
        "date": test_date,
        "portions": 50,
        "dietary_restrictions": "No beef",
        "is_open": True,
    }

    food_request = FoodRequest(**kwargs)

    assert food_request.date == test_date
    assert food_request.portions == 50
    assert food_request.dietary_restrictions == "No beef"
    assert food_request.is_open == True
