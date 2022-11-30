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
        :return: dict containing the created onboarding request
        :rtype: dict
        :raises Exception: if onboarding request creation fails
        """
        pass

    @abstractmethod
    def get_all_onboarding_requests(self, role, status):
        """
        Gets all OnboardingRequest objects

        :param role: optional filter for type of onboarding requests
        :type role: string
        :param status: optional filter for status of onboarding requests
        :type status: string 
        :return: list of OnboardingRequest object dicts
        :rtype: [OnboardingRequestDTO]
        :raises Exception: if OnboardingRequests could not be retrieved
        """

    @abstractmethod
    def get_onboarding_request_by_id(self, id):
        """
        Gets OnboardingRequest by id

        :param id: the OnboardingRequest object's id
        :type id: string
        :return: OnboardingRequest object dict
        :rtype: OnboardingRequestDTO
        :raises Exception: if OnboardingRequest could not be retrieved
        """
