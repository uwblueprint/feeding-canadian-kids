from abc import ABC, abstractmethod
from typing import Optional, Union, List

from ...resources.onsite_contact_dto import OnsiteContactDTO
from ...resources.meal_request_dto import MealRequestDTO


class IOnsiteContactService(ABC):
    """
    OnsiteContactService for handling requests relating to onsite contacts
    """

    @abstractmethod
    def create_onsite_contact(
        self,
        organization_id: str,
        name: str,
        email: str,
        phone: str,
    ) -> OnsiteContactDTO:
        pass

    @abstractmethod
    def update_onsite_contact_by_id(
        self,
        id: str,
        name: Optional[str],
        email: Optional[str],
        phone: Optional[str],
    ) -> OnsiteContactDTO:
        pass

    @abstractmethod
    def delete_onsite_contact_by_id(
        self,
        id: str,
    ):
        pass

    @abstractmethod
    def get_onsite_contacts_for_user_by_id(
        self,
        user_id: str,
    ) -> List[OnsiteContactDTO]:
        pass

    @abstractmethod
    def get_onsite_contact_by_id(
        self,
        id: str,
    ) -> OnsiteContactDTO:
        pass
