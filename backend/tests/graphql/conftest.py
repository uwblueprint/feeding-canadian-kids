import pytest
import random
import string
from app.models.user import User
from app.models.onboarding_request import OnboardingRequest
from app.models.meal_request import MealRequest
from app.models.onsite_contact import OnsiteContact
from app.services.implementations.mock_email_service import MockEmailService
from app.services.implementations.reminder_email_service import ReminderEmailService
from app.services.implementations.meal_request_service import MealRequestService
from tests.graphql.mock_test_data import (
    MOCK_INFO1_SNAKE,
    MOCK_INFO2_SNAKE,
    MOCK_USER1_CAMEL,
    MOCK_USER1_SNAKE,
    MOCK_USER2_CAMEL,
    MOCK_USER2_SNAKE,
    MOCK_USER3_CAMEL,
    MOCK_USER3_SNAKE,
    MOCK_MEALREQUEST1_SNAKE,
)
from flask import current_app


@pytest.fixture(scope="session", autouse=True)
def graphql_schema():
    """
    Returns graphene client for test query/mutation
    """
    from app.graphql import schema as graphql_schema

    yield graphql_schema


@pytest.fixture(scope="function", autouse=True)
def onboarding_request_setup():
    OnboardingRequest.objects().delete()

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
    for MOCK_USER_SNAKE, MOCK_USER_CAMEL in zip(
        [MOCK_USER1_SNAKE, MOCK_USER2_SNAKE, MOCK_USER3_SNAKE],
        [MOCK_USER1_CAMEL, MOCK_USER2_CAMEL, MOCK_USER3_CAMEL],
    ):
        email = (
            "".join(random.choices(string.ascii_lowercase + string.digits, k=10))
            + "@test.com"
        )
        MOCK_USER_SNAKE["info"]["email"] = email
        MOCK_USER_CAMEL["info"]["email"] = email

        user = User(**MOCK_USER_SNAKE)
        user.save()
        users.append(user)

    yield users

    for user in users:
        user.delete()


@pytest.fixture(scope="function", autouse=True)
def meal_request_setup(user_setup):
    requestor, donor, _ = user_setup
    meal_request = MealRequest(requestor=requestor, **MOCK_MEALREQUEST1_SNAKE).save()
    requestor.info.involved_meal_requests = 1
    requestor.save()

    yield requestor, donor, meal_request

    requestor.delete()
    donor.delete()
    meal_request.delete()


@pytest.fixture(scope="function", autouse=True)
def onsite_contact_setup(user_setup):
    asp, donor, _ = user_setup
    asp_onsite_contact = OnsiteContact(
        name="Sample ASP Contact",
        email="sample@test.com",
        phone="123-456-7890",
        organization_id=asp.id,
    ).save()
    asp_onsite_contact2 = OnsiteContact(
        name="Sample ASP Contact 2",
        email="sample2@test.com",
        phone="123-456-7890",
        organization_id=asp.id,
    ).save()
    donor_onsite_contact = OnsiteContact(
        name="Sample Donor Contact 1",
        email="sample2@test.com",
        phone="123-333-7890",
        organization_id=donor.id,
    ).save()
    donor_onsite_contact2 = OnsiteContact(
        name="Sample Donor 2",
        email="sample2@test.com",
        phone="123-333-7890",
        organization_id=donor.id,
    ).save()

    yield asp, donor, [asp_onsite_contact, asp_onsite_contact2], [
        donor_onsite_contact,
        donor_onsite_contact2,
    ]
    asp_onsite_contact.delete()
    donor_onsite_contact.delete()


@pytest.fixture(scope="function", autouse=True)
def reminder_email_setup():
    mock_email_service = MockEmailService.instance
    logger = current_app.logger
    reminder_email_service = ReminderEmailService(logger, mock_email_service)  # type: ignore
    yield reminder_email_service


@pytest.fixture(scope="function", autouse=True)
def meal_request_service():
    logger = current_app.logger
    email_service = MockEmailService.instance
    meal_request_service = MealRequestService(logger, email_service)  # type:ignore
    yield meal_request_service
