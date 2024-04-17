from typing import TypedDict


from ..services.interfaces.onsite_contact_service import IOnsiteContactService
from ..services.interfaces.user_service import IUserService
from ..services.interfaces.auth_service import IAuthService
from ..services.interfaces.email_service import IEmailService
from ..services.interfaces.onboarding_request_service import IOnboardingRequestService
from ..services.interfaces.meal_request_service import IMealRequestService
from ..services.interfaces.reminder_email_service import IReminderEmailService

"""
Global services for GraphQL that will be initialized with
live app loggers during __init__.py
"""


class ServicesObject(TypedDict):
    user_service: IUserService
    email_service: IEmailService
    auth_service: IAuthService
    onboarding_request_service: IOnboardingRequestService
    meal_request_service: IMealRequestService
    onsite_contact_service: IOnsiteContactService
    reminder_email_service: IReminderEmailService


services: ServicesObject = {
    "user_service": None,
    "email_service": None,
    "auth_service": None,
    "onboarding_request_service": None,
    "meal_request_service": None,
    "onsite_contact_service": None,
    "reminder_email_service": None,
}  # type: ignore
