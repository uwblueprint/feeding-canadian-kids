import graphene

from flask import current_app
from .example import ExampleQueries, ExampleMutations
from .services import services
from .food_request import FoodRequestMutations
from ..services.implementations.food_request_service import FoodRequestService
from ..services.implementations.onboarding_request_service import (
    OnboardingRequestService,
)
from .onboarding_request import OnboardingRequestMutations


class RootQuery(
    # All queries listed here will be merged.
    ExampleQueries,
):
    pass


class RootMutation(
    # All mutations listed here will be merged.
    ExampleMutations,
    OnboardingRequestMutations,
    FoodRequestMutations,
):
    pass


schema = graphene.Schema(
    query=RootQuery,
    mutation=RootMutation,
)


def init_app(app):
    with app.app_context():
        # Add your services here: services["service_name"] = ...
        services["onboarding_request_service"] = OnboardingRequestService(
            logger=current_app.logger
        )
        services["food_request_service"] = FoodRequestService(logger=current_app.logger)
        pass
