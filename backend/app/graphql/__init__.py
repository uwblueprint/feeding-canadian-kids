import graphene
import os

from flask import current_app
from .example import ExampleQueries, ExampleMutations
from .services import services
from ..services.implementations.user_service import UserService
from ..services.implementations.email_service import EmailService
from ..services.implementations.auth_service import AuthService
from .auth import AuthMutations
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
    AuthMutations,
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
        services["user_service"] = UserService(logger=current_app.logger)
        services["email_service"] = EmailService(
            logger=current_app.logger,
            credentials={
                "refresh_token": os.getenv("MAILER_REFRESH_TOKEN"),
                "token_uri": "https://oauth2.googleapis.com/token",
                "client_id": os.getenv("MAILER_CLIENT_ID"),
                "client_secret": os.getenv("MAILER_CLIENT_SECRET"),
            },
            sender_email=os.getenv("MAILER_USER"),
            display_name="Display Name",
        )
        services["auth_service"] = AuthService(
            logger=current_app.logger,
            user_service=services["user_service"],
            email_service=services["email_service"],
        )
        services["onboarding_request_service"] = OnboardingRequestService(
            logger=current_app.logger
        )
        services["food_request_service"] = FoodRequestService(logger=current_app.logger)
        pass
