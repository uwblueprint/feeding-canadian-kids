from typing import (
    Any,
    Dict,
    List,
)


class UserDTO:
    def __init__(self, id: str, info: Dict[str, Any]) -> None: ...
    def validate(self) -> List[Any]: ...
