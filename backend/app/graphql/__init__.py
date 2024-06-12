import graphene
import os

from flask import current_app


from .onsite_contact_mutations import OnsiteContactMutations
from .onsite_contact_queries import OnsiteContactQueries
from .example import ExampleQueries, ExampleMutations
from .user_queries import UserQueries
from .user_mutations import UserMutations
from .services import services
from ..services.implementations.user_service import UserService
from ..services.implementations.email_service import EmailService
from ..services.implementations.reminder_email_service import ReminderEmailService
from ..services.implementations.auth_service import AuthService
from ..services.implementations.mock_auth_service import MockAuthService
from ..services.implementations.onsite_contact_service import OnsiteContactService
from ..services.implementations.mock_email_service import MockEmailService
from .auth import AuthMutations
from .meal_request import MealRequestMutations, MealRequestQueries
from ..services.implementations.meal_request_service import MealRequestService
from ..services.implementations.onboarding_request_service import (
    OnboardingRequestService,
)
from .onboarding_request import OnboardingRequestMutations, OnboardingRequestQueries


class RootQuery(
    # All queries listed here will be merged.
    ExampleQueries,
    UserQueries,
    OnboardingRequestQueries,
    MealRequestQueries,
    OnsiteContactQueries,
):
    pass


class RootMutation(
    # All mutations listed here will be merged.
    ExampleMutations,
    AuthMutations,
    OnboardingRequestMutations,
    MealRequestMutations,
    UserMutations,
    OnsiteContactMutations,
):
    pass


schema = graphene.Schema(
    query=RootQuery,
    mutation=RootMutation,
)


def init_email_service(app):
    print("Initializing email service")
    if app.config["TESTING"]:
        os.environ["ENV"] = "testing"
        print("Using mock email service in testing!")
        services["email_service"] = MockEmailService(
            logger=current_app.logger,
            credentials={},
            sender_email=os.getenv("MAILER_USER"),
            display_name="Feeding Canadian Kids",
        )
    else:
        services["email_service"] = EmailService(
            logger=current_app.logger,
            credentials={
                "refresh_token": os.getenv("MAILER_REFRESH_TOKEN"),
                "token_uri": "https://oauth2.googleapis.com/token",
                "client_id": os.getenv("MAILER_CLIENT_ID"),
                "client_secret": os.getenv("MAILER_CLIENT_SECRET"),
            },
            sender_email=os.getenv("MAILER_USER"),
            display_name="Feeding Canadian Kids",
        )

def init_auth_service(app):
    print("Initializing auth service")
    if app.config["TESTING"]:
        os.environ["ENV"] = "testing"
        print("Using mock auth service in testing!")
        services["auth_service"] = MockAuthService(
            logger=current_app.logger,
            user_service=services["user_service"],
            email_service=services["email_service"],
        )
    else:
        services["auth_service"] = AuthService(
            logger=current_app.logger,
            user_service=services["user_service"],
            email_service=services["email_service"],
        )


def init_app(app):
    with app.app_context():
        init_email_service(app)
        services["onsite_contact_service"] = OnsiteContactService(
            logger=current_app.logger
        )
        services["user_service"] = UserService(
            logger=current_app.logger,
            onsite_contact_service=services["onsite_contact_service"],
        )
        init_auth_service(app)
        services["onboarding_request_service"] = OnboardingRequestService(
            logger=current_app.logger, email_service=services["email_service"]
        )
        services["meal_request_service"] = MealRequestService(
            logger=current_app.logger, email_service=services["email_service"]
        )
        services["reminder_email_service"] = ReminderEmailService(
            logger=current_app.logger, email_service=services["email_service"]
        )

        return services
