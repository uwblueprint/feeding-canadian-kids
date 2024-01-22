from app.graphql import schema as graphql_schema
from app.models.meal_request import MealRequest, MealStatus
from app.models.user_info import UserInfoRole
from app.models.onsite_contact import OnsiteContact
from app.models.user import User

"""
Tests for ONsite contact and query/mutation logic
Running graphql_schema.execute(...) also tests the service logic
"""
def test_create_onsite_contact(onsite_contact_setup):
    asp, donor, onsite_contact = onsite_contact_setup

    mutation = f"""
    mutation c{{
      createOnsiteContact(
        email: "bob@test.com",
        name: "Bob Cat",
        organizationId: "{donor.id}",
        phone: "604-433-1111", 
        requestorId: "{donor.id}"
      ){{
        onsiteContact{{
          id
          name
          email 
          phone
        }}
      }}
    }}
  """
    result = graphql_schema.execute(mutation)
    assert result.errors is None
    return_result_contact = result.data["createOnsiteContact"]["onsiteContact"]
    db_result = OnsiteContact.objects(organization_id=donor.id, id=return_result_contact["id"]).first()

    for contact in [return_result_contact, db_result]:
      assert contact["name"] == "Bob Cat"
      assert contact["email"] == "bob@test.com"
      assert contact["phone"] == "604-433-1111"

def test_update_onsite_contact(onsite_contact_setup):
    asp, donor, onsite_contact = onsite_contact_setup

    # Test for the update mutation
    mutation = f"""
    mutation u{{
      updateOnsiteContact(
        id: "{onsite_contact.id}",
        name: "Updated Bob Cat",
        email: "updated_bob@test.com",
        phone: "604-433-2222"
      ){{
        onsiteContact{{
          id
          name
          email 
          phone
        }}
      }}
    }}
    """
    result = graphql_schema.execute(mutation)
    assert result.errors is None
    updated_result_contact = result.data["updateOnsiteContact"]["onsiteContact"]
    updated_db_result = OnsiteContact.objects(id=onsite_contact['id']).first()

    for contact in [updated_result_contact, updated_db_result]:
      assert contact["name"] == "Updated Bob Cat"
      assert contact["email"] == "updated_bob@test.com"
      assert contact["phone"] == "604-433-2222"


def test_delete_onsite_contact(onsite_contact_setup):
    asp, donor, onsite_contact = onsite_contact_setup

    # Test for the delete mutation
    mutation = f"""
    mutation d{{
      deleteOnsiteContact(
        id: "{onsite_contact.id}",
        requestorId: "{asp.id}"
      ){{
        success
      }}
    }}
    """
    result = graphql_schema.execute(mutation)
    assert result.errors is None
    deleted_db_result = OnsiteContact.objects(id=onsite_contact['id']).first()

    assert deleted_db_result is None


def test_get_onsite_contacts_for_user_by_id(onsite_contact_setup):
    asp, donor, onsite_contact = onsite_contact_setup

    asp = User.objects(id=asp.id).get()
    asp.info.onsite_contacts = []
    asp.save()

    # Test for the get_onsite_contact_for_user_by_id query
    query = f"""
    query q{{
      getOnsiteContactForUserById(
        userId: "{asp.id}"
      ){{
        id
        name
        email 
        phone
      }}
    }}
    """
    result = graphql_schema.execute(query)
    assert result.errors is None
    result = result.data["getOnsiteContactForUserById"][0]
    print("result is ", result)

    assert result["id"] == str(onsite_contact.id)
    assert result["name"] == onsite_contact.name
    assert result["email"] == onsite_contact.email
    assert result["phone"] == onsite_contact.phone

def test_get_onsite_contact_by_id(onsite_contact_setup):
    asp, donor, onsite_contact = onsite_contact_setup

    # Test for the get_onsite_contact_by_id query
    query = f"""
    query q{{
      getOnsiteContactById(
        id: "{onsite_contact.id}"
      ){{
        id
        name
        email 
        phone
      }}
    }}
    """
    result = graphql_schema.execute(query)
    assert result.errors is None
    result = result.data["getOnsiteContactById"]

    assert result["id"] == str(onsite_contact.id)
    assert result["name"] == onsite_contact.name
    assert result["email"] == onsite_contact.email
    assert result["phone"] == onsite_contact.phone

