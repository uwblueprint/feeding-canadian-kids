from datetime import datetime
from typing import (
    Any,
    Dict,
    List,
)


class OnboardingRequestDTO:
    def __init__(self, id: str, info: Dict[str, Any], date_submitted: datetime, status: str) -> None: ...
    def validate(self) -> List[Any]: ...
