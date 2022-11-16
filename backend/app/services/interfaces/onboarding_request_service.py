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
    def get_all_onboarding_requests(self):
        """
        Gets all OnboardingRequest objects

        :param: // incorporate filters here?
        :return: list of OnboardingRequest object dicts
        :rtype: list
        :raises Exception: if OnboardingRequests could not be retrieved
        """

    @abstractmethod
    def get_onboarding_request_by_id(self, id):
        """
        Gets OnboardingRequest by id

        :param id: the OnboardingRequest object's id
        :type id: string
        :return: OnboardingRequest object dict
        :rtype: dict
        :raises Exception: if OnboardingRequest could not be retrieved
        """
