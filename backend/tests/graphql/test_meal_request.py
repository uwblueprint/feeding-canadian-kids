"""
Tests for MealRequestGroup GraphQL schema and query/mutation logic
Running graphql_schema.execute(...) also tests the service logic
"""


def test_create_meal_request_group(graphql_schema):
    mutation = """
    mutation testCreateMealRequestGroup {
      createMealRequestGroup(
        deliveryInstructions: "Leave at front door",
        description: "Meal request group for office employees",
        dropOffLocation: "123 Main Street",
        dropOffTime: "12:00:00Z",
        mealInfo: {portions: 40,
          dietaryRestrictions: "7 gluten free, 7 no beef",
          mealSuggestions: "Burritos"},
        onsiteStaff: [
          {name: "John Doe", email: "john.doe@example.com", phone: "+1234567890"},
          {name: "Jane Smith", email: "jane.smith@example.com", phone: "+9876543210"}],
        requestor: "507f1f77bcf86cd799439011",
        requestDates: [
            "2023-06-01",
            "2023-06-02",
        ],
      )
      {
        mealRequestGroup {
          status
          description
          id
          mealInfo {
            portions
            dietaryRestrictions
            mealSuggestions
          }
          requests {
            id
            donationDate
            status
          }
        }
      }
    }
  """

    result = graphql_schema.execute(mutation)

    assert result.errors is None
    assert result.data["createMealRequestGroup"]["mealRequestGroup"]["status"] == "Open"
    assert (
        result.data["createMealRequestGroup"]["mealRequestGroup"]["description"]
        == "Meal request group for office employees"
    )
    assert (
        result.data["createMealRequestGroup"]["mealRequestGroup"]["mealInfo"][
            "portions"
        ]
        == 40
    )
    assert (
        result.data["createMealRequestGroup"]["mealRequestGroup"]["mealInfo"][
            "dietaryRestrictions"
        ]
        == "7 gluten free, 7 no beef"
    )
    assert (
        result.data["createMealRequestGroup"]["mealRequestGroup"]["mealInfo"][
            "mealSuggestions"
        ]
        == "Burritos"
    )
    assert (
        result.data["createMealRequestGroup"]["mealRequestGroup"]["requests"][0][
            "donationDate"
        ]
        == "2023-06-01"
    )
    assert (
        result.data["createMealRequestGroup"]["mealRequestGroup"]["requests"][0][
            "status"
        ]
        == "Open"
    )
    assert (
        result.data["createMealRequestGroup"]["mealRequestGroup"]["requests"][1][
            "donationDate"
        ]
        == "2023-06-02"
    )
    assert (
        result.data["createMealRequestGroup"]["mealRequestGroup"]["requests"][1][
            "status"
        ]
        == "Open"
    )


def test_get_meal_request_group_failure(graphql_schema):
    mutation = """
    mutation testCreateMealRequestGroup {
      createMealRequestGroup(
        deliveryInstructions: "Leave at front door",
        description: "Meal request group for office employees",
        dropOffLocation: "123 Main Street",
        dropOffTime: "12:00:00Z",
        mealInfo: {portions: 40,
          dietaryRestrictions: "7 gluten free, 7 no beef",
          mealSuggestions: "Burritos"},
        onsiteStaff: [
          {name: "John Doe", email: "john.doe@example.com", phone: "+1234567890"},
          {name: "Jane Smith", email: "jane.smith@example.com", phone: "+9876543210"}],
        requestor: "507f1f77bcf86cd799439011",
        requestDates: [
            "2023-06-01",
            "2023-06-02",
        ],
      )
      {
        mealRequestGroup {
          status
          description
          id
          mealInfo {
            portions
            dietaryRestrictions
            mealSuggestions
          }
          requests {
            id
            donationDate
            status
          }
        }
      }
    }
    """
    result = graphql_schema.execute(mutation)
    result.errors is not None
