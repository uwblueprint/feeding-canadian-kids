from app.graphql import schema as graphql_schema
from app.models.meal_request import MealRequest, MealStatus
from app.models.user_info import UserInfoRole
from app.services.implementations.mock_email_service import MockEmailService

from datetime import datetime, timezone
from freezegun import freeze_time


"""
Tests for MealRequestchema and query/mutation logic
Running graphql_schema.execute(...) also tests the service logic
"""


def compare_returned_onsite_contact(result, onsite_contact):
    assert result["id"] == str(onsite_contact.id)
    assert result["name"] == onsite_contact.name
    assert result["email"] == onsite_contact.email
    assert result["phone"] == onsite_contact.phone
    assert result["organizationId"] == str(onsite_contact.organization_id)


@freeze_time("2023-01-01")
def test_create_meal_request(meal_request_setup, onsite_contact_setup):
    (
        asp,
        donor,
        [asp_onsite_contact, asp_onsite_contact2],
        [donor_onsite_contact, donor_onsite_contact2],
    ) = onsite_contact_setup

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
        onsiteContacts: ["{asp_onsite_contact.id}", "{asp_onsite_contact2.id}"],
        requestorId: "{str(asp.id)}",
        requestDates: [
            "2024-06-01",
            "2024-06-02",
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
          onsiteContacts{{
            id
            name
            email
            phone
            organizationId
          }}
        }}
      }}
    }}
  """

    result = graphql_schema.execute(mutation)
    assert result.errors is None
    assert result.data["createMealRequest"]["mealRequests"][0]["status"] == "OPEN"
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
        == "2024-06-01T16:30:00+00:00"
    )
    assert (
        result.data["createMealRequest"]["mealRequests"][1]["dropOffDatetime"]
        == "2024-06-02T16:30:00+00:00"
    )

    created_onsite_contacts = result.data["createMealRequest"]["mealRequests"][0][
        "onsiteContacts"
    ]
    expected_onsite_contacts = (
        [asp_onsite_contact, asp_onsite_contact2]
        if created_onsite_contacts[0]["id"] == str(asp_onsite_contact.id)
        else [asp_onsite_contact2, asp_onsite_contact]
    )
    for created, expected in zip(created_onsite_contacts, expected_onsite_contacts):
        assert created["id"] == str(expected.id)
        assert created["name"] == str(expected.name)
        assert created["email"] == str(expected.email)
        assert created["phone"] == str(expected.phone)
        assert created["organizationId"] == str(expected.organization_id)

    # Delete the created meal requests
    for meal_request in result.data["createMealRequest"]["mealRequests"]:
        MealRequest.objects(id=meal_request["id"]).delete()


@freeze_time("2023-01-01")
def test_create_meal_request_fails_invalid_onsite_contact(
    meal_request_setup, onsite_contact_setup
):
    (
        asp,
        donor,
        [asp_onsite_contact, asp_onsite_contact2],
        [donor_onsite_contact, donor_onsite_contact2],
    ) = onsite_contact_setup

    counter_before = MealRequest.objects().count()
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
        onsiteContacts: ["{asp_onsite_contact}, fdsfdja"],
        requestorId: "{str(asp.id)}",
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
          onsiteContacts{{
            id
          }}
        }}
      }}
    }}
  """

    result = graphql_schema.execute(mutation)
    assert result.errors is not None
    counter_after = MealRequest.objects().count()
    assert counter_before == counter_after


def test_update_meal_request_donation(meal_request_setup, onsite_contact_setup):
    _, donor, meal_request = meal_request_setup

    test_commit_to_meal_request(meal_request_setup)
    (
        _,
        donor,
        [asp_onsite_contact, asp_onsite_contact2],
        [donor_onsite_contact, donor_onsite_contact2],
    ) = onsite_contact_setup

    mutation = f"""
    mutation testUpdateMealRequestDonation {{
      updateMealRequestDonation(
        requestorId: "{str(donor.id)}",
        mealRequestId: "{str(meal_request.id)}",
        mealDescription: "potato chicken nugget",
        additionalInfo: "kimchi fried rice"
        donorOnsiteContacts: ["{str(donor_onsite_contact.id)}", "{str(donor_onsite_contact2.id)}"]
      )
      {{
        mealRequest {{
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
          onsiteContacts {{
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

    meal_request_in_db = (
        MealRequest.objects(id=meal_request.id).first().to_serializable_dict()
    )

    assert (
        meal_request_in_db["donation_info"]["meal_description"]
        == "potato chicken nugget"
    )
    assert meal_request_in_db["donation_info"]["additional_info"] == "kimchi fried rice"
    assert meal_request_in_db["donation_info"]["donor"] == donor.id
    meal_request_donor_onsite_contacts = meal_request_in_db["donation_info"][
        "donor_onsite_contacts"
    ]
    in_db_contacts_sorted_by_id = sorted(
        meal_request_donor_onsite_contacts, key=lambda x: x["id"]
    )
    expected_contacts_sorted_by_id = sorted(
        [
            donor_onsite_contact.to_serializable_dict(),
            donor_onsite_contact2.to_serializable_dict(),
        ],
        key=lambda x: x["id"],
    )
    assert in_db_contacts_sorted_by_id == expected_contacts_sorted_by_id


# If a meal request is created with a date that is the
# same as a previous meal request, an error is thrown
@freeze_time("2023-01-01")
def test_create_meal_request_fails_repeat_date(
    meal_request_setup, onsite_contact_setup
):
    (
        asp,
        donor,
        [asp_onsite_contact, asp_onsite_contact2],
        [donor_onsite_contact, donor_onsite_contact2],
    ) = onsite_contact_setup
    _, _, meal_request = meal_request_setup

    # drop_off_datetime is currently a string, so we need to convert it to a datetime object

    existing_date = datetime.strptime(
        meal_request.drop_off_datetime, "%Y-%m-%dT%H:%M:%S"
    )

    counter_before = MealRequest.objects().count()
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
        onsiteContacts: ["{asp_onsite_contact.id}"],
        requestorId: "{str(asp.id)}",
        requestDates: [
            "2025-06-01",
            "{existing_date.strftime('%Y-%m-%d')}",
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
          onsiteContacts{{
            id
          }}
        }}
      }}
    }}
  """

    result = graphql_schema.execute(mutation)
    assert (
        result.errors[0].message
        == "Unexpected error: Meal request already exists for this ASP on 2025-03-31"
    )
    # This exact error message is searched for in the front end,
    # if it changes, the front end will need to be updated to
    # detect the new error message
    counter_after = MealRequest.objects().count()
    assert counter_before == counter_after


# Happy path: A donor commits to fulfilling one meal request
def test_commit_to_meal_request(meal_request_setup):
    _, donor, meal_request = meal_request_setup

    mutation = f"""
    mutation testCommitToMealRequest {{
      commitToMealRequest(
        requestor: "{str(donor.id)}",
        mealRequestIds: ["{str(meal_request.id)}"],
        mealDescription: "Pizza",
        additionalInfo: "No nuts",
        donorOnsiteContacts: []
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
          onsiteContacts {{
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
    assert result.data["commitToMealRequest"]["mealRequests"][0]["status"] == "UPCOMING"

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

    meal_request_in_db = (
        MealRequest.objects(id=meal_request.id).first().to_serializable_dict()
    )
    assert meal_request_in_db["donation_info"]["donor"] == donor.id
    assert meal_request_in_db["donation_info"]["meal_description"] == "Pizza"
    assert meal_request_in_db["donation_info"]["additional_info"] == "No nuts"

    email_service = MockEmailService.instance
    assert email_service is not None
    all_emails_sent = email_service.get_all_emails_sent()
    donor_email = all_emails_sent[-2]
    requestor_email = all_emails_sent[-1]

    assert donor_email is not None
    assert requestor_email is not None

    assert donor_email["subject"] == "Thank you for committing to a meal request!"
    assert donor_email["to"] == donor.info.email
    assert "Thank you for committing to a meal request!" in donor_email["body"]
    assert (
        f"Number of Meals: {str(meal_request.meal_info.portions)}"
        in donor_email["body"]
    )
    assert f"Dropoff Location: {meal_request.drop_off_location}" in donor_email["body"]
    assert (
        f"Dropoff Time: {meal_request.drop_off_datetime.replace('T', ' ')}"
        in donor_email["body"]
    )

    assert requestor_email["subject"] == "Your meal request has been fulfilled!"
    assert requestor_email["to"] == meal_request.requestor.info.email
    assert "Your meal request has been fulfilled!" in requestor_email["body"]
    assert (
        f"Number of Meals: {str(meal_request.meal_info.portions)}"
        in donor_email["body"]
    )
    assert f"Dropoff Location: {meal_request.drop_off_location}" in donor_email["body"]
    assert (
        f"Dropoff Time: {meal_request.drop_off_datetime.replace('T', ' ')}"
        in donor_email["body"]
    )
    assert (
        donor_email["from_"]
        == "Feeding Canadian Kids <feedingcanadiankids@uwblueprint.org>"
    )
    assert (
        requestor_email["from_"]
        == "Feeding Canadian Kids <feedingcanadiankids@uwblueprint.org>"
    )


# Only user's with role "Donor" should be able to commit
# to meal requests, otherwise an error is thrown
def test_commit_to_meal_request_fails_for_non_donor(
    meal_request_setup, onsite_contact_setup
):
    _, donor, meal_request = meal_request_setup
    requestor, _, asp_onsite_contacts, donor_onsite_contacts = onsite_contact_setup

    # All user info roles except for "Donor"
    INVALID_USERINFO_ROLES = [UserInfoRole.ADMIN.value, UserInfoRole.ASP.value]

    for role in INVALID_USERINFO_ROLES:
        donor.info.role = role
        donor.save()

        mutation = f"""
      mutation testCommitToMealRequest {{
        commitToMealRequest(
          requestor: "{str(donor.id)}",
          mealRequestIds: ["{str(meal_request.id)}"],
          mealDescription: "Pizza",
          additionalInfo: "No nuts"
          donorOnsiteContacts: []
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
        assert (
            result.errors[0].message
            == f'Unexpected error: user "{donor.id}" is not a donor'
        )


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
        meal_request.save()

        mutation = f"""
      mutation testCommitToMealRequest {{
        commitToMealRequest(
          requestor: "{str(donor.id)}",
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


def test_update_meal_request(onsite_contact_setup, meal_request_setup):
    requestor, _, asp_onsite_contacts, donor_onsite_contacts = onsite_contact_setup
    _, _, meal_request = meal_request_setup

    onsite_contact1 = asp_onsite_contacts[0]
    onsite_contact2 = asp_onsite_contacts[1]

    updatedDateTime = "2023-10-31T16:45:00+00:00"
    updatedDeliveryInstructions = "Updated delivery instructions"
    updatedDropOffLocation = "Updated drop off location"
    updatedMealInfo = {
        "portions": 11,
        "dietaryRestrictions": "No nuts",
    }

    mutation = f"""
    mutation testUpdateMealRequest{{
      updateMealRequest(
        requestorId:"{str(requestor.id)}",
        mealRequestId:"{meal_request.id}",
        deliveryInstructions:"{updatedDeliveryInstructions}",
        dropOffDatetime: "{updatedDateTime}",
        dropOffLocation:"{updatedDropOffLocation}",
        mealInfo: {{
          portions: {updatedMealInfo["portions"]},
          dietaryRestrictions: "{updatedMealInfo["dietaryRestrictions"]}",
        }},
        onsiteContacts: ["{onsite_contact1.id}","{onsite_contact2.id}"]
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
          onsiteContacts{{
            id
            name
            email
            phone
            organizationId
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
    returned_onsite_contacts = updatedMealRequest["onsiteContacts"]
    compare_returned_onsite_contact(returned_onsite_contacts[0], onsite_contact1)
    compare_returned_onsite_contact(returned_onsite_contacts[1], onsite_contact2)

    assert updatedMealRequest["dropOffDatetime"] == updatedDateTime


@freeze_time("2023-01-01")
def test_create_meal_request_failure(meal_request_setup):
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
        onsiteContacts: [
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
            "2024-06-01",
            "2024-06-02",
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
            onsiteContacts {{
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
    requestor, donor, admin = user_setup

    test_commit_to_meal_request(meal_request_setup)

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
          onsiteContacts{{
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
    result = executed.data["cancelDonation"]["mealRequest"]
    assert result["donationInfo"] is None
    assert result["id"] == str(meal_request.id)

    db_meal_request = (
        MealRequest.objects(id=meal_request.id).first().to_serializable_dict()
    )
    assert db_meal_request.get("donation_info", None) is None


def test_cancel_donation_fails_if_no_donation(meal_request_setup, user_setup):
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
          onsiteContacts{{
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
    assert executed.errors is not None
    assert (
        executed.errors[0].message
        == f'Meal request "{str(meal_request.id)}" does not have a donation'
    )


def test_cancel_donation_as_non_admin(meal_request_setup):
    _, non_admin, meal_request = meal_request_setup

    mutation = f"""
    mutation testCancelDonation {{
      cancelDonation(
        mealRequestId: "{str(meal_request.id)}",
        requestorId: "{str(non_admin.id)}"
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
          onsiteContacts{{
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
    assert executed.errors is not None
    assert executed.errors[0].message == "Only admins can cancel donations"
    assert executed.data["cancelDonation"] is None


def test_delete_meal_request_as_admin(meal_request_setup, user_setup):
    _, _, meal_request = meal_request_setup
    _, _, admin = user_setup
    mutation = f"""
    mutation testDeleteMealRequest {{
      deleteMealRequest(
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
          onsiteContacts{{
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
    assert executed.errors is None
    result = executed.data["deleteMealRequest"]["mealRequest"]
    assert result["id"] == str(meal_request.id)
    assert MealRequest.objects(id=meal_request.id).first() is None


def test_delete_meal_request_as_asp(meal_request_setup):
    asp, non_admin, meal_request = meal_request_setup
    mutation = f"""
    mutation testDeleteMealRequest {{
      deleteMealRequest(
        mealRequestId: "{str(meal_request.id)}",
        requestorId: "{str(asp.id)}"
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
          onsiteContacts{{
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
    assert executed.errors is None
    result = executed.data["deleteMealRequest"]["mealRequest"]
    assert result["id"] == str(meal_request.id)
    assert MealRequest.objects(id=meal_request.id).first() is None


def test_delete_meal_request_as_non_admin_fails_if_donor(meal_request_setup):
    asp, meal_donor, meal_request = meal_request_setup
    test_commit_to_meal_request(meal_request_setup)

    mutation = f"""
    mutation testDeleteMealRequest {{
      deleteMealRequest(
        mealRequestId: "{str(meal_request.id)}",
        requestorId: "{str(asp.id)}"
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
          onsiteContacts{{
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
    assert (
        executed.errors[0].message
        == "Only admins or requestors who have not found a donor can delete meal requests."
    )
    assert MealRequest.objects(id=meal_request.id).first() is not None


def test_get_meal_request_by_donor_id(meal_request_setup, onsite_contact_setup):
    _, donor, meal_request = meal_request_setup

    (
        asp,
        donor,
        [asp_onsite_contact, asp_onsite_contact2],
        [donor_onsite_contact, donor_onsite_contact2],
    ) = onsite_contact_setup

    commit = graphql_schema.execute(
        f"""mutation testCommitToMealRequest {{
      commitToMealRequest(
        requestor: "{str(donor.id)}",
        mealRequestIds: ["{str(meal_request.id)}"],
        mealDescription: "Pizza",
        additionalInfo: "No nuts",
        donorOnsiteContacts: ["{str(donor_onsite_contact.id)}"],
      )
      {{
        mealRequests {{
          id
        }}
      }}
    }}
    """
    )
    assert commit.errors is None

    executed = graphql_schema.execute(
        f"""{{
          getMealRequestsByDonorId(donorId: "{str(donor.id)}", status: UPCOMING) {{
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
            onsiteContacts {{
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

    assert executed.errors is None
    assert len(executed.data["getMealRequestsByDonorId"]) == 1
    result = executed.data["getMealRequestsByDonorId"][0]

    assert result["id"] == str(meal_request.id)
    assert result["donationInfo"]["donor"]["id"] == str(donor.id)
    assert result["donationInfo"]["mealDescription"] == "Pizza"
    assert result["donationInfo"]["additionalInfo"] == "No nuts"


@freeze_time("2023-01-01")
def test_get_meal_requests_by_ids(meal_request_setup):
    asp, donor, meal_request = meal_request_setup

    create = graphql_schema.execute(
        f"""
    mutation m{{
      createMealRequest(
        deliveryInstructions: "Leave at front door",
        dropOffLocation: "123 Main Street",
        dropOffTime: "16:30:00Z",
        mealInfo: {{
          portions: 40,
          dietaryRestrictions: "7 gluten free, 7 no beef",
        }},
        onsiteContacts: [],
        requestorId: "{str(asp.id)}",
        requestDates: [
            "2025-06-01",
            "2025-06-02",
        ],
      )
      {{
        mealRequests {{
          id
        }}
      }}
    }}
    """
    )
    assert create.errors is None
    created_ml_id = create.data["createMealRequest"]["mealRequests"][0]["id"]
    created_db_meal_request = MealRequest.objects(id=created_ml_id).first()

    executed = graphql_schema.execute(
        f"""query test {{
      getMealRequestsByIds(
        requestorId: "{str(donor.id)}",
        ids: ["{str(meal_request.id)}", "{str(created_ml_id)}"],
      )
      {{
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
            onsiteContacts {{
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
      }}
    """
    )

    assert executed.errors is None
    meal_requests = executed.data["getMealRequestsByIds"]
    assert len(meal_requests) == 2

    for [returned_meal_request, expected] in zip(
        meal_requests, [meal_request, created_db_meal_request]
    ):
        assert returned_meal_request["id"] == str(expected.id)
        assert (
            returned_meal_request["mealInfo"]["dietaryRestrictions"]
            == expected.meal_info.dietary_restrictions
        )


@freeze_time("2023-01-01")
def test_update_meal_request_statuses_to_fulfilled(
    meal_request_service, meal_request_setup
):
    asp, donor, _ = meal_request_setup

    create = graphql_schema.execute(
        f"""
    mutation m{{
      createMealRequest(
        deliveryInstructions: "Leave at front door",
        dropOffLocation: "123 Main Street",
        dropOffTime: "16:30:00Z",
        mealInfo: {{
          portions: 40,
          dietaryRestrictions: "7 gluten free, 7 no beef",
        }},
        onsiteContacts: [],
        requestorId: "{str(asp.id)}",
        requestDates: [
            "2023-06-01",
        ],
      )
      {{
        mealRequests {{
          id
        }}
      }}
    }}
    """
    )
    assert create.errors is None
    created_ml_id = create.data["createMealRequest"]["mealRequests"][0]["id"]

    curr_time = datetime.now(timezone.utc)
    meal_request_service.update_meal_request_statuses_to_fulfilled(curr_time)
    meal_request = MealRequest.objects(id=created_ml_id).first()
    # Because meal request does not have a donor it should not be changed to fulfilled
    assert meal_request.status == MealStatus.OPEN.value

    commit = graphql_schema.execute(
        f"""mutation testCommitToMealRequest {{
      commitToMealRequest(
        requestor: "{str(donor.id)}",
        mealRequestIds: ["{str(created_ml_id)}"],
        mealDescription: "Pizza",
        additionalInfo: "No nuts",
        donorOnsiteContacts: []
      )
      {{
        mealRequests {{
          id
        }}
      }}
    }}
    """
    )
    assert commit.errors is None
    # Check that meal request is fulfilled 7 hours afterwards
    curr_time = datetime(2023, 6, 1, 23, 30, 0, 0, timezone.utc)
    meal_request_service.update_meal_request_statuses_to_fulfilled(curr_time)
    meal_request = MealRequest.objects(id=created_ml_id).first()
    assert meal_request.status == MealStatus.FULFILLED.value


@freeze_time("2023-01-01")
def test_dont_update_meal_request_statuses_to_fulfilled_if_future(
    meal_request_service, meal_request_setup
):
    asp, donor, _ = meal_request_setup

    create = graphql_schema.execute(
        f"""
    mutation m{{
      createMealRequest(
        deliveryInstructions: "Leave at front door",
        dropOffLocation: "123 Main Street",
        dropOffTime: "16:30:00Z",
        mealInfo: {{
          portions: 40,
          dietaryRestrictions: "7 gluten free, 7 no beef",
        }},
        onsiteContacts: [],
        requestorId: "{str(asp.id)}",
        requestDates: [
            "2023-06-25",
        ],
      )
      {{
        mealRequests {{
          id
        }}
      }}
    }}
    """
    )
    assert create.errors is None
    created_ml_id = create.data["createMealRequest"]["mealRequests"][0]["id"]

    commit = graphql_schema.execute(
        f"""mutation testCommitToMealRequest {{
      commitToMealRequest(
        requestor: "{str(donor.id)}",
        mealRequestIds: ["{str(created_ml_id)}"],
        mealDescription: "Pizza",
        additionalInfo: "No nuts",
        donorOnsiteContacts: []
      )
      {{
        mealRequests {{
          id
        }}
      }}
    }}
    """
    )
    assert commit.errors is None

    curr_time = datetime(2023, 6, 25, 17, 0, 0, 0, timezone.utc)
    meal_request_service.update_meal_request_statuses_to_fulfilled(curr_time)
    meal_request = MealRequest.objects(id=created_ml_id).first()
    assert meal_request.status == MealStatus.UPCOMING.value