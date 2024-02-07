from app.graphql import schema as graphql_schema
from app.models.meal_request import MealRequest, MealStatus
from app.models.user_info import UserInfoRole

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
          id
          dropOffDatetime
          mealInfo {{
            portions
            dietaryRestrictions
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


# Happy path: A donor commits to fulfilling one meal request
def test_commit_to_meal_request(meal_request_setup):
    _, donor, meal_request = meal_request_setup

    mutation = f"""
    mutation testCommitToMealRequest {{
      commitToMealRequest(
        requester: "{str(donor.id)}",
        mealRequestIds: ["{str(meal_request.id)}"],
        mealDescription: "Pizza",
        additionalInfo: "No nuts"
      )
      {{
        mealRequests {{
          id
          requestor {{
            id
          }}
          status
          dropOffDatetime
          dropOffLocation
          mealInfo {{
            portions
            dietaryRestrictions
          }}
          onsiteStaff {{
            name
            email
            phone
          }}
          dateCreated
          dateUpdated
          deliveryInstructions
          donationInfo {{
            donor {{
              id
            }}
            commitmentDate
            mealDescription
            additionalInfo
          }}
        }}
      }}
    }}
  """

    result = graphql_schema.execute(mutation)

    assert result.errors is None

    # Verify that the meal request's status was updated
    assert (
        result.data["commitToMealRequest"]["mealRequests"][0]["status"]
        == MealStatus.UPCOMING.value
    )

    # Verify that the meal request's donationInfo was populated correctly
    assert result.data["commitToMealRequest"]["mealRequests"][0]["donationInfo"][
        "donor"
    ]["id"] == str(donor.id)
    assert (
        result.data["commitToMealRequest"]["mealRequests"][0]["donationInfo"][
            "mealDescription"
        ]
        == "Pizza"
    )
    assert (
        result.data["commitToMealRequest"]["mealRequests"][0]["donationInfo"][
            "additionalInfo"
        ]
        == "No nuts"
    )


# Only user's with role "Donor" should be able to commit
# to meal requests, otherwise an error is thrown
def test_commit_to_meal_request_fails_for_non_donor(meal_request_setup):
    _, donor, meal_request = meal_request_setup

    # All user info roles except for "Donor"
    INVALID_USERINFO_ROLES = [UserInfoRole.ADMIN.value, UserInfoRole.ASP.value]

    for role in INVALID_USERINFO_ROLES:
        donor.info.role = role

        mutation = f"""
      mutation testCommitToMealRequest {{
        commitToMealRequest(
          requester: "{str(donor.id)}",
          mealRequestIds: ["{str(meal_request.id)}"],
          mealDescription: "Pizza",
          additionalInfo: "No nuts"
        )
        {{
          mealRequests {{
            id
          }}
        }}
      }}
    """

        result = graphql_schema.execute(mutation)
        assert result.errors is not None


# A donor can only commit to a meal request if the meal request's
# status is "Open", otherwise an error is thrown
def test_commit_to_meal_request_fails_if_not_open(meal_request_setup):
    _, donor, meal_request = meal_request_setup

    # All meal statuses except for "Open"
    INVALID_MEAL_STATUSES = [
        MealStatus.UPCOMING.value,
        MealStatus.FULFILLED.value,
        MealStatus.CANCELLED.value,
    ]

    for meal_status in INVALID_MEAL_STATUSES:
        meal_request.status = meal_status

        mutation = f"""
      mutation testCommitToMealRequest {{
        commitToMealRequest(
          requester: "{str(donor.id)}",
          mealRequestIds: ["{str(meal_request.id)}"],
          mealDescription: "Pizza",
          additionalInfo: "No nuts"
        )
        {{
          mealRequests {{
            id
          }}
        }}
      }}
    """

        result = graphql_schema.execute(mutation)
        assert result.errors is not None


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


def test_cancel_donation_as_admin(meal_request_setup, user_setup):
    _, _, meal_request = meal_request_setup
    _, _, admin = user_setup

    mutation = f"""
    mutation testCancelDonation {{
      cancelDonation(
        mealRequestId: "{str(meal_request.id)}",
        requestorId: "{str(admin.id)}"
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

    executed = graphql_schema.execute(mutation)

    print("#####")
    print(executed)
    result = executed.data["cancelDonation"]["mealRequest"]
    assert result["donationInfo"] == None
    assert result["id"] == str(meal_request.id)


def test_cancel_donation_as_non_admin(meal_request_setup):
    _, non_admin, meal_request = meal_request_setup

    mutation = f"""
    mutation testCancelDonation {{
      cancelDonation(
        mealRequestId: "{str(meal_request.id)}",
        requestorId: "{str(non_admin.id)}"
      )
      {{
        mealRequest {{
          id
        }}
      }}
    }}
    """

    executed = graphql_schema.execute(mutation)
    assert executed.data["cancelDonation"] == None
