from abc import ABC, abstractmethod

from ...resources.auth_dto import AuthDTO


class IAuthService(ABC):
    @abstractmethod
    def __init__(self, logger, user_service, email_service=None):
        pass

    @abstractmethod
    def send_onboarding_request_approve_email(self, objectID, email):
        pass

    @abstractmethod
    def send_onboarding_request_rejected_email(self, email):
        pass

    @abstractmethod
    def is_authorized_by_self(self, context, requested_user_id):
        pass

    @abstractmethod
    def generate_token(self, email, password) -> AuthDTO:
        """
        Generate a short-lived JWT access token and a long-lived refresh token
        when supplied user's email and password

        :param email: user's email
        :type email: str
        :param password: user's password
        :type password: str
        :return: AuthDTO object containing the access/refresh token and user info
        :rtype: AuthDTO
        :raises Exception: if token generation fails
        """
        pass


    @abstractmethod
    def revoke_tokens(self, user_id):
        """
        Revoke all refresh tokens of a user

        :param user_id: user_id of user whose refresh tokens are to be revoked
        :type user_id: str
        :raises Exception: if token revocation fails
        """
        pass

    @abstractmethod
    def renew_token(self, refresh_token):
        """
        Generate new access and refresh token pair using the provided refresh token

        :param refresh_token: user's refresh token
        :type refresh_token: str
        :return: Token object containing new access and refresh tokens
        :rtype: Token
        :raises Exception: if token renewal fails
        """
        pass

    @abstractmethod
    def forgot_password(self, email):
        """
        Generates a password reset link for the user with the given email
        and sends the reset link to that email address

        :param email: email of user requesting password reset
        :type email: str
        :raises Exception: if unable to generate link or send email
        """
        pass

    @abstractmethod
    def reset_password(self, email):
        """
        Generates a password reset link for the user with the given email
        and sends the reset link to that email address

        :param email: email of user requesting password reset
        :type email: str
        :raises Exception: if unable to generate link or send email
        """
        pass

    @abstractmethod
    def send_email_verification_link(self, email):
        """
        Generates an email verification link for the user with the given email
        and sends the reset link to that email address

        :param email: email of user requesting password reset
        :type email: str
        :raises Exception: if unable to generate link or send email
        """
        pass

    @abstractmethod
    def is_authorized_by_role(self, context, roles):
        """
        Determine if the provided access token is valid and authorized for at least
        one of the specified roles

        :param access_token: user's access token
        :type access_token: str
        :param roles: roles to check for
        :type roles: {str}
        :return: true if token valid and authorized, false otherwise
        :rtype: bool
        """
        pass

    @abstractmethod
    def is_authorized_by_user_id(self, context, requested_user_id):
        """
        Determine if the provided access token is valid and issued to the requestor

        :param access_token: user's access token
        :type access_token: str
        :param requested_user_id: user_id of the requested user
        :type requested_user_id: str
        :return: true if token valid and authorized, false otherwise
        :rtype: bool
        """
        pass

    @abstractmethod
    def is_authorized_by_email(self, context, requested_email):
        """
        Determine if the provided access token is valid and issued to the requested user
        with the specified email address

        :param access_token: user's access token
        :type access_token: str
        :param requested_email: email address of the requested user
        :type requested_email: str
        :return: true if token valid and authorized, false otherwise
        :rtype: bool
        """
        pass

    @abstractmethod
    def is_authenticated(self, context):
        pass

