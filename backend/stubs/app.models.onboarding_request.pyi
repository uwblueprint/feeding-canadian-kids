from datetime import datetime
from typing import (
    Dict,
    List,
    Union,
)


class OnboardingRequest:
    def to_serializable_dict(
        self
    ) -> Dict[str, Union[Dict[str, Union[str, List[float], Dict[str, Dict[str, Union[str, List[str]]]], Dict[str, str], List[Dict[str, str]], bool]], datetime, str, Dict[str, Union[str, List[float], Dict[str, Dict[str, int]], Dict[str, str], List[Dict[str, str]], bool]], Dict[str, Union[str, List[float], Dict[str, str], List[Dict[str, str]], bool]]]]: ...
