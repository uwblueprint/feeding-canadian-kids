import graphene

from .types import Mutation, MutationList, UserInfo
from .services import services
from ..resources.create_user_dto import CreateUserDTO


class RegisteredUser(graphene.ObjectType):
    access_token = graphene.String()
    id = graphene.ID()
    info = graphene.Field(UserInfo)


def BaseLogin(method_name):
    class LoginMutation(Mutation):
        """
        Returns access token in response body and sets refreshToken as an
        httpOnly cookie
        """

        class Arguments:
            email = graphene.String(required=True)
            password = graphene.String(required=True)
            id_token = graphene.String(required=True)

        registered_user = graphene.Field(RegisteredUser)

        def mutate(self, info, email=None, password=None, id_token=None):
            method = getattr(services["auth_service"], method_name)
            auth_dto = method(email=email, password=password, id_token=id_token)
            info.context.cookies.refresh_token = auth_dto.refresh_token
            registered_user = RegisteredUser(
                access_token=auth_dto.access_token,
                id=auth_dto.id,
                info=auth_dto.info,
            )
            return Login(registered_user=registered_user)

    return LoginMutation


Login = BaseLogin("generate_token")
# LoginWithGoogle = BaseLogin("generate_token_for_oauth")


class Register(Mutation):
    """
    Returns access token & user info, sets refreshToken as httpOnly cookie
    """

    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        request_id = graphene.String(required=True)

    registered_user = graphene.Field(RegisteredUser)

    def mutate(self, info, email, password, request_id):
        kwargs = {
            "email": email,
            "password": password,
            "request_id": request_id,
        }
        create_user_dto = CreateUserDTO(**kwargs)
        services["user_service"].create_user(create_user_dto)
        auth_dto = services["auth_service"].generate_token(email, password)
        info.context.cookies.refresh_token = auth_dto.refresh_token
        services["auth_service"].send_email_verification_link(email)
        registered_user = RegisteredUser(
            access_token=auth_dto.access_token,
            id=auth_dto.id,
            info=auth_dto.info,
        )
        return Register(registered_user=registered_user)


class Refresh(Mutation):
    """
    Returns access token in response body and sets refreshToken as an httpOnly cookie
    """

    access_token = graphene.String()

    def mutate(self, info):
        token = services["auth_service"].renew_token(info.context.cookies.refresh_token)
        # Just in case we were granted a new refresh token.
        info.context.cookies.refresh_token = token.refresh_token
        return Refresh(access_token=token.access_token)


class Logout(Mutation):
    """
    Revokes all of the specified user's refresh tokens
    """

    class Arguments:
        user_id = graphene.String(required=True)

    success = graphene.Boolean()

    def mutate(self, info, user_id):
        services["auth_service"].revoke_tokens(user_id)
        del info.context.cookies.refresh_token
        return Logout(success=True)


class ForgotPassword(Mutation):
    """
    Triggers forgotten password reset link for user with specified email
    """

    class Arguments:
        email = graphene.String()

    success = graphene.Boolean()

    def mutate(self, info, email):
        services["auth_service"].forgot_password(email)
        return ForgotPassword(success=True)


class ResetPassword(Mutation):
    """
    Triggers password reset for user with specified email
    """

    class Arguments:
        email = graphene.String()
        password = graphene.String()

    success = graphene.Boolean()

    def mutate(self, info, email, password):
        services["auth_service"].reset_password(email, password)
        return ResetPassword(success=True)


class AuthMutations(MutationList):
    forgot_password = ForgotPassword.Field()
    login = Login.Field()
    # login_with_google = LoginWithGoogle.Field()
    register = Register.Field()
    refresh = Refresh.Field()
    logout = Logout.Field()
    reset_password = ResetPassword.Field()
