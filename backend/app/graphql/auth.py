import os
import graphene

from flask import Blueprint, current_app, jsonify, request
from .types import Mutation, MutationList

from ..middlewares.auth import (
    require_authorization_by_user_id,
    require_authorization_by_email,
)
from ..middlewares.validate import validate_request
from ..resources.create_user_dto import CreateUserDTO
from ..services.implementations.auth_service import AuthService
from ..services.implementations.email_service import EmailService
from ..services.implementations.user_service import UserService

user_service = UserService(current_app.logger)
email_service = EmailService(
    current_app.logger,
    {
        "refresh_token": os.getenv("MAILER_REFRESH_TOKEN"),
        "token_uri": "https://oauth2.googleapis.com/token",
        "client_id": os.getenv("MAILER_CLIENT_ID"),
        "client_secret": os.getenv("MAILER_CLIENT_SECRET"),
    },
    os.getenv("MAILER_USER"),
    "Display Name",  # must replace
)
auth_service = AuthService(current_app.logger, user_service, email_service)

cookie_options = {
    "httponly": True,
    "samesite": ("None" if os.getenv("PREVIEW_DEPLOY") else "Strict"),
    "secure": (os.getenv("FLASK_CONFIG") == "production"),
}

blueprint = Blueprint("auth", __name__, url_prefix="/auth")

class Login(Mutation):
    """
    Returns access token in response body and sets refreshToken as an httpOnly cookie
    """
    class Arguments:
        email = graphene.String()
        password = graphene.String()

    access_token = graphene.String()
    id = graphene.String()
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String()
    role = graphene.String()

    def mutate(self, info, code, email, password):
        try:
            auth_dto = None
            if "id_token" in request.json:
                auth_dto = auth_service.verify_token(request.json["id_token"])
            else:
                auth_dto = auth_service.generate_token(request.json["email"], request.json["password"])

            # middleware for set cookie
            info.context.set_cookie = code

            return Login(access_token=auth_dto.access_token, id=auth_dto.id, first_name=auth_dto.first_name, last_name=auth_dto.last_name, email=auth_dto.email, role=auth_dto.role)
        except Exception as e:
            error_message = getattr(e, "message", None)
            return jsonify({"error": (error_message if error_message else str(e))}), 500


class Register(Mutation):
    """
    Returns access token and user info in response body and sets refreshToken as an httpOnly cookie
    """
    def mutate(self, info, code, email, password):
        try:
            request.json["role"] = "User"
            user = CreateUserDTO(**request.json)
            user_service.create_user(user)
            auth_dto = auth_service.generate_token(
                request.json["email"], request.json["password"]
            )

            auth_service.send_email_verification_link(request.json["email"])

            info.context.set_cookie = code

            return Login(access_token=auth_dto.access_token, id=auth_dto.id, first_name=auth_dto.first_name, last_name=auth_dto.last_name, email=auth_dto.email, role=auth_dto.role)
        except Exception as e:
            error_message = getattr(e, "message", None)
            return jsonify({"error": (error_message if error_message else str(e))}), 500


class Refresh(Mutation):
    """
    Returns access token in response body and sets refreshToken as an httpOnly cookie
    """
    class Arguments:
        user_id = graphene.String()

    access_token = graphene.String()

    def mutate(self, info, code, user_id):
        try:
            token = auth_service.renew_token(request.cookies.get("refreshToken"))
            # middleware for set cookie
            info.context.set_cookie = code
            return Refresh(access_token=token)
        except Exception as e:
            error_message = getattr(e, "message", None)
            return jsonify({"error": (error_message if error_message else str(e))}), 500


class Logout(Mutation):
    """
    Revokes all of the specified user's refresh tokens
    """
    class Arguments:
        user_id = graphene.String()

    def mutate(self, info, user_id):
        try:
            auth_service.revoke_tokens(user_id)
            return Logout()
        except Exception as e:
            error_message = getattr(e, "message", None)
            return jsonify({"error": (error_message if error_message else str(e))}), 500



class ResetPassword(Mutation):
    """
    Triggers password reset for user with specified email (reset link will be emailed)
    """
    class Arguments:
        email = graphene.String()

    def mutate(self, info, email):
        try:
            auth_service.reset_password(email)
            return ResetPassword()
        except Exception as e:
            error_message = getattr(e, "message", None)
            return jsonify({"error": (error_message if error_message else str(e))}), 500


class AuthMutations(MutationList):
    login = Login.Field()
    register = Register.Field()
    refresh = Refresh.Field()
    logout = Logout.Field()
    reset_password = ResetPassword.Field()
