from bson.objectid import ObjectId
from datetime import datetime
from typing import (
    Dict,
    List,
    Union,
)


class MealRequest:
    def to_serializable_dict(
        self
    ) -> Dict[str, Union[ObjectId, str, datetime, Dict[str, Union[int, str]], List[Dict[str, str]]]]: ...
