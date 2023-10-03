from abc import ABC, abstractmethod


class IMealRequestService(ABC):
    """
    MealRequestService interface for handling meal request related functionality
    """

    @abstractmethod
    def create_meal_request(self, meal_request_details):
        """Create a new MealRequest object and corresponding MealRequests

        :param meal_request_details: recipient's email
        :type meal_request_details: dict containing fields like description,
        :return: dict of MealRequest object
        :rtype: dict
        :raises Exception: if MealRequest was not created successfully
        """
        pass
    
    @abstractmethod
    def update_meal_request(self, meal_request_id):
        pass
