import graphene

from flask import current_app
from .onboarding_request import OnboardingRequestMutations
from .example import ExampleQueries, ExampleMutations
from .services import services
from ..services.implementations.onboarding_request_service import OnboardingRequestService

class RootQuery(
    # All queries listed here will be merged.
    ExampleQueries,
):
    pass


class RootMutation(
    # All mutations listed here will be merged.
    ExampleMutations,
    OnboardingRequestMutations,
):
    pass


schema = graphene.Schema(
    query=RootQuery,
    mutation=RootMutation,
)

def init_app(app):
    with app.app_context():
        # Add your services here: services["service_name"] = ...
        services["onboarding_request_service"] = OnboardingRequestService(logger=current_app.logger)
        pass
