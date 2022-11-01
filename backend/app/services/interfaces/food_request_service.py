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
    def get_food_request_groups_by_user(self, user_id, is_impersonation):
        """Get a user's FoodRequestGroup objects and corresponding FoodRequests

        :param user_id: ID of the ASP user 
        :type user_id: ObjectID 
        :param is_impersonation: indicates whether the user is being impersonated by admin
        :type is_impersonation: bool 
        :return: list of of FoodRequestGroup dicts 
        :rtype: list 
        :raises Exception: if FoodRequestGroups were not fetched successfully
        """
        pass


    @abstractmethod
    # only called by admins
    def get_food_request_groups(self):
        """Get list of all FoodRequestGroup objects and corresponding FoodRequests

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
