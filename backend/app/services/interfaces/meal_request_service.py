from abc import ABC, abstractmethod


class IMealRequestService(ABC):
    """
    MealRequestService interface for handling meal request related functionality
    """

    @abstractmethod
    def create_meal_request_group(self, meal_request_details):
        """Create a new MealRequestGroup object and corresponding MealRequests

        :param meal_request_details: recipient's email
        :type meal_request_details: dict containing fields like description,
        :return: dict of MealRequestGroup object
        :rtype: dict
        :raises Exception: if MealRequestGroup was not created successfully
        """
        pass
