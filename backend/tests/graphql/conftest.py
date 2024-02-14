import pytest
from app.models.user import User
from app.models.onboarding_request import OnboardingRequest
from app.models.meal_request import MealRequest
from app.models.onsite_contact import OnsiteContact
from tests.graphql.mock_test_data import (
    MOCK_INFO1_SNAKE,
    MOCK_INFO2_SNAKE,
    MOCK_ONSITE_CONTACT_1,
    MOCK_ONSITE_CONTACT_2,
    MOCK_USER1_SNAKE,
    MOCK_USER2_SNAKE,
    MOCK_USER3_SNAKE,
    MOCK_MEALREQUEST1_SNAKE,
)


@pytest.fixture(scope="session", autouse=True)
def graphql_schema():
    """
    Returns graphene client for test query/mutation
    """
    from app.graphql import schema as graphql_schema

    yield graphql_schema


@pytest.fixture(scope="function", autouse=True)
def onboarding_request_setup():
    onboarding_request_1 = OnboardingRequest(
        info=MOCK_INFO1_SNAKE, status="Pending"
    ).save()
    onboarding_request_2 = OnboardingRequest(
        info=MOCK_INFO2_SNAKE, status="Approved"
    ).save()

    yield onboarding_request_1, onboarding_request_2

    onboarding_request_1.delete()
    onboarding_request_2.delete()


@pytest.fixture(scope="function", autouse=True)
def user_setup():
    users = []
    for MOCK_USER in [MOCK_USER1_SNAKE, MOCK_USER2_SNAKE, MOCK_USER3_SNAKE]:
        user = User(**MOCK_USER)
        user.save()

        # onsite_contact_1 = OnsiteContact(**MOCK_ONSITE_CONTACT_1)
        # onsite_contact_1.organization_id = user.id
        # onsite_contact_1.save()

        # onsite_contact_2 = OnsiteContact(**MOCK_ONSITE_CONTACT_2)
        # onsite_contact_2.organization_id = user.id
        # onsite_contact_2.save()

        # user.info.onsite_contacts.extend([onsite_contact_1.id, onsite_contact_2.id])
        # user.save()
        users.append(user)

    yield users

    for user in users:
        user.delete()


@pytest.fixture(scope="function", autouse=True)
def meal_request_setup(user_setup):
    requestor, donor, _ = user_setup
    meal_request = MealRequest(requestor=requestor, **MOCK_MEALREQUEST1_SNAKE).save()

    yield requestor, donor, meal_request

    requestor.delete()
    donor.delete()
    meal_request.delete()


@pytest.fixture(scope="function", autouse=True)
def onsite_contact_setup(user_setup):
    asp, donor, _ = user_setup
    asp_onsite_contact = OnsiteContact(
        name="Sample Contact",
        email="sample@test.com",
        phone="123-456-7890",
        organization_id=asp.id,
    ).save()
    asp_onsite_contact2 = OnsiteContact(
        name="Sample Contact 2",
        email="sample2@test.com",
        phone="123-456-7890",
        organization_id=asp.id,
    ).save()
    donor_onsite_contact = OnsiteContact(
        name="Sample Contact 2",
        email="sample2@test.com",
        phone="123-333-7890",
        organization_id=donor.id,
    ).save()

    yield asp, donor, [asp_onsite_contact, asp_onsite_contact2], donor_onsite_contact
    asp_onsite_contact.delete()
    donor_onsite_contact.delete()
