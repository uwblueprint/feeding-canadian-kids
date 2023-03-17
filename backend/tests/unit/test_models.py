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
    "role": "Donor",
    "primary_contact": {
        "name": "Anson He",
        "phone": "123-456-7890",
        "email": "ansonjwhe@gmail.com",
    },
    "onsite_contacts": [
        {"name": "Abu", "phone": "123-456-7890", "email": "abu@uwblueprint.org"},
        {"name": "Jane Doe", "phone": "111-222-3333", "email": "example@domain.com"},
    ],
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
    assert onboarding_request.info.role == test_user_info["role"]
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
    assert len(onboarding_request.info.onsite_contacts) == len(
        test_user_info["onsite_contacts"]
    )
    for i in range(len(test_user_info["onsite_contacts"])):
        assert (
            onboarding_request.info.onsite_contacts[i].name
            == test_user_info["onsite_contacts"][i]["name"]
        )
        assert (
            onboarding_request.info.onsite_contacts[i].phone
            == test_user_info["onsite_contacts"][i]["phone"]
        )
        assert (
            onboarding_request.info.onsite_contacts[i].email
            == test_user_info["onsite_contacts"][i]["email"]
        )
