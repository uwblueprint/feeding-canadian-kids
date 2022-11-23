import graphene

from .types import Mutation, MutationList
from .services import services
from ..resources.create_user_dto import CreateUserDTO


class User(graphene.ObjectType):
    access_token = graphene.String()
    id = graphene.ID()
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String()
    role = graphene.String()


class UserInput(graphene.InputObjectType):
    email = graphene.String(required=True)
    password = graphene.String(required=True)
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)


class Login(Mutation):
    """
    Returns access token in response body and sets refreshToken as an httpOnly cookie
    """

    class Arguments:
        email = graphene.String()
        password = graphene.String()
        id_token = graphene.String()

    access_token = graphene.String()
    id = graphene.ID()
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String()
    role = graphene.String()

    def mutate(self, info, email, password):
        auth_dto = services["auth_service"].generate_token(email, password)
        info.context["response_cookies"]["refreshToken"] = auth_dto.refresh_token
        newUser = {
            "access_token": auth_dto.access_token,
            "id": auth_dto.id,
            "first_name": auth_dto.first_name,
            "last_name": auth_dto.last_name,
            "email": auth_dto.email,
            "role": auth_dto.role,
        }
        return Login(**newUser)


class Register(Mutation):
    """
    Returns access token & user info, sets refreshToken as httpOnly cookie
    """

    class Arguments:
        user = UserInput(required=True)

    access_token = graphene.String()
    id = graphene.ID()
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String()
    role = graphene.String()

    def mutate(self, info, user):
        kwargs = {
            "email": user.email,
            "password": user.password,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": "ASP",
        }
        userDTO = CreateUserDTO(**kwargs)
        services["user_service"].create_user(userDTO)
        auth_dto = services["auth_service"].generate_token(user.email, user.password)
        info.context["response_cookies"]["refreshToken"] = auth_dto.refresh_token
        services["auth_service"].send_email_verification_link(user.email)
        newUser = {
            "access_token": auth_dto.access_token,
            "id": auth_dto.id,
            "first_name": auth_dto.first_name,
            "last_name": auth_dto.last_name,
            "email": auth_dto.email,
            "role": auth_dto.role,
        }
        return Register(**newUser)


class Refresh(Mutation):
    """
    Returns access token in response body and sets refreshToken as an httpOnly cookie
    """

    access_token = graphene.String()

    def mutate(self, info):
        token = services["auth_service"].renew_token(
            info.context["request_cookies"]["refreshToken"]
        )
        return Refresh(access_token=token)


class Logout(Mutation):
    """
    Revokes all of the specified user's refresh tokens
    """

    class Arguments:
        user_id = graphene.String(required=True)

    success = graphene.Boolean()

    def mutate(self, info, user_id):
        services["auth_service"].revoke_tokens(user_id)
        del info.context["response_cookies"]["refreshToken"]
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
