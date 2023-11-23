from app.graphql import schema as graphql_schema
from app.models.meal_request import MealRequest

"""
Tests for MealRequestchema and query/mutation logic
Running graphql_schema.execute(...) also tests the service logic
"""


def test_create_meal_request(meal_request_setup):
    requestor, _, _ = meal_request_setup

    mutation = f"""
    mutation testCreateMealRequest {{
      createMealRequest(
        deliveryInstructions: "Leave at front door",
        dropOffLocation: "123 Main Street",
        dropOffTime: "16:30:00Z",
        mealInfo: {{
          portions: 40,
          dietaryRestrictions: "7 gluten free, 7 no beef",
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
        result.data["createMealRequest"]["mealRequests"][0]["dropOffDatetime"]
        == "2023-06-01T16:30:00+00:00"
    )
    assert (
        result.data["createMealRequest"]["mealRequests"][1]["dropOffDatetime"]
        == "2023-06-02T16:30:00+00:00"
    )

    # Delete the created meal requests
    for meal_request in result.data["createMealRequest"]["mealRequests"]:
        MealRequest.objects(id=meal_request["id"]).delete()


def test_update_meal_request(meal_request_setup):
    _, _, meal_request = meal_request_setup

    updatedDateTime = "2023-10-31T16:45:00+00:00"
    updatedDeliveryInstructions = "Updated delivery instructions"
    updatedDropOffLocation = "Updated drop off location"
    updatedMealInfo = {
        "portions": 11,
        "dietaryRestrictions": "No nuts",
    }
    updatedOnsiteStaff = [
        {"name": "test", "email": "test@test.com", "phone": "604-441-1171"}
    ]

    mutation = f"""
    mutation testUpdateMealRequest{{
      updateMealRequest(
        mealRequestId:"{meal_request.id}",
        deliveryInstructions:"{updatedDeliveryInstructions}",
        dropOffDatetime: "{updatedDateTime}",
        dropOffLocation:"{updatedDropOffLocation}",
        mealInfo: {{
          portions: {updatedMealInfo["portions"]},
          dietaryRestrictions: "{updatedMealInfo["dietaryRestrictions"]}",
        }},
        onsiteStaff:[{{
          name: "{updatedOnsiteStaff[0]["name"]}",
          email: "{updatedOnsiteStaff[0]["email"]}",
          phone: "{updatedOnsiteStaff[0]["phone"]}"
        }}]
      )
      {{
        mealRequest{{
          id
          status
          dropOffDatetime
          dropOffLocation
          mealInfo{{
            portions
            dietaryRestrictions
          }}
          onsiteStaff{{
            name
            email
            phone
          }}
          donationInfo{{
            donor{{
              id
              info{{
                email
              }}
            }}
          }}
          deliveryInstructions
        }}
    }}
  }}
  """
    result = graphql_schema.execute(mutation)
    assert result.errors is None

    updatedMealRequest = result.data["updateMealRequest"]["mealRequest"]

    assert updatedMealRequest["dropOffLocation"] == updatedDropOffLocation
    assert updatedMealRequest["deliveryInstructions"] == updatedDeliveryInstructions
    assert updatedMealRequest["mealInfo"] == updatedMealInfo
    assert updatedMealRequest["onsiteStaff"] == updatedOnsiteStaff
    assert updatedMealRequest["dropOffDatetime"] == updatedDateTime


def test_get_meal_request_failure(meal_request_setup):
    requestor, _, _ = meal_request_setup

    mutation = f"""
    mutation testCreateMealRequest {{
      createMealRequest(
        deliveryInstructions: "Leave at front door",
        dropOffLocation: "123 Main Street",
        dropOffTime: "12:00:00Z",
        mealInfo: {{
          portions: 40,
          dietaryRestrictions: "7 gluten free, 7 no beef",
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
          id
          mealInfo {{
            portions
            dietaryRestrictions
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


def test_get_meal_request_by_requestor_id(meal_request_setup):
    requestor, _, meal_request = meal_request_setup

    executed = graphql_schema.execute(
        f"""{{
          getMealRequestsByRequestorId(requestorId: "{str(requestor.id)}") {{
            id
            requestor {{
              id
            }},
            status,
            dropOffDatetime,
            dropOffLocation,
            mealInfo {{
              portions
              dietaryRestrictions
            }},
            onsiteStaff {{
              name
              email
              phone
            }},
            dateCreated,
            dateUpdated,
            deliveryInstructions,
            donationInfo {{
              donor {{
                id
              }},
              commitmentDate
              mealDescription
              additionalInfo
            }}
          }}
      }}"""
    )

    assert len(executed.data["getMealRequestsByRequestorId"]) == 1
    result = executed.data["getMealRequestsByRequestorId"][0]
    assert result["requestor"]["id"] == str(requestor.id)
    assert result["id"] == str(meal_request.id)
