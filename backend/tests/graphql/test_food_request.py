"""
Tests for FoodRequestGroup GraphQL schema and query/mutation logic
Running graphql_schema.execute(...) also tests the service logic
"""
from datetime import datetime

def test_create_food_requests(mocker, graphql_schema):
    mutation = """
    mutation TestCreateFoodRequests{
  createFoodRequests(
    foodRequestData: {
      dates: [
        "2022-12-03T17:00:00",
        "2022-12-10T17:00:00",
        "2022-12-17T17:00:00",
      ],
      location: {
        latitude: 43.6544,
        longitude: 79.3807
      },
      requestorId: "63aa5fe315903d72c0be06a5",
      contacts: [
        {
          name: "John Smith",
          email: "johnsmith@gmail.com"
        }
      ],
      portions: 40,
      dietaryRestrictions: "No beef",
      deliveryNotes: "",
    }
  ) {
    foodRequests {
      id
      date
      location {
        latitude
        longitude
      }
      requestorId
      contacts {
        name
        email
      }
      portions
      portionsFulfilled
      dietaryRestrictions
      deliveryNotes
    }
  }
}
  """

    expected_dates = [
        "2022-12-03T17:00:00",
        "2022-12-10T17:00:00",
        "2022-12-17T17:00:00",
    ]
    expected_fields = {
        "location": {"latitude": 43.6544, "longitude": 79.3807},
        "requestorId": "somerequestorid",
        "contacts": [{"name": "John Smith", "email": "johnsmith@gmail.com"}],
        "portions": 40,
        "portionsFulfilled": 0,
        "dietaryRestrictions": "No beef",
        "deliveryNotes": "",
    }

    # mock the service layer to only test the graphql layer
    mock_service_result = [
        {
            "id": "someobjectid",
            "date": datetime.strptime(date, "%Y-%m-%dT%H:%M:%S"),
            "location": {"latitude": 43.6544, "longitude": 79.3807},
            "requestor_id": "somerequestorid",
            "contacts": [{"name": "John Smith", "email": "johnsmith@gmail.com"}],
            "portions": 40,
            "portions_fulfilled": 0,
            "dietary_restrictions": "No beef",
            "delivery_notes": "",
            "status": "OPEN",
            "is_open": True,
            "date_created": datetime.utcnow,
            "date_updated": datetime.utcnow,
        }
        for date in expected_dates
    ]
    mocker.patch(
        "app.services.implementations.food_request_service.FoodRequestService.create_food_requests",
        return_value=mock_service_result,
    )

    # execute the mutation
    result = graphql_schema.execute(mutation)
    assert result.errors is None

    # assertions
    food_requests = result.data["createFoodRequests"]["foodRequests"]
    assert len(food_requests) == len(expected_dates)

    for i, food_request in enumerate(food_requests):
        assert food_request["id"]
        assert food_request["date"] == expected_dates[i]
        for key in expected_fields:
            assert food_request[key] == expected_fields[key]

# TODO: test_get_food_requests
# test graphql context stuff
# def test_get_food_requests(mocker, graphql_schema):
#     query = """
#     query TestGetFoodRequests {
#   getFoodRequests(
#     limit: 10
#     offset: 0
#     status: OPEN
#     nearLocation: [43.6544, 79.3807]
#   ) {
#     foodRequests {
#       id
#       date
#       location {
#         latitude
#         longitude
#       }
#       requestorId
#       contacts {
#         name
#         email
#       }
#       portions
#       portionsFulfilled
#       dietaryRestrictions
#       deliveryNotes
#       dateCreated
#       dateUpdated
#       dateFulfilled
#     }
#   }
# }
#   """
