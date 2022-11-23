from abc import ABC, abstractmethod


class IOnboardingRequestService(ABC):
    """
    OnboardingRequestService interface with onboarding request management methods
    """

    @abstractmethod
    def create_onboarding_request(self, userInfo):
        """
        Create an onboarding request

        :param userInfo: the user info to be created
        :type userInfo: CreateUserInfoRequestDTO
        :return: the created onboarding request
        :rtype: OnboardingRequestDTO
        :raises Exception: if onboarding request creation fails
        """
        pass

    @abstractmethod
    def approve_onboarding_request(self, OnboardingRequest):
        """
        Approve an onboarding request

        :param OnboardingRequest: the onboarding request to be approved
        :return: the new user created from the onboarding request
        :rtype: UserDTO
        :raises Exception: if onboarding request approval fails
        """
        pass
