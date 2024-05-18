from app.graphql import schema as graphql_schema
from app.models.onsite_contact import OnsiteContact

"""
Tests for ONsite contact and query/mutation logic
Running graphql_schema.execute(...) also tests the service logic
"""


def compare_returned_onsite_contact(result, onsite_contact):
    assert result["id"] == str(onsite_contact.id)
    assert result["name"] == onsite_contact.name
    assert result["email"] == onsite_contact.email
    assert result["phone"] == onsite_contact.phone
    assert result["organizationId"] == str(onsite_contact.organization_id)


def test_create_onsite_contact(onsite_contact_setup):
    asp, donor, onsite_contacts, _ = onsite_contact_setup

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
          organizationId
        }}
      }}
    }}
  """
    result = graphql_schema.execute(mutation)
    assert result.errors is None
    return_result_contact = result.data["createOnsiteContact"]["onsiteContact"]
    db_result = OnsiteContact.objects(
        organization_id=donor.id, id=return_result_contact["id"]
    ).first()

    for contact in [return_result_contact, db_result]:
        assert contact["name"] == "Bob Cat"
        assert contact["email"] == "bob@test.com"
        assert contact["phone"] == "604-433-1111"

    assert return_result_contact["organizationId"] == str(donor.id)
    assert db_result.organization_id == donor.id


def test_update_onsite_contact(onsite_contact_setup):
    asp, donor, asp_onsite_contacts, donor_onsite_contacts = onsite_contact_setup

    # Test for the update mutation
    mutation = f"""
    mutation u{{
      updateOnsiteContact(
        id: "{donor_onsite_contacts[0].id}",
        name: "Updated Bob Cat",
        email: "updated_bob@test.com",
        phone: "604-433-2222",
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
    updated_result_contact = result.data["updateOnsiteContact"]["onsiteContact"]
    updated_db_result = OnsiteContact.objects(id=donor_onsite_contacts[0]["id"]).first()

    for contact in [updated_result_contact, updated_db_result]:
        assert contact["name"] == "Updated Bob Cat"
        assert contact["email"] == "updated_bob@test.com"
        assert contact["phone"] == "604-433-2222"


def test_delete_onsite_contact(onsite_contact_setup):
    asp, donor, onsite_contacts, _ = onsite_contact_setup
    onsite_contact = onsite_contacts[0]

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
    deleted_db_result = OnsiteContact.objects(id=onsite_contact["id"]).first()

    assert deleted_db_result is None


def test_get_onsite_contacts_for_user_by_id(onsite_contact_setup):
    asp, donor, onsite_contacts, _ = onsite_contact_setup
    onsite_contact = onsite_contacts[0]

    # asp = User.objects(id=asp.id).get()
    # asp.info.onsite_contacts = []
    # asp.save()

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

    assert result["id"] == str(onsite_contact.id)
    assert result["name"] == onsite_contact.name
    assert result["email"] == onsite_contact.email
    assert result["phone"] == onsite_contact.phone


def test_get_onsite_contact_by_id(onsite_contact_setup):
    asp, donor, onsite_contacts, _ = onsite_contact_setup
    onsite_contact = onsite_contacts[0]

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
        organizationId
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
    assert result["organizationId"] == str(onsite_contact.organization_id)
