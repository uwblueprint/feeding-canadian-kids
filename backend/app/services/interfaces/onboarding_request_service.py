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
    def get_all_onboarding_requests(self, number, offset, role, status, sort_by_date_direction):
        """
        Gets all OnboardingRequest objects

        :param number: optional param to get number amount of requests back
        :type number: number
        :param offset: optional param to get requests back from this offset onwards
        :type number: number
        :param role: optional filter for type of onboarding requests
        :type role: string
        :param status: optional filter for status of onboarding requests
        :type status: string
        :param sort_by_date_direction: the direction to sort by (ASC or DESC)
        :type sort_by_date_direction: string
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

    @abstractmethod
    def approve_onboarding_request(self, id):
        """
        Approves an onboarding request

        :param id: the OnboardingRequest object's id
        :type id: string
        :return: OnboardingRequest object dict
        :rtype: OnboardingRequestDTO
        :raises Exception: if OnboardingRequest could not be approved
        """

    @abstractmethod
    def reject_onboarding_request(self, id):
        """
        Rejects an onboarding request

        :param id: the OnboardingRequest object's id
        :type id: string
        :return: OnboardingRequest object dict
        :rtype: OnboardingRequestDTO
        :raises Exception: if OnboardingRequest could not be rejected
        """
        pass
