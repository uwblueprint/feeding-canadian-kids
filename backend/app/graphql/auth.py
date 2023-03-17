import graphene

from .types import Mutation, MutationList
from .services import services
from ..resources.create_user_dto import CreateUserDTO


class CurrentUser(graphene.ObjectType):
    access_token = graphene.String()
    id = graphene.ID()
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String()
    role = graphene.String()


def BaseLogin(method_name):
    class LoginMutation(Mutation):
        """
        Returns access token in response body and sets refreshToken as an
        httpOnly cookie
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

        def mutate(self, info, email=None, password=None, id_token=None):
            method = getattr(services["auth_service"], method_name)
            auth_dto = method(email=email, password=password, id_token=id_token)
            # TODO(jfdoming): For oauth user creation, once we have onboarding requests:
            # auth_dto = method(
            #     email=email,
            #     password=password,
            #     id_token=id_token,
            #     user_to_create=UserInfo(contact_name="John Doe", role="ASP")
            # )
            # first_name, last_name, and role would come from the user info
            info.context.cookies.refresh_token = auth_dto.refresh_token
            newUser = {
                "access_token": auth_dto.access_token,
                "id": auth_dto.id,
                "first_name": auth_dto.first_name,
                "last_name": auth_dto.last_name,
                "email": auth_dto.email,
                "role": auth_dto.role,
            }
            return Login(**newUser)

    return LoginMutation


Login = BaseLogin("generate_token")
LoginWithGoogle = BaseLogin("generate_token_for_oauth")


class Register(Mutation):
    """
    Returns access token & user info, sets refreshToken as httpOnly cookie
    """

    class Arguments:
        email = graphene.String()
        password = graphene.String()
        request_id = graphene.String()

    user = graphene.Field(CurrentUser)

    def mutate(self, info, email, password, request_id):
        kwargs = {
            "email": email,
            "password": password,
            "request_id": request_id,
        }
        userDTO = CreateUserDTO(**kwargs)
        services["user_service"].create_user(userDTO)
        auth_dto = services["auth_service"].generate_token(email, password)
        info.context.cookies.refresh_token = auth_dto.refresh_token
        services["auth_service"].send_email_verification_link(email)
        cur_user = CurrentUser(
            access_token=auth_dto.access_token,
            id=auth_dto.id,
            first_name=auth_dto.first_name,
            last_name=auth_dto.last_name,
            email=auth_dto.email,
            role=auth_dto.role,
        )
        return Register(user=cur_user)


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
    login_with_google = LoginWithGoogle.Field()
    register = Register.Field()
    refresh = Refresh.Field()
    logout = Logout.Field()
    reset_password = ResetPassword.Field()
