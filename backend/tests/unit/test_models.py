from app.models.user import User
from app.models.onboarding_request import OnboardingRequest
from app.models.user_info import UserInfo


"""
Sample python test.
For more information on pytest, visit:
https://docs.pytest.org/en/6.2.x/reference.html
"""


def test_create_user():
    user_info = {
        "contact_name": "Yuki Kuran",
        "contact_email": "yukikuran@email.com",
        "contact_phone": "123456789",
        "email": "test1@organization.com",
        "organization_address": "123 Anywhere Street",
        "organization_name": "Test1 Org",
        "role": "Donor",
    }
    user_info = UserInfo(**user_info)
    auth_id = "abc"

    user = User(auth_id=auth_id, info=user_info)
    assert user.auth_id == "abc"


def test_create_onboarding_request():
    user_info = {
        "contact_name": "Yuki Kuran",
        "contact_email": "yukikuran@email.com",
        "contact_phone": "123456789",
        "email": "test1@organization.com",
        "organization_address": "123 Anywhere Street",
        "organization_name": "Test1 Org",
        "role": "Donor",
    }
    status = "Pending"
    user_info = UserInfo(**user_info)
    onboarding_request = OnboardingRequest(info=user_info, status=status)
    assert onboarding_request.info.contact_name == "Yuki Kuran"
    assert onboarding_request.info.contact_email == "yukikuran@email.com"
    assert onboarding_request.info.contact_phone == "123456789"
    assert onboarding_request.info.email == "test1@organization.com"
    assert onboarding_request.info.organization_address == "123 Anywhere Street"
    assert onboarding_request.info.organization_name == "Test1 Org"
    assert onboarding_request.info.role == "Donor"
    assert onboarding_request.status == status
