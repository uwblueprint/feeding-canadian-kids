import os
import graphene

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
        id_token = graphene.String()

    user = graphene.Field(User)

    def mutate(self, info, email, password, id_token):
        auth_dto = None
        if id_token:
            auth_dto = services["auth_service"].verify_token(id_token)
        else:
            auth_dto = services["auth_service"].generate_token(email, password)
        newUser = {
            "access_token": auth_dto.access_token,
            "id": auth_dto.id,
            "first_name": auth_dto.first_name,
            "last_name": auth_dto.last_name,
            "email": auth_dto.email,
            "role": auth_dto.role
        }
        return Login(user=newUser)

class UserInput(graphene.InputObjectType):
    email = graphene.String(required=True)
    password = graphene.String(required=True)
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)

class Register(Mutation):
    """
    Returns access token and user info in response body and sets refreshToken as an httpOnly cookie
    """
    class Arguments:
        user_input = UserInput(required=True)

    user = graphene.Field(User)

    def mutate(self, info, user_input):
        kwargs = {
            "email": user_input.email,
            "password": user_input.password,
            "first_name": user_input.first_name,
            "last_name": user_input.last_name,
            "role": "User"
        }
        user = CreateUserDTO(**kwargs)
        services["user_service"].create_user(user)
        auth_dto = services["auth_service"].generate_token(email, password)
        services["auth_service"].send_email_verification_link(email)
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
        refresh_token = graphene.String()

    access_token = graphene.String()

    def mutate(self, info, refresh_token):
        token = services["auth_service"].renew_token(refresh_token)
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
