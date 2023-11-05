from app.graphql import schema as graphql_schema

"""
Tests for MealRequestchema and query/mutation logic
Running graphql_schema.execute(...) also tests the service logic
"""


def test_create_meal_request(user_setup):
    requestor, _, _ = user_setup

    mutation = f"""
    mutation testCreateMealRequest {{
      createMealRequest(
        deliveryInstructions: "Leave at front door",
        description: "Meal requests for office employees",
        dropOffLocation: "123 Main Street",
        dropOffTime: "16:30:00Z",
        mealInfo: {{
          portions: 40,
          dietaryRestrictions: "7 gluten free, 7 no beef",
          mealSuggestions: "Burritos"
        }},
        onsiteStaff: [
          {{
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1234567890"
          }},
          {{
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+9876543210"
          }}
        ],
        requestorId: "{str(requestor.id)}",
        requestDates: [
            "2023-06-01",
            "2023-06-02",
        ],
      )
      {{
        mealRequests {{
          status
          description
          id
          dropOffDatetime
          mealInfo {{
            portions
            dietaryRestrictions
            mealSuggestions
          }}
        }}
      }}
    }}
  """

    result = graphql_schema.execute(mutation)

    assert result.errors is None
    assert result.data["createMealRequest"]["mealRequests"][0]["status"] == "Open"
    assert (
        result.data["createMealRequest"]["mealRequests"][0]["description"]
        == "Meal requests for office employees"
    )
    assert (
        result.data["createMealRequest"]["mealRequests"][0]["mealInfo"]["portions"]
        == 40
    )
    assert (
        result.data["createMealRequest"]["mealRequests"][0]["mealInfo"][
            "dietaryRestrictions"
        ]
        == "7 gluten free, 7 no beef"
    )
    assert (
        result.data["createMealRequest"]["mealRequests"][0]["mealInfo"][
            "mealSuggestions"
        ]
        == "Burritos"
    )
    assert (
        result.data["createMealRequest"]["mealRequests"][0]["dropOffDatetime"]
        == "2023-06-01T16:30:00+00:00"
    )
    assert (
        result.data["createMealRequest"]["mealRequests"][1]["dropOffDatetime"]
        == "2023-06-02T16:30:00+00:00"
    )


def test_update_meal_request(user_setup):
    requestor, _, _ = user_setup
    create_meal_request_mutation = f"""
    mutation testCreateMealRequest {{
      createMealRequest(
        deliveryInstructions: "Leave at front door",
        description: "Meal requests for office employees",
        dropOffLocation: "123 Main Street",
        dropOffTime: "16:30:00Z",
        mealInfo: {{
          portions: 40,
          dietaryRestrictions: "7 gluten free, 7 no beef",
          mealSuggestions: "Burritos"
        }},
        onsiteStaff: [
          {{
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1234567890"
          }},
          {{
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+9876543210"
          }}
        ],
        requestorId: "{str(requestor.id)}",
        requestDates: [
            "2023-06-01",
            "2023-06-02",
        ],
      )
      {{
        mealRequests {{
          status
          description
          id
          dropOffDatetime
          mealInfo {{
            portions
            dietaryRestrictions
            mealSuggestions
          }}
        }}
      }}
    }}
  """

    create_meal_request_result = graphql_schema.execute(create_meal_request_mutation)
    print(create_meal_request_result)
    created_meal_request_id = create_meal_request_result.data["createMealRequest"][
        "mealRequests"
    ][0]["id"]
    mutation = f"""
    mutation testUpdateMealRequest {{
      updateMealRequest(
        deliveryInstructions: "Leave at front door",
        description: "Meal requests for charity",
        dropOffLocation: "123 Main Street",
        donationDatetime: "2023-10-31T16:45:00+00:00",
        mealInfo: {{portions: 40,
          dietaryRestrictions: "7 gluten free, 7 no beef",
          mealSuggestions: "Burritos"}},
        onsiteStaff: [
          {{name: "John Doe", email: "john.doe@example.com", phone: "+1234567890"}},
          {{name: "Jane Smith", email: "jane@example.com", phone: "+9876543210"}}],
        requestor: "507f1f77bcf86cd799439011",
        mealRequestId: "{created_meal_request_id}"
      )
      {{
        mealRequest {{
          status
          description
          id
          donationDatetime
          mealInfo {{
            portions
            dietaryRestrictions
            mealSuggestions
          }}
        }}
      }}
    }}
  """
    print(mutation)

    result = graphql_schema.execute(mutation)

    assert result.errors is None
    assert (
        result.data["updateMealRequest"]["mealRequest"]["description"]
        == "Meal requests for charity"
    )
    assert result.data["updateMealRequest"]["mealRequest"]["mealInfo"]["portions"] == 40
    assert (
        result.data["updateMealRequest"]["mealRequest"]["mealInfo"][
            "dietaryRestrictions"
        ]
        == "7 gluten free, 7 no beef"
    )
    assert (
        result.data["updateMealRequest"]["mealRequest"]["mealInfo"]["mealSuggestions"]
        == "Burritos"
    )
    assert (
        result.data["updateMealRequest"]["mealRequest"]["donationDatetime"]
        == "2023-10-31T16:45:00+00:00"
    )


def test_get_meal_request_failure(user_setup):
    requestor, _, _ = user_setup

    mutation = f"""
    mutation testCreateMealRequest {{
      createMealRequest(
        deliveryInstructions: "Leave at front door",
        description: "Meal requests for office employees",
        dropOffLocation: "123 Main Street",
        dropOffTime: "12:00:00Z",
        mealInfo: {{
          portions: 40,
          dietaryRestrictions: "7 gluten free, 7 no beef",
          mealSuggestions: "Burritos"
        }},
        onsiteStaff: [
          {{
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1234567890"
          }},
          {{
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+9876543210"
          }}
        ],
        requestorId: "{str(requestor.id)}",
        requestDates: [
            "2023-06-01",
            "2023-06-02",
        ],
      )
      {{
        mealRequests {{
          status
          description
          id
          mealInfo {{
            portions
            dietaryRestrictions
            mealSuggestions
          }}
          requests {{
            id
            donationDate
            status
          }}
        }}
      }}
    }}
    """
    result = graphql_schema.execute(mutation)
    result.errors is not None
