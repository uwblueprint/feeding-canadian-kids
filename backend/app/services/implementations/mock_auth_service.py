from app.utilities.get_fe_url import get_fe_url
from .email_service import EmailService

from ..interfaces.auth_service import IAuthService


class MockAuthService(IAuthService):
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
        self.firebase_rest_client = None

    def generate_token(self, email, password, **_):
        return ""

    def revoke_tokens(self, user_id):
        pass

    def renew_token(self, refresh_token):
        return ""

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

            url = get_fe_url()
            set_password_link = "{url}/{ObjectID}/reset-password".format(
                url=url, ObjectID=user.id
            )
            email_body = EmailService.read_email_template(
                "email_templates/reset_password.html"
            ).format(reset_link=set_password_link)
            self.email_service.send_email(
                email, "FCK Reset Password Link", email_body, []
            )

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
            pass
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
            verification_link = ""
            email_body = EmailService.read_email_template(
                "email_templates/verification_email.html"
            ).format(verification_link=verification_link)
            self.email_service.send_email(email, "Verify your email", email_body, [])
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
            url = get_fe_url()
            set_password_link = "{url}/{ObjectID}/set-password".format(
                url=url, ObjectID=objectID
            )

            email_body = EmailService.read_email_template(
                "email_templates/onboarding_request_approved.html"
            ).format(set_password_link=set_password_link)

            self.email_service.send_email(
                email, "Onboarding request approved. Set Password", email_body, []
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
            email_body = EmailService.read_email_template(
                "email_templates/onboarding_request_rejected.html"
            )
            self.email_service.send_email(
                email, "Onboarding request rejected", email_body, []
            )

        except Exception as e:
            self.logger.error(
                "Failed to send onboarding request rejected email for user "
            )
            raise e

    def __is_authorized_by_condition(self, context, condition):
        return True

    def is_authenticated(self, context):
        return True

    def is_authorized_by_role(self, context, *roles):
        return True

    def is_authorized_by_user_id(self, context, requested_user_id):
        return True

    def is_authorized_by_self(self, context, requested_user_id):
        return True

    def is_authorized_by_email(self, context, requested_email):
        return True
