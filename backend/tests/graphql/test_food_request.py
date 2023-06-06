"""
Tests for FoodRequestGroup GraphQL schema and query/mutation logic
Running graphql_schema.execute(...) also tests the service logic
"""


def test_create_food_request_group(graphql_schema):
    mutation = """
    mutation testCreateFoodRequestGroup {
      createFoodRequestGroup(
        days: ["Monday", "Wednesday", "Friday"], 
        deliveryInstructions: "Leave at front door", 
        description: "Food request group for office employees", 
        dropOffLocation: "123 Main Street", 
        dropOffTime: "2023-06-01T12:00:00Z", 
        endDate: "2023-06-30T23:59:59Z", 
        frequency: "Weekly", 
        mealInfo: {portions: 40, 
          dietaryRestrictions: "{\\"Gluten Free\\": 7, \\"No Beef\\": 8, \\"Vegetarian\\": 10}",
          mealSuggestions: "Burritos"}, 
        onsiteStaff: [
          {name: "John Doe", email: "john.doe@example.com", phone: "+1234567890"}, 
          {name: "Jane Smith", email: "jane.smith@example.com", phone: "+9876543210"}], 
        requestor: "507f1f77bcf86cd799439011", 
        requests: [
          {donationDate: "2023-06-01T00:00:00Z", status: "Open", donorId: "507f191e810c19729de860ea", commitmentDate: "2023-06-01T00:00:00Z"}
        ], 
        startDate: "2023-06-01T00:00:00Z", 
        status: "Open") 
      {
        foodRequestGroup {
          status
          description
          id
          requests {
            id
            mealTypes {
              tags
              portions
            }
          }
        }
      }
    }
  """

    result = graphql_schema.execute(mutation)

    assert result.errors is None


def test_get_food_request_group_failure(graphql_schema):
    mutation = """
    mutation testCreateFoodRequestGroup {
      createFoodRequestGroup(
        days: ["Monday", "Wednesday", "Friday"], 
        deliveryInstructions: "Leave at front door", 
        description: "Food request group for office employees", 
        dropOffLocation: "123 Main Street", 
        dropOffTime: "2023-06-01T12:00:00Z", 
        endDate: "2023-06-30T23:59:59Z", 
        frequency: "Daily", 
        mealInfo: {portions: 40, 
          dietaryRestrictions: "{\\"Gluten Free\\": 7, \\"No Beef\\": 8, \\"Vegetarian\\": 10}",
          mealSuggestions: "Burritos"}, 
        onsiteStaff: [
          {name: "John Doe", email: "john.doe@example.com", phone: "+1234567890"}, 
          {name: "Jane Smith", email: "jane.smith@example.com", phone: "+9876543210"}], 
        requestor: "507f1f77bcf86cd799439011", 
        requests: [
          {donationDate: "2023-06-01T00:00:00Z", status: "Open", donorId: "507f191e810c19729de860ea", commitmentDate: "2023-06-01T00:00:00Z"}
        ], 
        startDate: "2023-06-01T00:00:00Z", 
        status: "Open") 
      {
        foodRequestGroup {
          status
          description
          id
          requests {
            id
            mealTypes {
              tags
              portions
            }
          }
        }
      }
    }
    """
    result = graphql_schema.execute(mutation)
    result.errors is not None
