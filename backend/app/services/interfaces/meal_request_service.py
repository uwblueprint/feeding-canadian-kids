from abc import ABC, abstractmethod


class IMealRequestService(ABC):
    """
    MealRequestService interface for handling meal request related functionality
    """

    @abstractmethod
    def create_meal_request(
        self,
        description: str,
        requestor_id,
        request_dates,
        meal_info,
        drop_off_time,
        drop_off_location,
        delivery_instructions,
        onsite_staff,
    ):
        """Create a new MealRequest object and corresponding MealRequests

        :param meal_request_details: recipient's email
        :type meal_request_details: dict containing fields like description,
        :return: dict of MealRequest object
        :rtype: dict
        :raises Exception: if MealRequest was not created successfully
        """
        pass

    @abstractmethod
    def update_meal_request(
        self,
        description,
        requestor,
        meal_info,
        donation_datetime,
        drop_off_location,
        delivery_instructions,
        onsite_staff,
        meal_request_id,
    ):
        pass

    @abstractmethod
    def get_meal_requests_by_requestor_id(
        self,
        requestor_id,
        min_drop_off_date,
        max_drop_off_date,
        status,
        offset,
        limit,
        sort_by_date_direction,
    ):
        """
        Gets MealRequest by requestor id

        :param requestor_id: the MealRequest requestor's id
        :type requestor_id: string
        :param min_drop_off_date: the minimum drop off date
        :type min_drop_off_date: datetime
        :param max_drop_off_date: the maximum drop off date
        :type max_drop_off_date: datetime
        :param status: the status of the MealRequest (Open, Fulfilled, Cancelled)
        :type status: string
        :param offset: the offset to start from
        :type offset: int
        :param limit: the limit of results to return
        :type limit: int
        :param sort_by_date_direction: the direction to sort by (ASC or DESC)
        :type sort_by_date_direction: string
        :return: MealRequest object dict
        :rtype: MealRequestDTO
        :raises Exception: if MealRequest could not be retrieved
        """
        pass
