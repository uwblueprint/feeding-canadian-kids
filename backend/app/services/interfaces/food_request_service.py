from abc import ABC, abstractmethod


class IFoodRequestService(ABC):
    """
    FoodRequestService interface for handling food request related functionality
    """

    @abstractmethod
    def create_food_request_group(self, food_request_details):
        """Create a new FoodRequestGroup object and corresponding FoodRequests

        :param food_request_details: recipient's email
        :type food_request_details: dict containing fields like description,
        :return: dict of FoodRequestGroup object
        :rtype: dict
        :raises Exception: if FoodRequestGroup was not created successfully
        """
        pass
