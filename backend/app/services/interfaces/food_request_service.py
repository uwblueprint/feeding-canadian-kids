from abc import ABC, abstractmethod


class IFoodRequestService(ABC):
    """
    FoodRequestService interface for handling food request related functionality
    """

    @abstractmethod
    def create_food_request_group(self, description, requestor, commitments):
        """Create a new FoodRequestGroup object and corresponding FoodRequests

        :param description: description of the food request group
        :type description: string
        :param requestor: ID of the ASP user who is requesting food 
        :type requestor: ObjectID 
        :param commitments: list of dates and meal types for the food request group
        :type commitments: list
        :return: dict of FoodRequestGroup object
        :rtype: dict
        :raises Exception: if FoodRequestGroup was not created successfully
        """
        pass

    @abstractmethod
    def get_food_request_groups(self, status, is_matched):
        """Get list of all FoodRequestGroup objects and corresponding FoodRequests

        :param status: filter by FoodRequestGroup status
        :type status: string
        :param is_matched: filter by matched or unmatched FoodRequestGroups
        :type is_matched: boolean 
        :return: list of FoodRequestGroup dicts 
        :rtype: list
        """
        pass

    @abstractmethod
    def get_food_request_groups_by_user(self, user_id, role, status):
        """Get FoodRequestGroup objects and corresponding FoodRequests associated with user_id 

        :param user_id: The id of the user
        :type user_id: ObjectID
        :param role: role of the user (should be ASP or Donor)
        :type role: string 
        :param status: filter by FoodRequestGroup status 
        :type status: string 
        :return: list of FoodRequestGroup dicts 
        :rtype: list
        """
        pass
