from datetime import datetime
from typing import (
    Any,
    Dict,
    List,
    Optional,
    Union,
)


class MealRequestDTO:
    def __init__(
        self,
        id: str,
        requestor: Dict[str, Union[str, Dict[str, Union[str, List[float], Dict[str, Dict[str, int]], Dict[str, str], List[Dict[str, str]], bool]]]],
        status: str,
        drop_off_datetime: datetime,
        drop_off_location: str,
        meal_info: Dict[str, Union[int, str]],
        onsite_staff: List[Dict[str, str]],
        date_created: datetime,
        date_updated: datetime,
        delivery_instructions: Optional[str] = ...,
        donation_info: None = ...
    ) -> None: ...
    def validate(self) -> List[Any]: ...
