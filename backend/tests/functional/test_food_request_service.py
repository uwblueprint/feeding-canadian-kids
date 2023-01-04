from flask import current_app
import pytest

from app.models.user import User
from app.models.user_info import ASPInfo
from app.services.implementations.user_service import UserService
from app.services.implementations.food_request_service import FoodRequestService

@pytest.fixture
def food_request_service():
    user_service = UserService(current_app.logger)
    food_request_service = FoodRequestService(current_app.logger, user_service)
    yield food_request_service

def create_asp():
	user = User(
		auth_id="A",
		id="63aa5fe315903d72c0be06a5",
		info=ASPInfo(
			contact_name="John Smith",
			contact_email="johnsmith@gmail.com",
			role="ASP",
			priority=1,
			location=[43.6544, 79.3807]
		)
	)
	user.save()

def test_create_food_request(food_request_service):
	food_request_data = {
		"dates": [
			"2022-12-03T17:00:00",
			"2022-12-10T17:00:00",
			"2022-12-17T17:00:00",
    	],
		"location": {
			"latitude": 123.456,
			"longitude": 123.456,
		},
		# "requestor_id": "63aa5fe315903d72c0be06a5",
		"contacts": [{"name": "John Smith", "email": "johnsmith@gmail.com"}],
        "portions": 40,
        "dietary_restrictions": "No beef",
        "delivery_notes": "",
	}
	res = food_request_service.create_food_requests(food_request_data)
	food_requests = list(res)
	assert len(food_requests) == 3
	for food_request in food_requests:
		for key in food_request_data:
			assert food_request[key] == food_request_data[key]
