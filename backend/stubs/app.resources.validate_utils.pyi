from typing import (
    Any,
    Dict,
    List,
    Optional,
    Union,
)


def validate_contact(contact: Dict[str, str], contact_str: str, error_list: List[Any]) -> List[Any]: ...


def validate_coordinates(coordinates: List[float], error_list: List[Any]) -> List[Any]: ...


def validate_meal_info(meal_info: Dict[str, Union[int, str]], error_list: List[Any]) -> None: ...


def validate_role_info(
    role: str,
    role_info: Optional[Union[Dict[str, Dict[str, int]], Dict[str, Dict[str, Union[str, List[str]]]]]],
    role_info_str: str,
    error_list: List[Any]
) -> List[Any]: ...


def validate_user(
    user: Dict[str, Union[str, Dict[str, Union[str, List[float], Dict[str, Dict[str, int]], Dict[str, str], List[Dict[str, str]], bool]]]],
    user_str: str,
    error_list: List[Any]
) -> None: ...


def validate_userinfo(userinfo: Dict[str, Any], error_list: List[Any]) -> List[Any]: ...
