from app.models.user import User
from app.models.onboarding_request import OnboardingRequest
from app.models.user_info import UserInfo


"""
Sample python test.
For more information on pytest, visit:
https://docs.pytest.org/en/6.2.x/reference.html
"""

test_user_info = {
    "email": "ansonjwhe@gmail.com",
    "organization_address": "123 Waterloo, ON",
    "organization_name": "Feeding Canadian Kids",
    "organization_desc": "Testing123",
    "role": "Donor",
    "role_info": {
        "asp_info": None,
        "donor_info": {
            "type": "Restaurant",
            "tags": ["Halal", "Vegan"],
        },
    },
    "primary_contact": {
        "name": "Anson He",
        "phone": "123-456-7890",
        "email": "ansonjwhe@gmail.com",
    },
    "initial_onsite_contacts": [
        {"name": "Abu", "phone": "123-456-7890", "email": "abu@uwblueprint.org"},
        {"name": "Jane Doe", "phone": "111-222-3333", "email": "example@domain.com"},
    ],
    "active": True,
}


def test_create_user():
    user_info = UserInfo(**test_user_info)
    auth_id = "abc"

    user = User(auth_id=auth_id, info=user_info)
    assert user.auth_id == "abc"


def test_create_onboarding_request():
    status = "Pending"
    user_info = UserInfo(**test_user_info)
    onboarding_request = OnboardingRequest(info=user_info, status=status)
    assert onboarding_request.status == status
    assert onboarding_request.info.email == test_user_info["email"]
    assert (
        onboarding_request.info.organization_address
        == test_user_info["organization_address"]
    )
    assert (
        onboarding_request.info.organization_name == test_user_info["organization_name"]
    )
    assert (
        onboarding_request.info.organization_desc == test_user_info["organization_desc"]
    )
    assert onboarding_request.info.role == test_user_info["role"]
    assert (
        onboarding_request.info.role_info.donor_info.type
        == test_user_info["role_info"]["donor_info"]["type"]
    )
    for i in range(len(test_user_info["role_info"]["donor_info"]["tags"])):
        assert (
            onboarding_request.info.role_info.donor_info.tags[i]
            == test_user_info["role_info"]["donor_info"]["tags"][i]
        )
    assert (
        onboarding_request.info.primary_contact.name
        == test_user_info["primary_contact"]["name"]
    )
    assert (
        onboarding_request.info.primary_contact.phone
        == test_user_info["primary_contact"]["phone"]
    )
    assert (
        onboarding_request.info.primary_contact.email
        == test_user_info["primary_contact"]["email"]
    )
    assert onboarding_request.info.active == test_user_info["active"]
