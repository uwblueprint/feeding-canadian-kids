from typing import (
    Dict,
    List,
    Union,
)


class User:
    def to_serializable_dict(
        self
    ) -> Dict[str, Union[str, Dict[str, Union[str, List[float], Dict[str, str], List[Dict[str, str]], bool]], Dict[str, Union[str, List[float], Dict[str, Dict[str, Union[str, List[str]]]], Dict[str, str], List[Dict[str, str]], bool]], Dict[str, Union[str, List[float], Dict[str, Dict[str, int]], Dict[str, str], List[Dict[str, str]], bool]]]]: ...
