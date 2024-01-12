from app.graphql import schema as graphql_schema
from app.models.meal_request import MealRequest, MealStatus
from app.models.user_info import UserInfoRole
from app.models.onsite_contact import OnsiteContact

"""
Tests for ONsite contact and query/mutation logic
Running graphql_schema.execute(...) also tests the service logic
"""
def test_create_onsite_contact(onsite_contact_setup):
    asp, donor = onsite_contact_setup

    mutation = f"""
    mutation c{{
      createOnsiteContact(
        email: "bob@test.com",
        name: "Bob Cat",
        organizationId: "{asp.id}",
        phone: "604-433-1111", 
        requestorId: "{asp.id}"
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
    db_result = OnsiteContact.objects(organization_id=asp.id).first()

    for contact in [return_result_contact, db_result]:
      assert contact["name"] == "Bob Cat"
      assert contact["email"] == "bob@test.com"
      assert contact["phone"] == "604-433-1111"