from abc import ABC, abstractmethod
from typing import Union

from ...models.user_info import UserInfoRole


class IUserService(ABC):
    """
    UserService interface with user management methods
    """

    @abstractmethod
    def get_user_by_id(self, user_id):
        """
        Get user associated with user_id

        :param user_id: user's id
        :type user_id: str
        :return: a UserDTO with user's information
        :rtype: UserDTO
        :raises Exception: if user retrieval fails
        """
        pass

    @abstractmethod
    def get_user_by_email(self, email):
        """
        Get user associated with email

        :param email: user's email
        :type email: str
        :return: a UserDTO with user's information
        :rtype: UserDTO
        :raises Exception: if user retrieval fails
        """
        pass

    @abstractmethod
    def get_user_role_by_auth_id(self, auth_id):
        """
        Get role of user associated with auth_id

        :param auth_id: user's auth_id
        :type auth_id: str
        :return: role of the user
        :rtype: str
        :raises Exception: if user role retrieval fails
        """
        pass

    @abstractmethod
    def get_user_id_by_auth_id(self, auth_id):
        """
        Get id of user associated with auth_id

        :param auth_id: user's auth_id
        :type auth_id: str
        :return: id of the user
        :rtype: str
        :raises Exception: if user_id retrieval fails
        """
        pass

    @abstractmethod
    def get_auth_id_by_user_id(self, user_id):
        """
        Get auth_id of user associated with user_id

        :param user_id: user's id
        :type user_id: str
        :return: auth_id of the user
        :rtype: str
        :raises Exception: if auth_id retrieval fails
        """
        pass

    @abstractmethod
    def get_users(
        self,
        offset: int,
        limit: int,
        role: UserInfoRole,
        name: Union[str, None],
        email: Union[str, None],
    ):
        """
        Get all users (possibly paginated in the future)

        :return: list of UserDTOs
        :rtype: [UserDTO]
        :raises Exception: if user retrieval fails
        """
        pass

    @abstractmethod
    def create_user(self, user, auth_id=None, signup_method="PASSWORD"):
        """
        Create a user, email verification configurable

        :param user: the user to be created
        :type user: CreateUserDTO
        :param auth_id: user's firebase auth id, defaults to None
        :type auth_id: string, optional
        :param signup_method: either "PASSWORD" or "GOOGLE", defaults to "PASSWORD"
        :type signup_method: str, optional
        :return: the created user
        :rtype: UserDTO
        :raises Exception: if user creation fails
        """
        pass

    @abstractmethod
    def update_user_by_id(self, user_id, user):
        """
        Update a user
        Note: The password cannot be updated using this method.
              Use IAuthService.reset_password instead.

        :param user_id: user's id
        :type user_id: str
        :param user: the user to be updated
        :type user: UpdateUserDTO
        :return: the updated user
        :rtype: UserDTO
        :raises Exception: if user update fails
        """
        pass

    @abstractmethod
    def is_user_activated(self, user_id: str) -> bool:
        """
        Check if a user is activated
        """
        pass

    @abstractmethod
    def activate_user_by_id(self, user_id):
        """
        Activate a user

        :param user_id: user's id
        :type user_id: str
        :return: the activated user
        :rtype: UserDTO
        :raises Exception: if user update fails
        """
        pass

    @abstractmethod
    def deactivate_user_by_id(self, user_id):
        """
        Deactivate a user

        :param user_id: user's id
        :type user_id: str
        :return: the deactivated user
        :rtype: UserDTO
        :raises Exception: if user update fails
        """
        pass

    @abstractmethod
    def delete_user_by_id(self, user_id):
        """
        Delete a user by user_id

        :param user_id: user_id of user to be deleted
        :type user_id: str
        :raises Exception: if user deletion fails
        """
        pass

    @abstractmethod
    def delete_user_by_email(self, email):
        """
        Delete a user by email

        :param str email: email of user to be deleted
        :type email: str
        :raises Exception: if user deletion fails
        """
        pass

    @abstractmethod
    def get_asp_near_location(
        self, requestor_id, max_distance, limit, offset, must_have_open_requests
    ):
        """
        Gets all ASPs within certain distance of user

        :param requestor_id: user requesting
        :type requestor_id: str
        :param max_distance: max_distance away from requesting user
        :type max_distance: float
        :param limit: the limit of results to return
        :type limit: int
        :param offset: the offset to start from
        :type offset: int
        :raises Exception: if asp retrieval fails
        """
        pass
