import pytest
from app.models.user import User
from app.models.onboarding_request import OnboardingRequest
from app.models.meal_request import MealRequest
from tests.graphql.mock_test_data import (
    MOCK_INFO1_SNAKE,
    MOCK_INFO2_SNAKE,
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


@pytest.fixture(scope="session", autouse=True)
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


@pytest.fixture(scope="session", autouse=True)
def user_setup():
    user_1 = User(**MOCK_USER1_SNAKE).save()
    user_2 = User(**MOCK_USER2_SNAKE).save()
    user_3 = User(**MOCK_USER3_SNAKE).save()

    yield user_1, user_2, user_3

    user_1.delete()
    user_2.delete()
    user_3.delete()


@pytest.fixture(scope="session", autouse=True)
def meal_request_setup(user_setup):
    requestor, donor, _ = user_setup
    meal_request = MealRequest(requestor=requestor, **MOCK_MEALREQUEST1_SNAKE).save()

    yield requestor, donor, meal_request

    requestor.delete()
    donor.delete()
    meal_request.delete()

@pytest.fixture(scope="session", autouse=True)
def onsite_contact_setup(user_setup):
    asp, donor, _ = user_setup
    # meal_request = MealRequest(requestor=requestor, **MOCK_MEALREQUEST1_SNAKE).save()
    # yield requestor, donor, meal_request
    yield asp, donor
    # requestor.delete()
    # donor.delete()
    # meal_request.delete()
