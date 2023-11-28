from .validate_utils import validate_userinfo
from typing import Any, Dict, List


class UserDTO:
    def __init__(self, id: str, info: Dict[str, Any]) -> None:
        self.id = id
        self.info = info

        error_list = self.validate()
        if len(error_list) > 0:
            error_message = "\n".join(error_list)
            raise Exception(error_message)

    def validate(self) -> List[Any]:
        error_list = validate_userinfo(self.info, [])

        if type(self.id) is not str:
            error_list.append("The id supplied is not a string.")

        return error_list
