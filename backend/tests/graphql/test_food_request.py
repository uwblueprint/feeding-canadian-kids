"""
Tests for FoodRequestGroup GraphQL schema and query/mutation logic
Running graphql_schema.execute(...) also tests the service logic
"""


def test_create_food_request_group(graphql_schema):
    mutation = """
    mutation TestCreateFoodRequestGroup {
    createFoodRequestGroup(
        description: "sample food request",
        requestor: "0",
        commitments: [
        {
            date: "2022-10-17T16:00:00",
            mealTypes: [
            {
                tags: ["Beef", "Chicken"],
                portions: 50
            }
            {
                tags: ["Vegetarian"],
                portions: 20
            }
            ]
        },
        {
            date: "2022-10-17T16:00:00",
            mealTypes: [
            {
                tags: ["Halal"],
                portions: 100
            }
            {
                tags: ["Vegetarian"],
                portions: 30
            }
            ]
        }
        ]
    ) {
        foodRequestGroup {
        id
        description
        requests {
            id
            targetFulfillmentDate
            status
            mealTypes {
                tags
                portions
            }
        }
        }
    }
    }
  """
    expected_requests = [
        {
            "targetFulfillmentDate": "2022-10-17T16:00:00",
            "status": "Open",
            "mealTypes": [
                {"tags": ["Beef", "Chicken"], "portions": 50},
                {"tags": ["Vegetarian"], "portions": 20},
            ],
        },
        {
            "targetFulfillmentDate": "2022-10-17T16:00:00",
            "status": "Open",
            "mealTypes": [
                {"tags": ["Halal"], "portions": 100},
                {"tags": ["Vegetarian"], "portions": 30},
            ],
        },
    ]

    result = graphql_schema.execute(mutation)
    assert result.errors is None

    food_request_group = result.data["createFoodRequestGroup"]["foodRequestGroup"]

    # assert food_request_group values
    assert food_request_group["id"]
    assert food_request_group["description"] == "sample food request"

    # assert food_request values
    food_requests = food_request_group["requests"]
    assert len(food_requests) == len(expected_requests)

    for i in range(len(food_requests)):
        assert food_requests[i]["id"]
        assert (
            food_requests[i]["targetFulfillmentDate"]
            == expected_requests[i]["targetFulfillmentDate"]
        )
        assert food_requests[i]["mealTypes"] == expected_requests[i]["mealTypes"]
