from abc import ABC, abstractmethod


class IFoodRequestService(ABC):
    """
    FoodRequestService interface for handling food request related functionality
    """

    @abstractmethod
    def create_food_requests(self, food_request_data: dict):
        """Create a new FoodRequest object

        :param food_request_data: data of the food request
        :type food_request_data: dict
        :return: list of FoodRequest objects
        :rtype: list
        :raises Exception: if FoodRequest was not created successfully
        """
        pass

    @abstractmethod
    def get_food_requests(self, limit, offset, status=None, near_location=None):
        """Get list of all FoodRequest object

        :param limit: limit number of results
        :type limit: int
        :param offset: offset number of results
        :type offset: int
        :param status: filter by FoodRequest status
        :type status: string
        :param near_location: filter by FoodRequest location proximity
        :type near_location: mongo PointField
        :return: list of FoodRequest dicts
        :rtype: list
        """
        pass

    @abstractmethod
    def get_food_requests_by_user(self, limit, offset, user_id, role, status):
        """Get list of FoodRequest objects associated with user_id

        :param limit: limit number of results
        :type limit: int
        :param offset: offset number of results
        :type offset: int
        :param user_id: The id of the user
        :type user_id: ObjectID
        :param role: role of the user (should be ASP or Donor)
        :type role: string
        :param status: filter by FoodRequest status
        :type status: string
        :return: list of FoodRequest dicts
        :rtype: list
        """
        pass
