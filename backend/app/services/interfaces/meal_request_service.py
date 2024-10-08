from abc import ABC, abstractmethod
from typing import Union, List

from ...resources.meal_request_dto import MealRequestDTO


class IMealRequestService(ABC):
    """
    MealRequestService interface for handling meal request related functionality
    """

    @abstractmethod
    def create_meal_request(
        self,
        requestor_id,
        request_dates,
        meal_info,
        drop_off_time,
        delivery_instructions,
        onsite_contacts: List[str],
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
        requestor_id: str,
        meal_info,
        drop_off_datetime,
        delivery_instructions,
        onsite_contacts: List[str],
        meal_request_id,
    ):
        pass

    @abstractmethod
    def update_meal_request_donation(
        self,
        requestor_id: str,
        meal_request_id,
        meal_description: str,
        additional_info: str,
        donor_onsite_contacts: List[str],
    ):
        pass

    @abstractmethod
    def commit_to_meal_request(
        self,
        donor_id: str,
        meal_request_ids: List[str],
        meal_description: str,
        additional_info: Union[str, None],
        donor_onsite_contacts: List[str],
    ) -> List[MealRequestDTO]:
        pass

    @abstractmethod
    def get_meal_requests(
        self,
        min_drop_off_date,
        max_drop_off_date,
        status,
        offset,
        limit,
        sort_by_date_direction,
    ) -> List[MealRequestDTO]:
        pass

    @abstractmethod
    def get_meal_request_by_id(
        self,
        id: str,
    ) -> MealRequestDTO:
        pass

    @abstractmethod
    def get_meal_requests_by_ids(
        self,
        ids: List[str],
    ) -> List[MealRequestDTO]:
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
        :param status: the status of the MealRequest
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

    @abstractmethod
    def get_meal_requests_by_donor_id(
        self,
        donor_id,
        min_drop_off_date,
        max_drop_off_date,
        status,
        offset,
        limit,
        sort_by_date_direction,
    ):
        """
        Gets MealRequest by donor id

        :param donor_id: the MealRequest donor's id
        :type donor_id: string
        :param min_drop_off_date: the minimum drop off date
        :type min_drop_off_date: datetime
        :param max_drop_off_date: the maximum drop off date
        :type max_drop_off_date: datetime
        :param status: the status of the MealRequest
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

    @abstractmethod
    def send_donor_commit_email(self, meal_request_id, email, meal_requestor):
        """
        Sends an email to the user with the given email, notifying them that they have committed to a meal request
        :param meal_request_id: the id of the meal request
        :type email: str
        :raises Exception: if unable to send email
        """

    @abstractmethod
    def send_requestor_commit_email(self, meal_request_id, email, meal_requestor):
        """
        Sends an email to the user with the given email, notifying them that their meal request was successful
        :param meal_request_id: the id of the meal request
        :type email: str
        :raises Exception: if unable to send email
        """

    @abstractmethod
    def update_meal_request_statuses_to_fulfilled(self, current_time):
        """
        This method is called regularly (every 24 hours) to update the meal statues.
        """
        pass
