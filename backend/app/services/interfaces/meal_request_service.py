from abc import ABC, abstractmethod


class IMealRequestService(ABC):
    """
    MealRequestService interface for handling meal request related functionality
    """

    @abstractmethod
    def create_meal_request(self, 
        description: str,
        requestor,
        request_dates,
        meal_info,
        drop_off_time,
        drop_off_location,
        delivery_instructions,
        onsite_staff):
        """Create a new MealRequest object and corresponding MealRequests

        :param meal_request_details: recipient's email
        :type meal_request_details: dict containing fields like description,
        :return: dict of MealRequest object
        :rtype: dict
        :raises Exception: if MealRequest was not created successfully
        """
        pass
