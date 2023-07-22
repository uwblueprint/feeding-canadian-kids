"""
Tests for FoodRequestGroup GraphQL schema and query/mutation logic
Running graphql_schema.execute(...) also tests the service logic
"""


def test_create_food_request_group(graphql_schema):
    mutation = """
    mutation testCreateFoodRequestGroup {
      createFoodRequestGroup(
        deliveryInstructions: "Leave at front door",
        description: "Food request group for office employees",
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
        foodRequestGroup {
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
    assert result.data["createFoodRequestGroup"]["foodRequestGroup"]["status"] == "Open"
    assert (
        result.data["createFoodRequestGroup"]["foodRequestGroup"]["description"]
        == "Food request group for office employees"
    )
    assert (
        result.data["createFoodRequestGroup"]["foodRequestGroup"]["mealInfo"]["portions"]
        == 40
    )
    assert (
        result.data["createFoodRequestGroup"]["foodRequestGroup"]["mealInfo"][
            "dietaryRestrictions"
        ]
        == "7 gluten free, 7 no beef"
    )
    assert (
        result.data["createFoodRequestGroup"]["foodRequestGroup"]["mealInfo"][
            "mealSuggestions"
        ]
        == "Burritos"
    )
    assert (
        result.data["createFoodRequestGroup"]["foodRequestGroup"]["requests"][0][
            "donationDate"
        ]
        == "2023-06-01"
    )
    assert (
        result.data["createFoodRequestGroup"]["foodRequestGroup"]["requests"][0][
            "status"
        ]
        == "Open"
    )
    assert (
        result.data["createFoodRequestGroup"]["foodRequestGroup"]["requests"][1][
            "donationDate"
        ]
        == "2023-06-02"
    )
    assert (
        result.data["createFoodRequestGroup"]["foodRequestGroup"]["requests"][1][
            "status"
        ]
        == "Open"
    )


def test_get_food_request_group_failure(graphql_schema):
    mutation = """
    mutation testCreateFoodRequestGroup {
      createFoodRequestGroup(
        deliveryInstructions: "Leave at front door",
        description: "Food request group for office employees",
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
        foodRequestGroup {
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
