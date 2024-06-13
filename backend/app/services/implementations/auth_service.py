from .email_service import EmailService
import firebase_admin.auth

from ..interfaces.auth_service import IAuthService
from ...resources.auth_dto import AuthDTO

# from ...resources.create_user_dto import CreateUserDTO
# from ...resources.token import Token
from ...utilities.firebase_rest_client import FirebaseRestClient


class AuthService(IAuthService):
    """
    AuthService implementation with user authentication methods
    """

    def __init__(self, logger, user_service, email_service=None):
        """
        Create an instance of AuthService

        :param logger: application's logger instance
        :type logger: logger
        :param user_service: an user_service instance
        :type user_service: IUserService
        :param email_service: an email_service instance
        :type email_service: IEmailService
        """
        self.logger = logger
        self.user_service = user_service
        self.email_service = email_service
        self.firebase_rest_client = FirebaseRestClient(logger)

    def generate_token(self, email, password, **_):
        try:
            token = self.firebase_rest_client.sign_in_with_password(email, password)
            user = self.user_service.get_user_by_email(email)
            return AuthDTO(**{**token.__dict__, **user.__dict__})
        except Exception as e:
            self.logger.error(
                "Failed to generate token for user with email {email}".format(
                    email=email
                )
            )
            raise e

    # generate_token_for_oauth function is not being used
    # def generate_token_for_oauth(self, id_token, user_to_create=None, **_):
    #     try:
    #         google_user = self.firebase_rest_client.sign_in_with_google(id_token)
    #         # google_user["idToken"] refers to the user's Firebase Auth access token
    #         token = Token(google_user["idToken"], google_user["refreshToken"])
    #         # If user already has a login with this email, just return the token
    #         try:
    #             # Note: error message will be logged from UserService if this fails.
    #             # May want to silence the logger for this special OAuth lookup case
    #             user = self.user_service.get_user_by_email(google_user["email"])
    #             return AuthDTO(**{**token.__dict__, **user.__dict__})
    #         except Exception:
    #             if user_to_create is None:
    #                 raise

    #         user = self.user_service.create_user(
    #             CreateUserDTO(
    #                 **{
    #                     **user_to_create.__dict__,
    #                     "email": google_user["email"],
    #                 }
    #             ),
    #             auth_id=google_user["localId"],
    #             signup_method="GOOGLE",
    #         )
    #         return AuthDTO(**{**token.__dict__, **user.__dict__})
    #     except Exception as e:
    #         reason = getattr(e, "message", None)
    #         self.logger.error(
    #             "Failed to generate token for user with OAuth id token. "
    #             + "Reason = {reason}".format(reason=(reason if reason else str(e)))
    #         )
    #         raise e

    def revoke_tokens(self, user_id):
        try:
            auth_id = self.user_service.get_auth_id_by_user_id(user_id)
            firebase_admin.auth.revoke_refresh_tokens(auth_id)
        except Exception as e:
            reason = getattr(e, "message", None)
            error_message = [
                "Failed to revoke refresh tokens of user with id {user_id}".format(
                    user_id=user_id
                ),
                "Reason =",
                (reason if reason else str(e)),
            ]
            self.logger.error(" ".join(error_message))

    def renew_token(self, refresh_token):
        try:
            return self.firebase_rest_client.refresh_token(refresh_token)
        except Exception as e:
            self.logger.error("Failed to refresh token")
            raise e

    def forgot_password(self, email):
        if not self.email_service:
            error_message = """
                Attempted to call forgot_password but this instance of AuthService
                does not have an EmailService instance
                """
            self.logger.error(error_message)
            raise Exception(error_message)

        try:
            user = self.user_service.get_user_by_email(email)

            url = "https://feeding-canadian-kids-staging.web.app"
            set_password_link = "{url}/{ObjectID}/reset-password".format(
                url=url, ObjectID=user.id
            )
            email_body = EmailService.read_email_template(
                "email_templates/reset_password.html"
            ).format(reset_link=set_password_link)
            self.email_service.send_email(email, "FCK Reset Password Link", email_body)

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to send password reset link for {email}. "
                + f"Reason = {reason if reason else str(e)}"
            )
            raise e

    def reset_password(self, email, password):
        if not self.email_service:
            error_message = """
                Attempted to call reset_password but this instance of AuthService
                does not have an EmailService instance
                """
            self.logger.error(error_message)
            raise Exception(error_message)

        try:
            firebase_user = firebase_admin.auth.get_user_by_email(email)
            auth_id = firebase_user.uid

            firebase_admin.auth.update_user(auth_id, password=password)

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to reset password for {email}. "
                + f"Reason = {reason if reason else str(e)}"
            )
            raise e

    def send_email_verification_link(self, email):
        if not self.email_service:
            error_message = """
                Attempted to call send_email_verification_link but this instance
                of AuthService does not have an EmailService instance
                Attempted to call send_email_verification_link but this instance
                of AuthService does not have an EmailService instance
                """
            self.logger.error(error_message)
            raise Exception(error_message)

        try:
            verification_link = firebase_admin.auth.generate_email_verification_link(
                email,
                firebase_admin.auth.ActionCodeSettings(
                    "https://feeding-canadian-kids-staging.web.app"
                ),
            )
            email_body = EmailService.read_email_template(
                "email_templates/verification_email.html"
            ).format(verification_link=verification_link)
            self.email_service.send_email(email, "Verify your email", email_body)
        except Exception as e:
            self.logger.error(
                "Failed to generate email verification link for user "
                + "with email {email}.".format(email=email)
            )
            raise e

    def send_onboarding_request_approve_email(self, objectID, email):
        if not self.email_service:
            error_message = """
                Attempted to call send_onboarding_request_approve_email but this
                instance of AuthService does not have an EmailService instance
                """
            self.logger.error(error_message)
            raise Exception(error_message)

        try:
            url = "https://feeding-canadian-kids-staging.web.app"
            set_password_link = "{url}/{ObjectID}/set-password".format(
                url=url, ObjectID=objectID
            )

            email_body = EmailService.read_email_template(
                "email_templates/onboarding_request_approved.html"
            ).format(set_password_link=set_password_link)

            self.email_service.send_email(
                email, "Onboarding request approved. Set Password", email_body
            )

        except Exception as e:
            self.logger.error(
                "Failed to send onboarding request approved email for user "
            )
            raise e

    def send_onboarding_request_rejected_email(self, email):
        if not self.email_service:
            error_message = """
                Attempted to call send_onboarding_request_rejected_email but this
                instance of AuthService does not have an EmailService instance
                """
            self.logger.error(error_message)
            raise Exception(error_message)

        try:
            email_body = EmailService.EmailService.read_email_template(
                "email_templates/onboarding_request_rejected.html"
            )
            self.email_service.send_email(
                email, "Onboarding request rejected", email_body
            )

        except Exception as e:
            self.logger.error(
                "Failed to send onboarding request rejected email for user "
            )
            raise e

    def __is_authorized_by_condition(self, context, condition):
        return context.firebase_user.email_verified and (
            condition or context.user.info.role == "Admin"
        )

    def is_authenticated(self, context):
        try:
            return context.firebase_user.email_verified
        except Exception:
            return False

    def is_authorized_by_role(self, context, roles):
        try:
            return self.__is_authorized_by_condition(
                context,
                context.user.info.role in roles,
            )
        except Exception:
            return False

    def is_authorized_by_user_id(self, context, requested_user_id):
        try:
            return self.__is_authorized_by_condition(
                context, requested_user_id == str(context.user.id)
            )
        except Exception:
            return False

    def is_authorized_by_self(self, context, requested_user_id):
        try:
            return context.firebase_user.email_verified and requested_user_id == str(
                context.user.id
            )
        except Exception:
            return False

    def is_authorized_by_email(self, context, requested_email):
        try:
            return self.__is_authorized_by_condition(
                context,
                requested_email == context.firebase_user.email,
            )
        except Exception:
            return False
