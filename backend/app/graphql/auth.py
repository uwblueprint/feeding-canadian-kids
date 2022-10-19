import os
import graphene

from flask import Blueprint, current_app, jsonify, request
from .types import Mutation, MutationList

from ..graphql.services import services

from ..middlewares.auth import (
    require_authorization_by_user_id,
    require_authorization_by_email,
)
from ..middlewares.validate import validate_request
from ..resources.create_user_dto import CreateUserDTO

cookie_options = {
    "httponly": True,
    "samesite": ("None" if os.getenv("PREVIEW_DEPLOY") else "Strict"),
    "secure": (os.getenv("FLASK_CONFIG") == "production"),
}

blueprint = Blueprint("auth", __name__, url_prefix="/auth")

class User(graphene.ObjectType):
    access_token = graphene.String()
    id = graphene.ID()
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String()
    role = graphene.String()


class Login(Mutation):
    """
    Returns access token in response body and sets refreshToken as an httpOnly cookie
    """
    class Arguments:
        email = graphene.String()
        password = graphene.String()
    user = graphene.Field(User)

    def mutate(self, info, code, email, password):
        try:
            auth_dto = None
            if "id_token" in request.json:
                # change id_token into optional default parameter, id_token="none"
                auth_dto = services["auth_service"].verify_token(request.json["id_token"])
            else:
                auth_dto = services["auth_service"].generate_token(email, password)

            # middleware for set cookie
            info.context.set_cookie = code
            
            newUser = {"access_token": auth_dto.access_token, 
            "id": auth_dto.id, 
            "first_name": auth_dto.first_name, 
            "last_name": auth_dto.last_name, 
            "email": auth_dto.email, "role": auth_dto.role}
            return Login(user=newUser)
        except Exception as e:
            error_message = getattr(e, "message", None)
            return jsonify({"error": (error_message if error_message else str(e))}), 500

class Register(Mutation):
    """
    Returns access token and user info in response body and sets refreshToken as an httpOnly cookie
    """
    class Arguments:
        email = graphene.String()
        password = graphene.String()
        firstName = graphene.String()
        lastName = graphene.String()
    user = graphene.Field(User)

    def mutate(self, info, code, email, password, firstName, lastName):
        try:
            kwargs = {"email": email, "password": password, "firstName": firstName, "lastName": lastName, "role": "User"}
            user = CreateUserDTO(**kwargs)
            services["user_service"].create_user(user)
            auth_dto = services["auth_service"].generate_token(
                email, password
            )

            services["auth_service"].send_email_verification_link(email)

            info.context.set_cookie = code

            newUser = {"access_token": auth_dto.access_token, 
            "id": auth_dto.id, 
            "first_name": auth_dto.first_name, 
            "last_name": auth_dto.last_name, 
            "email": auth_dto.email, "role": auth_dto.role}
            return Register(user=newUser)
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
            token = services["auth_service"].renew_token(request.cookies.get("refreshToken"))
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
    success = graphene.Boolean()

    def mutate(self, info, user_id):
        try:
            services["auth_service"].revoke_tokens(user_id)
            return Logout(success=true)
        except Exception as e:
            error_message = getattr(e, "message", None)
            return jsonify({"error": (error_message if error_message else str(e))}), 500



class ResetPassword(Mutation):
    """
    Triggers password reset for user with specified email (reset link will be emailed)
    """
    class Arguments:
        email = graphene.String()
    success = graphene.Boolean()
    def mutate(self, info, email):
        try:
            services["auth_service"].reset_password(email)
            return ResetPassword(success=true)
        except Exception as e:
            error_message = getattr(e, "message", None)
            return jsonify({"error": (error_message if error_message else str(e))}), 500


class AuthMutations(MutationList):
    login = Login.Field()
    register = Register.Field()
    refresh = Refresh.Field()
    logout = Logout.Field()
    reset_password = ResetPassword.Field()
