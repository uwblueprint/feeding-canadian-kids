from typing import TypedDict
from ..services.interfaces.user_service import IUserService
from ..services.interfaces.auth_service import IAuthService
from ..services.interfaces.email_service import IEmailService
from ..services.interfaces.onboarding_request_service import IOnboardingRequestService
from ..services.interfaces.meal_request_service import IMealRequestService

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

services: ServicesObject = {
    "user_service": None,
    "email_service": None,
    "auth_service": None,
    "onboarding_request_service": None,
    "meal_request_service": None,
}
