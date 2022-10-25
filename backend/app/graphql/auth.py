import os
import graphene

from flask import request
from .types import Mutation, MutationList
from ..graphql.services import services
from ..resources.create_user_dto import CreateUserDTO


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
        auth_dto = None
        if "id_token" in request.json:
            auth_dto = services["auth_service"].verify_token(request.json["id_token"])
        else:
            auth_dto = services["auth_service"].generate_token(email, password)
        info.context.set_cookie = code
        newUser = {
            "access_token": auth_dto.access_token,
            "id": auth_dto.id,
            "first_name": auth_dto.first_name,
            "last_name": auth_dto.last_name,
            "email": auth_dto.email,
            "role": auth_dto.role
        }
        return Login(user=newUser)


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
        kwargs = {
            "email": email,
            "password": password,
            "firstName": firstName,
            "lastName": lastName,
            "role": "User"
        }
        user = CreateUserDTO(**kwargs)
        services["user_service"].create_user(user)
        auth_dto = services["auth_service"].generate_token(email, password)
        services["auth_service"].send_email_verification_link(email)
        info.context.set_cookie = code
        newUser = {
            "access_token": auth_dto.access_token,
            "id": auth_dto.id,
            "first_name": auth_dto.first_name,
            "last_name": auth_dto.last_name,
            "email": auth_dto.email,
            "role": auth_dto.role
        }
        return Register(user=newUser)


class Refresh(Mutation):
    """
    Returns access token in response body and sets refreshToken as an httpOnly cookie
    """
    class Arguments:
        user_id = graphene.String()

    access_token = graphene.String()

    def mutate(self, info, code, user_id):
        token = services["auth_service"].renew_token(request.cookies.get("refreshToken"))
        info.context.set_cookie = code
        return Refresh(access_token=token)


class Logout(Mutation):
    """
    Revokes all of the specified user's refresh tokens
    """
    class Arguments:
        user_id = graphene.String()

    success = graphene.Boolean()

    def mutate(self, info, user_id):
        services["auth_service"].revoke_tokens(user_id)
        return Logout(success=True)


class ResetPassword(Mutation):
    """
    Triggers password reset for user with specified email (reset link will be emailed)
    """
    class Arguments:
        email = graphene.String()

    success = graphene.Boolean()

    def mutate(self, info, email):
        services["auth_service"].reset_password(email)
        return ResetPassword(success=True)


class AuthMutations(MutationList):
    login = Login.Field()
    register = Register.Field()
    refresh = Refresh.Field()
    logout = Logout.Field()
    reset_password = ResetPassword.Field()
